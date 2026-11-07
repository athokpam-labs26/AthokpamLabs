/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Header } from './components/Header';
import { ChatPanel } from './components/ChatPanel';
import { Workbench } from './components/Workbench';
import { SettingsModal } from './components/SettingsModal';
import { DiffModal } from './components/DiffModal';
import { WelcomeScreen } from './components/WelcomeScreen';
import { VirtualFileSystem } from './utils/fileSystem';
import { parseAthokpamArtifact } from './utils/boltArtifactParser';
import { STARTER_TEMPLATES, StarterTemplate } from './templates/starterProjects';
import { LandingPage } from './components/LandingPage';
import { OnboardingModal } from './components/OnboardingModal';
import { GitHubExportModal } from './components/GitHubExportModal';
import { 
  ChatMessage, 
  LayoutMode, 
  ModelOption, 
  ProjectSnapshot, 
  TerminalOutputLine,
  UserProfile
} from './types';
import { recommendModelForUser } from './utils/recommendationEngine';
import { ALL_MODELS } from './data/models';

const INITIAL_MODEL_OPTIONS: ModelOption[] = ALL_MODELS.map((m) => ({
  id: m.id,
  name: m.name,
  provider: m.provider as any,
  recommended: m.recommended,
}));

export default function App() {
  // Check autostart query param
  const urlParams = new URLSearchParams(window.location.search);
  const autostart = urlParams.get('autostart') === '1';

  // Virtual file system instance
  const [fs] = useState(() => new VirtualFileSystem(STARTER_TEMPLATES[0].files));
  const [projectName, setProjectName] = useState(STARTER_TEMPLATES[0].title);
  const [activeFilePath, setActiveFilePath] = useState('src/App.tsx');
  const [hasStarted, setHasStarted] = useState(true); // Default to live workspace so users can see it immediately
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('split');

  // Chat and AI Generation state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      content: `Welcome to **Athokpam Labs**! I've loaded the **${STARTER_TEMPLATES[0].title}** template. Powered by 30+ frontier AI models. You can interact with the live app in the Preview tab on the right, inspect the code in the Code tab, or ask me to modify any part of the app!`,
      timestamp: new Date().toLocaleTimeString(),
      artifact: {
        id: 'initial-setup',
        title: 'Initial Project Mounted',
        actions: [
          { id: 'act-1', type: 'shell', content: 'npm install lucide-react', status: 'completed' },
          { id: 'act-2', type: 'file', filePath: 'src/App.tsx', content: '', status: 'completed' },
          { id: 'act-3', type: 'start', content: 'npm run dev', status: 'completed' },
        ],
      },
    },
  ]);
  const [isStreaming, setIsStreaming] = useState(false);

  // Terminal state
  const [terminalLogs, setTerminalLogs] = useState<TerminalOutputLine[]>([
    { id: '1', type: 'info', text: '⚡ Athokpam Labs virtual container initialized (30+ LLMs supported)', timestamp: '12:00:00' },
    { id: '2', type: 'command', text: '$ npm install react@18 react-dom@18 lucide-react', timestamp: '12:00:01' },
    { id: '3', type: 'success', text: 'added 24 packages in 0.42s', timestamp: '12:00:02' },
    { id: '4', type: 'command', text: '$ npm run dev', timestamp: '12:00:02' },
    { id: '5', type: 'success', text: '  VITE v5.4.2  ready in 148 ms', timestamp: '12:00:03' },
    { id: '6', type: 'info', text: '  ➜  Local:   http://localhost:3000/', timestamp: '12:00:03' },
  ]);

  // Snapshots
  const [snapshots, setSnapshots] = useState<ProjectSnapshot[]>([
    {
      id: 'snap-0',
      title: 'Initial Template',
      timestamp: new Date().toLocaleTimeString(),
      files: { ...STARTER_TEMPLATES[0].files },
    },
  ]);

  // User Profile and View Mode
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('athokpam_user_profile');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [viewMode, setViewMode] = useState<'landing' | 'workspace'>(() => {
    if (urlParams.get('view') === 'workspace' || autostart) return 'workspace';
    return 'landing';
  });

  const isProfileComplete = Boolean(
    userProfile &&
      userProfile.name?.trim() &&
      userProfile.teamName?.trim() &&
      userProfile.agreedToTerms &&
      (userProfile.apiKey?.trim() || userProfile.ollamaEndpoint?.trim())
  );

  const [isOnboardingOpen, setIsOnboardingOpen] = useState(() => !isProfileComplete && !autostart);
  const [isGitHubExportOpen, setIsGitHubExportOpen] = useState(false);
  const [pendingPrompt, setPendingPrompt] = useState<string>('');

  // Settings & Diff Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(() => userProfile?.apiKeyProvider && userProfile.apiKeyProvider !== 'managed-gemini' ? userProfile.apiKeyProvider : 'gemini');
  const [selectedModel, setSelectedModel] = useState(() => userProfile?.selectedModel || 'gemini-3.8-flash');
  const [customApiKey, setCustomApiKey] = useState(() => userProfile?.apiKey || '');
  const [ollamaEndpoint, setOllamaEndpoint] = useState(() => userProfile?.ollamaEndpoint || 'http://127.0.0.1:11434');
  const [customSystemPrompt, setCustomSystemPrompt] = useState('');

  const [diffModalFile, setDiffModalFile] = useState<string | null>(null);

  // File system state version tracker to trigger re-renders
  const [fsVersion, setFsVersion] = useState(0);

  const handleUpdateFileContent = (path: string, content: string) => {
    fs.setFile(path, content, true);
    setFsVersion((v) => v + 1);
  };

  const handleSelectStarter = (starter: StarterTemplate) => {
    fs.loadFiles(starter.files);
    setProjectName(starter.title);
    setActiveFilePath(starter.defaultOpenPath);
    setHasStarted(true);

    const initMsg: ChatMessage = {
      id: `starter-${Date.now()}`,
      sender: 'assistant',
      content: `Loaded **${starter.title}**! You can test it in the Preview panel or ask me to customize any features.`,
      timestamp: new Date().toLocaleTimeString(),
      artifact: {
        id: starter.id,
        title: starter.title,
        actions: [
          { id: 'act-s1', type: 'shell', content: 'npm install', status: 'completed' },
          { id: 'act-s2', type: 'file', filePath: starter.defaultOpenPath, content: '', status: 'completed' },
          { id: 'act-s3', type: 'start', content: 'npm run dev', status: 'completed' },
        ],
      },
    };
    setMessages([initMsg]);
    setSnapshots([
      {
        id: `snap-${Date.now()}`,
        title: `Starter: ${starter.title}`,
        timestamp: new Date().toLocaleTimeString(),
        files: { ...starter.files },
      },
    ]);

    setTerminalLogs([
      { id: `${Date.now()}-1`, type: 'info', text: `⚡ Loading template: ${starter.title}`, timestamp: new Date().toLocaleTimeString() },
      { id: `${Date.now()}-2`, type: 'command', text: '$ npm run dev', timestamp: new Date().toLocaleTimeString() },
      { id: `${Date.now()}-3`, type: 'success', text: '  VITE ready in 110ms on http://localhost:3000/', timestamp: new Date().toLocaleTimeString() },
    ]);

    setFsVersion((v) => v + 1);
  };

  const handleStartWithPrompt = (promptText: string) => {
    setHasStarted(true);
    setViewMode('workspace');
    handleSendMessage(promptText);
  };

  const handleCompleteOnboarding = (profile: UserProfile) => {
    setUserProfile(profile);
    try {
      localStorage.setItem('athokpam_user_profile', JSON.stringify(profile));
    } catch (e) {
      console.warn('Could not save profile to localStorage', e);
    }
    setIsOnboardingOpen(false);

    if (profile.selectedModel) {
      setSelectedModel(profile.selectedModel);
    }
    if (profile.apiKey) {
      setCustomApiKey(profile.apiKey);
    }
    if (profile.apiKeyProvider && profile.apiKeyProvider !== 'managed-gemini') {
      setSelectedProvider(profile.apiKeyProvider);
    }
    if (profile.ollamaEndpoint) {
      setOllamaEndpoint(profile.ollamaEndpoint);
    }

    // If there was a pending prompt submitted from the landing page, launch workspace and execute it
    if (pendingPrompt.trim()) {
      setViewMode('workspace');
      const promptToRun = pendingPrompt;
      setPendingPrompt('');
      handleSendMessage(promptToRun);
    }
  };

  const handleLandingSubmitPrompt = (prompt: string, modelId: string) => {
    if (modelId) setSelectedModel(modelId);
    if (!userProfile) {
      setPendingPrompt(prompt);
      setIsOnboardingOpen(true);
    } else {
      setViewMode('workspace');
      handleSendMessage(prompt);
    }
  };

  // Primary AI Generation flow
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isStreaming) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString(),
    };

    const assistantMsgId = `assistant-${Date.now()}`;
    const initialAssistantMsg: ChatMessage = {
      id: assistantMsgId,
      sender: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg, initialAssistantMsg]);
    setIsStreaming(true);

    // Terminal log
    setTerminalLogs((prev) => [
      ...prev,
      {
        id: `t-${Date.now()}`,
        type: 'info',
        text: `⚡ Athokpam Labs AI (${selectedModel}) planning changes for: "${text.slice(0, 40)}..."`,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            sender: m.sender,
            content: m.content,
          })),
          currentFiles: fs.getAllFilesRecord(),
          model: selectedModel,
          customApiKey: customApiKey || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = '';

      if (reader) {
        let buffer = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('data: ')) {
              try {
                const data = JSON.parse(trimmed.slice(6));
                if (data.text) {
                  accumulatedText += data.text;

                  // Parse partial or completed artifact
                  const { thought, artifact, markdownText } = parseAthokpamArtifact(accumulatedText);

                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMsgId
                        ? {
                            ...msg,
                            content: markdownText || accumulatedText,
                            thought,
                            artifact,
                          }
                        : msg
                    )
                  );

                  // If an artifact with completed file actions is available, update virtual files in real-time!
                  if (artifact && artifact.actions) {
                    let hasNewCompletedFiles = false;
                    for (const action of artifact.actions) {
                      if (action.status === 'completed' && action.type === 'file' && action.filePath && action.content) {
                        fs.setFile(action.filePath, action.content, true);
                        hasNewCompletedFiles = true;
                      }
                    }
                    if (hasNewCompletedFiles) {
                      setFsVersion((v) => v + 1);
                    }
                  }
                }
              } catch (e) {
                // Ignore parse errors on incomplete SSE JSON
              }
            }
          }
        }
      }

      // Final pass on stream completion
      const { thought, artifact, markdownText } = parseAthokpamArtifact(accumulatedText);

      if (artifact) {
        if (artifact.title) {
          setProjectName(artifact.title);
        }
        if (artifact.actions) {
          for (const action of artifact.actions) {
            if (action.type === 'file' && action.filePath && action.content) {
              fs.setFile(action.filePath, action.content, true);
              setTerminalLogs((prev) => [
              ...prev,
              {
                id: `log-f-${Date.now()}-${Math.random()}`,
                type: 'success',
                text: `✓ Wrote ${action.filePath}`,
                timestamp: new Date().toLocaleTimeString(),
              },
            ]);
          } else if (action.type === 'shell') {
            setTerminalLogs((prev) => [
              ...prev,
              {
                id: `log-s-${Date.now()}-${Math.random()}`,
                type: 'command',
                text: `$ ${action.content}`,
                timestamp: new Date().toLocaleTimeString(),
              },
            ]);
          }
        }

        // Take snapshot
        const newSnap: ProjectSnapshot = {
          id: `snap-${Date.now()}`,
          title: artifact.title || `Update: ${text.slice(0, 24)}`,
          timestamp: new Date().toLocaleTimeString(),
          files: fs.getAllFilesRecord(),
        };
        setSnapshots((prev) => [newSnap, ...prev.slice(0, 9)]);
        }
      }

      setTerminalLogs((prev) => [
        ...prev,
        {
          id: `t-done-${Date.now()}`,
          type: 'success',
          text: `⚡ Build complete & hot reloaded in sandbox`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);

      setFsVersion((v) => v + 1);
    } catch (err: any) {
      console.error(err);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsgId
            ? {
                ...msg,
                content: `Error generating application: ${err.message}`,
              }
            : msg
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };

  // Terminal commands runner
  const handleRunTerminalCommand = (command: string) => {
    const cmd = command.trim();
    const now = new Date().toLocaleTimeString();

    setTerminalLogs((prev) => [
      ...prev,
      { id: `t-in-${Date.now()}`, type: 'command', text: `$ ${cmd}`, timestamp: now },
    ]);

    if (cmd === 'clear') {
      setTerminalLogs([]);
      return;
    }

    if (cmd === 'help') {
      setTerminalLogs((prev) => [
        ...prev,
        { id: `t-out-${Date.now()}`, type: 'info', text: 'Available commands: npm run dev, npm install <package>, ls, cat <file>, clear, help', timestamp: now },
      ]);
      return;
    }

    if (cmd === 'ls') {
      const files = fs.getAllFiles().map((f) => f.path).join('  ');
      setTerminalLogs((prev) => [
        ...prev,
        { id: `t-out-${Date.now()}`, type: 'info', text: files, timestamp: now },
      ]);
      return;
    }

    if (cmd.startsWith('cat ')) {
      const target = cmd.slice(4).trim();
      const content = fs.getFileContent(target);
      setTerminalLogs((prev) => [
        ...prev,
        { id: `t-out-${Date.now()}`, type: 'info', text: content || `File not found: ${target}`, timestamp: now },
      ]);
      return;
    }

    if (cmd.startsWith('npm install') || cmd.startsWith('npm i')) {
      const pkg = cmd.split(' ')[2] || 'dependencies';
      setTerminalLogs((prev) => [
        ...prev,
        { id: `t-out-${Date.now()}`, type: 'success', text: `+ ${pkg}@latest installed successfully`, timestamp: now },
      ]);
      return;
    }

    if (cmd === 'npm run dev') {
      setTerminalLogs((prev) => [
        ...prev,
        { id: `t-out-${Date.now()}`, type: 'success', text: '  VITE v5.4.2  ready in 95 ms\n  ➜  Local: http://localhost:3000/', timestamp: now },
      ]);
      return;
    }

    // Default unrecognized
    setTerminalLogs((prev) => [
      ...prev,
      { id: `t-out-${Date.now()}`, type: 'warn', text: `Command executed: ${cmd}`, timestamp: now },
    ]);
  };

  // ZIP export
  const handleDownloadZip = async () => {
    try {
      const zipBlob = await fs.exportAsZip(projectName.toLowerCase().replace(/\s+/g, '-'));
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${projectName.toLowerCase().replace(/\s+/g, '-')}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e: any) {
      alert(`Could not export ZIP: ${e.message}`);
    }
  };

  const handleRestoreSnapshot = (snapshot: ProjectSnapshot) => {
    fs.loadFiles(snapshot.files);
    setFsVersion((v) => v + 1);
    setTerminalLogs((prev) => [
      ...prev,
      {
        id: `t-snap-${Date.now()}`,
        type: 'info',
        text: `⚡ Restored checkpoint: ${snapshot.title}`,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  };

  const handleResetChat = () => {
    setMessages([]);
  };

  const handleOpenDiffModal = (filePath: string) => {
    setDiffModalFile(filePath);
  };

  // Render Diff Modal comparison data
  const diffInfo = useMemo(() => {
    if (!diffModalFile) return null;
    return fs.getDiff(diffModalFile);
  }, [diffModalFile, fs, fsVersion]);

  return (
    <>
      {viewMode === 'landing' ? (
        <LandingPage
          userProfile={userProfile}
          onOpenOnboarding={() => setIsOnboardingOpen(true)}
          onSubmitPrompt={handleLandingSubmitPrompt}
          onOpenWorkspace={() => setViewMode('workspace')}
          selectedModel={selectedModel}
          onChangeModel={setSelectedModel}
        />
      ) : (
        <div className="flex flex-col h-screen w-screen bg-[#090b14] text-slate-100 overflow-hidden font-sans">
          {/* Top Application Header */}
          <Header
            projectName={projectName}
            onRenameProject={setProjectName}
            layoutMode={layoutMode}
            onChangeLayout={setLayoutMode}
            onDownloadZip={handleDownloadZip}
            onOpenSettings={() => setIsSettingsOpen(true)}
            snapshots={snapshots}
            onRestoreSnapshot={handleRestoreSnapshot}
            selectedModel={selectedModel}
            isStreaming={isStreaming}
            userProfile={userProfile}
            onGoToLanding={() => setViewMode('landing')}
            onOpenOnboarding={() => setIsOnboardingOpen(true)}
            onOpenGitHubExport={() => setIsGitHubExportOpen(true)}
          />

          {/* Main Workspace Body */}
          <main className="flex-1 flex overflow-hidden">
            {/* If user hasn't started yet and not autostart, show welcome hero */}
            {!hasStarted && !autostart ? (
              <WelcomeScreen
                onStartWithPrompt={handleStartWithPrompt}
                onSelectStarter={handleSelectStarter}
                selectedModel={selectedModel}
                onSelectModel={setSelectedModel}
                modelOptions={INITIAL_MODEL_OPTIONS}
                onOpenSettings={() => setIsSettingsOpen(true)}
              />
            ) : (
              <div className="flex-1 flex overflow-hidden">
                {/* Left Chat Panel (rendered in split or chat-only mode) */}
                {(layoutMode === 'split' || layoutMode === 'chat-only') && (
                  <div
                    className={`${
                      layoutMode === 'chat-only' ? 'w-full' : 'w-full md:w-[380px] lg:w-[440px]'
                    } h-full shrink-0`}
                  >
                    <ChatPanel
                      messages={messages}
                      onSendMessage={handleSendMessage}
                      isStreaming={isStreaming}
                      onOpenFileInEditor={(path) => {
                        setActiveFilePath(path);
                        if (layoutMode === 'chat-only') setLayoutMode('split');
                      }}
                      selectedModel={selectedModel}
                      onSelectModel={setSelectedModel}
                      modelOptions={INITIAL_MODEL_OPTIONS}
                      onResetChat={handleResetChat}
                    />
                  </div>
                )}

                {/* Right Workbench Panel (rendered in split, code-only, or preview-only mode) */}
                {layoutMode !== 'chat-only' && (
                  <div className="flex-1 h-full overflow-hidden">
                    <Workbench
                      key={`workbench-${fsVersion}`}
                      fs={fs}
                      fsVersion={fsVersion}
                      activeFilePath={activeFilePath}
                      onSelectFile={setActiveFilePath}
                      onUpdateFileContent={handleUpdateFileContent}
                      terminalLogs={terminalLogs}
                      onRunTerminalCommand={handleRunTerminalCommand}
                      isStreaming={isStreaming}
                      onOpenDiffModal={handleOpenDiffModal}
                    />
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      )}

      {/* Professional Login & Onboarding Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onComplete={handleCompleteOnboarding}
        initialProfile={userProfile}
        pendingPrompt={pendingPrompt}
        isMandatory={!isProfileComplete}
      />

      {/* Real GitHub Export Modal */}
      <GitHubExportModal
        isOpen={isGitHubExportOpen}
        onClose={() => setIsGitHubExportOpen(false)}
        files={fs.getAllFilesRecord()}
        projectName={projectName}
        initialToken={userProfile?.githubToken || ''}
        onSaveToken={(token) => {
          if (userProfile) {
            const updated = { ...userProfile, githubToken: token };
            setUserProfile(updated);
            try {
              localStorage.setItem('athokpam_user_profile', JSON.stringify(updated));
            } catch (e) {
              console.warn(e);
            }
          }
        }}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        selectedProvider={selectedProvider}
        onChangeProvider={setSelectedProvider}
        selectedModel={selectedModel}
        onChangeModel={setSelectedModel}
        customApiKey={customApiKey}
        onChangeCustomApiKey={setCustomApiKey}
        ollamaEndpoint={ollamaEndpoint}
        onChangeOllamaEndpoint={setOllamaEndpoint}
        customSystemPrompt={customSystemPrompt}
        onChangeSystemPrompt={setCustomSystemPrompt}
      />

      {/* Diff Inspector Modal */}
      {diffModalFile && diffInfo && (
        <DiffModal
          isOpen={Boolean(diffModalFile)}
          onClose={() => setDiffModalFile(null)}
          filePath={diffModalFile}
          originalContent={diffInfo.original}
          currentContent={diffInfo.current}
        />
      )}
    </>
  );
}
