import React, { useState, useEffect, useRef } from 'react';
import { 
  Code2, 
  Eye, 
  File, 
  Folder, 
  FolderOpen, 
  Plus, 
  Trash2, 
  Search, 
  Terminal as TerminalIcon, 
  RotateCw, 
  Monitor, 
  Tablet, 
  Smartphone, 
  ExternalLink, 
  Copy, 
  Check, 
  Save, 
  FileDiff, 
  ChevronRight, 
  ChevronDown,
  X,
  Play,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { ViewportMode, TerminalOutputLine } from '../types';
import { VirtualFileSystem, FileTreeNode } from '../utils/fileSystem';
import { generateSandboxHtml, ConsoleLogMessage } from '../utils/sandboxRunner';

interface WorkbenchProps {
  fs: VirtualFileSystem;
  fsVersion: number;
  activeFilePath: string;
  onSelectFile: (filePath: string) => void;
  onUpdateFileContent: (filePath: string, content: string) => void;
  terminalLogs: TerminalOutputLine[];
  onRunTerminalCommand: (command: string) => void;
  isStreaming: boolean;
  onOpenDiffModal: (filePath: string) => void;
}

export const Workbench: React.FC<WorkbenchProps> = ({
  fs,
  fsVersion,
  activeFilePath,
  onSelectFile,
  onUpdateFileContent,
  terminalLogs,
  onRunTerminalCommand,
  isStreaming,
  onOpenDiffModal,
}) => {
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('preview');
  const [openTabs, setOpenTabs] = useState<string[]>(['src/App.tsx']);
  const [editorContent, setEditorContent] = useState('');
  const [fileSearch, setFileSearch] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    src: true,
    'src/components': true,
  });
  const [viewportMode, setViewportMode] = useState<ViewportMode>('desktop');
  const [isTerminalOpen, setIsTerminalOpen] = useState(true);
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalTab, setTerminalTab] = useState<'terminal' | 'console'>('terminal');
  const [sandboxLogs, setSandboxLogs] = useState<ConsoleLogMessage[]>([]);
  const [isCopied, setIsCopied] = useState(false);
  const [newFileInputOpen, setNewFileInputOpen] = useState(false);
  const [newFileName, setNewFileName] = useState('');

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Sync editor content when active file changes
  useEffect(() => {
    if (activeFilePath) {
      setEditorContent(fs.getFileContent(activeFilePath));
      if (!openTabs.includes(activeFilePath)) {
        setOpenTabs((prev) => [...prev, activeFilePath]);
      }
    }
  }, [activeFilePath, fs]);

  // Listen for console messages from the sandbox iframe
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data && (e.data.source === 'athokpam-sandbox' || e.data.source === 'bolt-sandbox')) {
        const newLog: ConsoleLogMessage = {
          id: `log-${Date.now()}-${Math.random()}`,
          type: e.data.type || 'log',
          message: e.data.message || '',
          timestamp: e.data.time || new Date().toLocaleTimeString(),
        };
        setSandboxLogs((prev) => [...prev.slice(-100), newLog]);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Auto-scroll terminal
  useEffect(() => {
    if (isTerminalOpen) {
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs, sandboxLogs, isTerminalOpen]);

  const handleEditorChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setEditorContent(val);
    onUpdateFileContent(activeFilePath, val);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(editorContent);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const sandboxHtml = React.useMemo(() => {
    return generateSandboxHtml(fs.getAllFilesRecord());
  }, [fs, fsVersion]);

  const handleReloadPreview = () => {
    if (iframeRef.current) {
      iframeRef.current.srcdoc = generateSandboxHtml(fs.getAllFilesRecord());
    }
  };

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;
    onRunTerminalCommand(terminalInput.trim());
    setTerminalInput('');
  };

  const handleCreateFile = () => {
    if (!newFileName.trim()) return;
    const path = newFileName.trim().startsWith('src/') ? newFileName.trim() : `src/${newFileName.trim()}`;
    fs.setFile(path, '// New file\n');
    onSelectFile(path);
    setNewFileName('');
    setNewFileInputOpen(false);
  };

  const handleDeleteFile = (path: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Delete ${path}?`)) {
      fs.deleteFile(path);
      setOpenTabs((prev) => prev.filter((p) => p !== path));
      if (activeFilePath === path) {
        onSelectFile('src/App.tsx');
      }
    }
  };

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  const closeTab = (path: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const remaining = openTabs.filter((t) => t !== path);
    setOpenTabs(remaining);
    if (activeFilePath === path && remaining.length > 0) {
      onSelectFile(remaining[remaining.length - 1]);
    }
  };

  // File tree nodes
  const treeNodes = fs.getTree();

  const renderTree = (nodes: FileTreeNode[], depth = 0) => {
    return nodes.map((node) => {
      if (fileSearch && !node.path.toLowerCase().includes(fileSearch.toLowerCase())) {
        return null;
      }

      if (node.type === 'folder') {
        const isExpanded = expandedFolders[node.path] ?? true;
        return (
          <div key={node.id}>
            <button
              onClick={() => toggleFolder(node.path)}
              style={{ paddingLeft: `${depth * 12 + 8}px` }}
              className="w-full flex items-center gap-1.5 py-1 text-slate-400 hover:text-slate-200 hover:bg-[#1a1f36] rounded text-xs transition-colors group"
            >
              {isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              )}
              {isExpanded ? (
                <FolderOpen className="w-3.5 h-3.5 text-indigo-400" />
              ) : (
                <Folder className="w-3.5 h-3.5 text-indigo-400" />
              )}
              <span className="font-medium truncate">{node.name}</span>
            </button>
            {isExpanded && node.children && (
              <div>{renderTree(node.children, depth + 1)}</div>
            )}
          </div>
        );
      }

      // File Node
      const isActive = activeFilePath === node.path;
      return (
        <div
          key={node.id}
          style={{ paddingLeft: `${depth * 12 + 20}px` }}
          onClick={() => onSelectFile(node.path)}
          className={`flex items-center justify-between py-1 pr-2 rounded text-xs cursor-pointer group transition-colors ${
            isActive
              ? 'bg-purple-600/20 text-purple-300 font-medium'
              : 'text-slate-300 hover:bg-[#181d33] hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2 truncate">
            <File className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-400" />
            <span className="truncate">{node.name}</span>
            {node.isModified && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />}
          </div>
          {node.path !== 'src/App.tsx' && (
            <button
              onClick={(e) => handleDeleteFile(node.path, e)}
              className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 p-0.5"
              title="Delete file"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      );
    });
  };

  // Line count for code editor
  const lineCount = editorContent.split('\n').length;

  return (
    <div className="h-full flex flex-col bg-[#0b0d17] overflow-hidden select-none">
      {/* Workbench Navigation Header */}
      <div className="h-10 bg-[#121524] border-b border-[#1c2138] px-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'code'
                ? 'bg-gradient-to-r from-purple-600/20 to-indigo-600/20 text-purple-300 border border-purple-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-purple-400" />
            <span>Code</span>
          </button>

          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'preview'
                ? 'bg-gradient-to-r from-cyan-600/20 to-indigo-600/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>Preview</span>
          </button>
        </div>

        {/* Right actions based on active tab */}
        <div className="flex items-center gap-2">
          {activeTab === 'preview' && (
            <div className="flex items-center gap-1 bg-[#181d33] p-0.5 rounded-lg border border-[#232948]">
              <button
                onClick={() => setViewportMode('desktop')}
                className={`p-1 rounded ${viewportMode === 'desktop' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
                title="Desktop View (100%)"
              >
                <Monitor className="w-3 h-3" />
              </button>
              <button
                onClick={() => setViewportMode('tablet')}
                className={`p-1 rounded ${viewportMode === 'tablet' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
                title="Tablet View (768px)"
              >
                <Tablet className="w-3 h-3" />
              </button>
              <button
                onClick={() => setViewportMode('mobile')}
                className={`p-1 rounded ${viewportMode === 'mobile' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
                title="Mobile View (375px)"
              >
                <Smartphone className="w-3 h-3" />
              </button>
            </div>
          )}

          {activeTab === 'code' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenDiffModal(activeFilePath)}
                className="flex items-center gap-1 text-xs text-slate-300 hover:text-white px-2 py-1 rounded bg-[#181d33] border border-[#232948] transition-colors"
                title="View git diff against original"
              >
                <FileDiff className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Diff</span>
              </button>

              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 text-xs text-slate-300 hover:text-white px-2 py-1 rounded bg-[#181d33] border border-[#232948] transition-colors"
                title="Copy current file contents"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">Copy</span>
              </button>
            </div>
          )}

          <button
            onClick={() => setIsTerminalOpen(!isTerminalOpen)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
              isTerminalOpen
                ? 'bg-[#1e2440] text-purple-300 border-purple-500/30'
                : 'bg-[#181d33] text-slate-400 hover:text-slate-200 border-[#232948]'
            }`}
            title="Toggle Athokpam Terminal drawer"
          >
            <TerminalIcon className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Athokpam Terminal</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* CODE VIEW */}
        {activeTab === 'code' && (
          <div className="flex-1 flex overflow-hidden">
            {/* Left File Tree */}
            <div className="w-56 bg-[#0f111e] border-r border-[#1b2038] flex flex-col shrink-0">
              <div className="p-2 border-b border-[#1b2038] flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Files
                </span>
                <button
                  onClick={() => setNewFileInputOpen(!newFileInputOpen)}
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#1a1f36] transition-colors"
                  title="New File"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* New File Inline Prompt */}
              {newFileInputOpen && (
                <div className="p-2 border-b border-[#1b2038] bg-[#14182a]">
                  <input
                    type="text"
                    placeholder="src/NewComponent.tsx"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateFile()}
                    autoFocus
                    className="w-full bg-[#0d0f1a] border border-purple-500 rounded px-2 py-1 text-xs text-white focus:outline-none"
                  />
                  <div className="flex justify-end gap-1 mt-1.5">
                    <button
                      onClick={() => setNewFileInputOpen(false)}
                      className="text-[10px] text-slate-400 hover:text-white px-2 py-0.5 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateFile}
                      className="text-[10px] bg-purple-600 hover:bg-purple-500 text-white px-2 py-0.5 rounded"
                    >
                      Create
                    </button>
                  </div>
                </div>
              )}

              {/* File Search */}
              <div className="px-2 py-1.5 border-b border-[#1b2038]">
                <div className="relative">
                  <Search className="w-3 h-3 text-slate-500 absolute left-2 top-2" />
                  <input
                    type="text"
                    placeholder="Search files..."
                    value={fileSearch}
                    onChange={(e) => setFileSearch(e.target.value)}
                    className="w-full bg-[#141829] border border-[#202644] rounded-lg pl-7 pr-2 py-1 text-[11px] text-slate-200 placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Tree view list */}
              <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
                {renderTree(treeNodes)}
              </div>
            </div>

            {/* Right Code Editor */}
            <div className="flex-1 flex flex-col bg-[#0b0d18] overflow-hidden">
              {/* Tabs bar */}
              <div className="h-9 bg-[#111424] border-b border-[#1b2038] flex items-center overflow-x-auto px-2 gap-1 shrink-0">
                {openTabs.map((path) => {
                  const isActive = activeFilePath === path;
                  const name = fs.getFileName(path);
                  return (
                    <div
                      key={path}
                      onClick={() => onSelectFile(path)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-t-md text-xs cursor-pointer border-t-2 transition-all ${
                        isActive
                          ? 'bg-[#0b0d18] border-purple-500 text-purple-300 font-medium'
                          : 'border-transparent text-slate-400 hover:bg-[#161a2e] hover:text-slate-200'
                      }`}
                    >
                      <File className="w-3 h-3" />
                      <span>{name}</span>
                      <button
                        onClick={(e) => closeTab(path, e)}
                        className="hover:text-rose-400 rounded p-0.5 text-slate-500"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Code Editor Body */}
              <div className="flex-1 flex overflow-hidden font-mono text-xs">
                {/* Line numbers gutter */}
                <div className="w-12 bg-[#0d0f1c] text-slate-600 select-none text-right pr-3 py-3 border-r border-[#1a1f36] shrink-0 font-mono text-[11px] leading-relaxed">
                  {Array.from({ length: Math.max(lineCount, 25) }).map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>

                {/* Textarea Code surface */}
                <div className="flex-1 relative overflow-auto">
                  <textarea
                    value={editorContent}
                    onChange={handleEditorChange}
                    spellCheck={false}
                    className="w-full h-full bg-transparent text-slate-200 p-3 font-mono text-[12px] leading-relaxed resize-none focus:outline-none whitespace-pre selection:bg-purple-600/30"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PREVIEW VIEW */}
        {activeTab === 'preview' && (
          <div className="flex-1 flex flex-col bg-[#0b0d18] overflow-hidden">
            {/* Browser Chrome Header */}
            <div className="h-9 bg-[#111424] border-b border-[#1c2138] px-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 flex-1 max-w-xl">
                <button
                  onClick={handleReloadPreview}
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#1c223a] transition-colors"
                  title="Reload sandbox"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>

                <div className="flex-1 bg-[#171b2e] border border-[#252b49] rounded-lg px-3 py-1 flex items-center gap-2 text-xs font-mono text-slate-400">
                  <span className="text-emerald-400 text-[10px]">●</span>
                  <span className="text-slate-300 truncate">http://localhost:3000/</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Sandboxed React 18
                </span>
              </div>
            </div>

            {/* Sandbox IFrame Host with Device Frames & Made with Athokpam Badge */}
            <div className="flex-1 bg-[#090b14] flex items-center justify-center p-4 overflow-auto relative">
              <div
                className={`h-full transition-all duration-200 bg-slate-900 overflow-hidden shadow-2xl relative ${
                  viewportMode === 'desktop'
                    ? 'w-full rounded-none'
                    : viewportMode === 'tablet'
                    ? 'w-[768px] rounded-2xl border-4 border-[#222744]'
                    : 'w-[375px] rounded-3xl border-8 border-[#222744]'
                }`}
              >
                <iframe
                  ref={iframeRef}
                  title="Athokpam AI Sandbox"
                  sandbox="allow-scripts allow-modals allow-same-origin"
                  srcDoc={sandboxHtml}
                  className="w-full h-full border-0 bg-slate-900"
                />

                {/* Floating Made with Athokpam Badge */}
                <div className="absolute bottom-3 right-3 z-20 pointer-events-auto">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0d1020]/90 backdrop-blur-md border border-purple-500/40 shadow-lg shadow-black/60 text-[11px] text-slate-200 select-none hover:border-purple-400 transition-colors">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-medium text-slate-300">
                      ⚡ Made with <span className="text-purple-300 font-bold">Athokpam</span>
                    </span>
                    <span className="text-[9px] px-1 py-0.2 rounded bg-purple-500/20 text-purple-300 font-mono">
                      AI
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM TERMINAL DRAWER */}
      {isTerminalOpen && (
        <div className="h-44 bg-[#0d0f1b] border-t border-[#1e233d] flex flex-col shrink-0">
          <div className="h-8 bg-[#131626] border-b border-[#1e233d] px-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTerminalTab('terminal')}
                className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
                  terminalTab === 'terminal' ? 'bg-[#222847] text-amber-300 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <TerminalIcon className="w-3 h-3 text-amber-400" />
                <span>Athokpam Terminal</span>
              </button>

              <button
                onClick={() => setTerminalTab('console')}
                className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
                  terminalTab === 'console' ? 'bg-[#222847] text-cyan-300' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Console Logs</span>
                {sandboxLogs.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] flex items-center justify-center font-mono">
                    {sandboxLogs.length}
                  </span>
                )}
              </button>
            </div>

            <button
              onClick={() => setIsTerminalOpen(false)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Terminal Tab Content */}
          {terminalTab === 'terminal' ? (
            <div className="flex-1 p-3 overflow-y-auto font-mono text-xs space-y-1 bg-[#090b14]">
              {terminalLogs.map((log) => (
                <div key={log.id} className="flex gap-2">
                  <span className="text-slate-600 select-none">[{log.timestamp}]</span>
                  <span
                    className={`${
                      log.type === 'command'
                        ? 'text-purple-400 font-bold'
                        : log.type === 'success'
                        ? 'text-emerald-400'
                        : log.type === 'error'
                        ? 'text-rose-400'
                        : log.type === 'warn'
                        ? 'text-amber-400'
                        : 'text-slate-300'
                    }`}
                  >
                    {log.text}
                  </span>
                </div>
              ))}
              <div ref={terminalEndRef} />

              {/* Terminal Command Input with athokpam@terminal prompt */}
              <form onSubmit={handleTerminalSubmit} className="flex items-center gap-2 pt-2 text-slate-300">
                <span className="text-purple-400 font-bold font-mono">athokpam@terminal:~/project$</span>
                <input
                  type="text"
                  placeholder="Type npm command or shell helper (e.g. npm run dev, ls, help)..."
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  className="flex-1 bg-transparent text-xs text-white placeholder-slate-600 focus:outline-none font-mono"
                />
              </form>
            </div>
          ) : (
            /* Browser Console Tab */
            <div className="flex-1 p-3 overflow-y-auto font-mono text-xs space-y-1 bg-[#090b14]">
              {sandboxLogs.length === 0 ? (
                <div className="text-slate-600 italic">No console logs recorded from the preview sandbox.</div>
              ) : (
                sandboxLogs.map((log) => (
                  <div key={log.id} className="flex gap-2 border-b border-slate-900/60 pb-0.5">
                    <span className="text-slate-600 select-none">[{log.timestamp}]</span>
                    <span
                      className={`font-semibold uppercase text-[10px] px-1 rounded ${
                        log.type === 'error'
                          ? 'bg-rose-500/20 text-rose-400'
                          : log.type === 'warn'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {log.type}
                    </span>
                    <span className="text-slate-300 break-all">{log.message}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
