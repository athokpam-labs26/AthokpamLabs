import React, { useState } from 'react';
import { 
  Zap, 
  Columns2, 
  MessageSquare, 
  Code2, 
  Eye, 
  Download, 
  Settings as SettingsIcon, 
  History, 
  Share2, 
  Check, 
  Sparkles,
  ChevronDown,
  Github
} from 'lucide-react';
import { LayoutMode, ProjectSnapshot, UserProfile } from '../types';
import { getModelLogo } from '../data/models';

interface HeaderProps {
  projectName: string;
  onRenameProject: (name: string) => void;
  layoutMode: LayoutMode;
  onChangeLayout: (mode: LayoutMode) => void;
  onDownloadZip: () => void;
  onOpenSettings: () => void;
  snapshots: ProjectSnapshot[];
  onRestoreSnapshot: (snapshot: ProjectSnapshot) => void;
  selectedModel: string;
  isStreaming: boolean;
  userProfile: UserProfile | null;
  onGoToLanding: () => void;
  onOpenOnboarding: () => void;
  onOpenGitHubExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  projectName,
  onRenameProject,
  layoutMode,
  onChangeLayout,
  onDownloadZip,
  onOpenSettings,
  snapshots,
  onRestoreSnapshot,
  selectedModel,
  isStreaming,
  userProfile,
  onGoToLanding,
  onOpenOnboarding,
  onOpenGitHubExport,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(projectName);
  const [isSnapshotOpen, setIsSnapshotOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    if (titleInput.trim()) {
      onRenameProject(titleInput.trim());
    } else {
      setTitleInput(projectName);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <header className="h-13 bg-[#11131f] border-b border-[#1e2238] px-4 flex items-center justify-between select-none z-30 shrink-0">
      {/* Brand & Project Name */}
      <div className="flex items-center gap-3">
        <button
          onClick={onGoToLanding}
          title="Return to Athokpam Labs Landing Page"
          className="flex items-center gap-2 pr-3 border-r border-[#1e2238] hover:opacity-85 transition-opacity text-left cursor-pointer"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-purple-500/25 font-black text-xs tracking-tighter">
            AL
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-sm tracking-tight text-white">Athokpam</span>
            <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Labs
            </span>
          </div>
        </button>

        <button
          onClick={onGoToLanding}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 px-2 py-1 rounded hover:bg-[#181b2c] transition-colors"
          title="Go back to Landing Page"
        >
          <span>← Home</span>
        </button>

        {/* Project Name Editor */}
        <div className="flex items-center gap-2">
          {isEditingTitle ? (
            <input
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
              autoFocus
              className="bg-[#181b2c] border border-purple-500 rounded px-2 py-0.5 text-xs text-white focus:outline-none"
            />
          ) : (
            <button
              onClick={() => {
                setTitleInput(projectName);
                setIsEditingTitle(true);
              }}
              title="Click to rename project"
              className="text-xs font-medium text-slate-300 hover:text-white px-2 py-1 rounded hover:bg-[#181b2c] transition-colors truncate max-w-[200px]"
            >
              {projectName}
            </button>
          )}

          {isStreaming && (
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-medium animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              Generating
            </span>
          )}
        </div>
      </div>

      {/* Middle Layout Mode Switcher */}
      <div className="hidden md:flex items-center bg-[#0d0f1a] p-1 rounded-lg border border-[#1e2238]">
        <button
          onClick={() => onChangeLayout('split')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
            layoutMode === 'split' ? 'bg-[#222744] text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Split View (Chat & Workbench)"
        >
          <Columns2 className="w-3.5 h-3.5" />
          <span>Split</span>
        </button>

        <button
          onClick={() => onChangeLayout('chat-only')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
            layoutMode === 'chat-only' ? 'bg-[#222744] text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Chat Only"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Chat</span>
        </button>

        <button
          onClick={() => onChangeLayout('code-only')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
            layoutMode === 'code-only' ? 'bg-[#222744] text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Code Editor Only"
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Code</span>
        </button>

        <button
          onClick={() => onChangeLayout('preview-only')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
            layoutMode === 'preview-only' ? 'bg-[#222744] text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Live Preview Only"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Preview</span>
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Model indicator badge with real logo */}
        <button
          onClick={onOpenSettings}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#181b2c] hover:bg-[#20243a] border border-[#262c4a] text-slate-300 text-xs font-mono transition-colors"
          title="Current AI Model & Provider (Click to change)"
        >
          {getModelLogo(selectedModel) ? (
            <img
              src={getModelLogo(selectedModel)}
              alt=""
              className="w-3.5 h-3.5 rounded-xs object-contain bg-white/95 p-0.5 border border-purple-500/30"
            />
          ) : (
            <Sparkles className="w-3 h-3 text-purple-400" />
          )}
          <span className="truncate max-w-[120px]">{selectedModel}</span>
        </button>

        {/* Snapshot / Revert History */}
        <div className="relative">
          <button
            onClick={() => setIsSnapshotOpen(!isSnapshotOpen)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#181b2c] hover:bg-[#20243a] border border-[#262c4a] text-slate-300 hover:text-white text-xs font-medium transition-colors"
            title="Version history and checkpoints"
          >
            <History className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">History</span>
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </button>

          {isSnapshotOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-[#141726] border border-[#222744] rounded-xl shadow-2xl p-2 z-50 text-xs">
              <div className="px-2 py-1.5 font-semibold text-slate-400 uppercase tracking-wider text-[10px] border-b border-[#222744] mb-1">
                Project Snapshots
              </div>
              {snapshots.length === 0 ? (
                <div className="p-3 text-center text-slate-500 text-xs">No checkpoints yet.</div>
              ) : (
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {snapshots.map((snap) => (
                    <button
                      key={snap.id}
                      onClick={() => {
                        onRestoreSnapshot(snap);
                        setIsSnapshotOpen(false);
                      }}
                      className="w-full text-left p-2 rounded hover:bg-[#1e233d] transition-colors flex items-center justify-between group"
                    >
                      <div className="truncate pr-2">
                        <div className="text-slate-200 font-medium truncate group-hover:text-purple-300">{snap.title}</div>
                        <div className="text-[10px] text-slate-500">{snap.timestamp}</div>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">
                        Restore
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Export to GitHub */}
        <button
          onClick={onOpenGitHubExport}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#181b2c] hover:bg-[#20243a] border border-[#262c4a] text-slate-200 hover:text-white text-xs font-medium transition-colors"
          title="Push repository directly to GitHub via REST API"
        >
          <Github className="w-3.5 h-3.5 text-slate-300" />
          <span className="hidden sm:inline">Export to GitHub</span>
        </button>

        {/* Download ZIP */}
        <button
          onClick={onDownloadZip}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#181b2c] hover:bg-[#20243a] border border-[#262c4a] text-slate-200 hover:text-white text-xs font-medium transition-colors"
          title="Export and download project as ZIP"
        >
          <Download className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">Export ZIP</span>
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="p-1.5 rounded-lg bg-[#181b2c] hover:bg-[#20243a] border border-[#262c4a] text-slate-300 hover:text-white transition-colors"
          title="Copy project share link"
        >
          {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
        </button>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="p-1.5 rounded-lg bg-[#181b2c] hover:bg-[#20243a] border border-[#262c4a] text-slate-300 hover:text-white transition-colors"
          title="Configure AI Models, Providers, and Environment"
        >
          <SettingsIcon className="w-4 h-4" />
        </button>

        {/* User Profile Pill / Login */}
        {userProfile ? (
          <button
            onClick={onOpenOnboarding}
            className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-lg bg-[#181b2c] hover:bg-[#20243a] border border-[#262c4a] text-white text-xs font-medium transition-colors"
            title="Edit Profile, Organization & AI Keys"
          >
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">
              {userProfile.name.charAt(0).toUpperCase()}
            </div>
            <div className="text-left hidden sm:block">
              <span className="truncate max-w-[100px] text-xs font-semibold block leading-tight">
                {userProfile.name.split(' ')[0]}
              </span>
              <span className="text-[9px] text-purple-400 font-mono block leading-none">
                @{userProfile.teamName || 'Athokpam'}
              </span>
            </div>
          </button>
        ) : (
          <button
            onClick={onOpenOnboarding}
            className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            Log in
          </button>
        )}
      </div>
    </header>
  );
};
