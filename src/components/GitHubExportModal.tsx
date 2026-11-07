import React, { useState } from 'react';
import {
  Github,
  X,
  Lock,
  Globe,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Download,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { exportToGitHub, generateProjectReadme } from '../utils/githubExport';
import { exportProjectZip } from '../utils/fileSystem';
import { GitHubExportOptions } from '../types';

interface GitHubExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  files: Record<string, string>;
  projectName?: string;
  initialToken?: string;
  onSaveToken?: (token: string) => void;
}

export const GitHubExportModal: React.FC<GitHubExportModalProps> = ({
  isOpen,
  onClose,
  files,
  projectName = 'athokpam-ai-app',
  initialToken = '',
  onSaveToken,
}) => {
  const [token, setToken] = useState(initialToken);
  const [repoName, setRepoName] = useState(
    projectName.toLowerCase().replace(/[^a-z0-9-_]/g, '-') || 'athokpam-project'
  );
  const [description, setDescription] = useState(
    'Autonomous AI-built web application engineered with Athokpam Labs.'
  );
  const [isPrivate, setIsPrivate] = useState(false);
  const [includeBadge, setIncludeBadge] = useState(true);

  // Export progress
  const [status, setStatus] = useState<'idle' | 'exporting' | 'success' | 'error'>('idle');
  const [progressMsg, setProgressMsg] = useState('');
  const [progressPercent, setProgressPercent] = useState(0);
  const [exportedRepoUrl, setExportedRepoUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedClone, setCopiedClone] = useState(false);

  if (!isOpen) return null;

  const handleExport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) {
      setErrorMsg('GitHub Personal Access Token is required to create a repository.');
      return;
    }
    if (!repoName.trim()) {
      setErrorMsg('Repository name cannot be empty.');
      return;
    }

    setErrorMsg('');
    setStatus('exporting');
    setProgressMsg('Initiating GitHub authentication...');
    setProgressPercent(15);

    if (onSaveToken) {
      onSaveToken(token.trim());
    }

    const options: GitHubExportOptions = {
      repoName: repoName.trim(),
      description: description.trim(),
      isPrivate,
      includeBadge,
      token: token.trim(),
    };

    const result = await exportToGitHub(options, files, (msg, pct) => {
      setProgressMsg(msg);
      setProgressPercent(pct);
    });

    if (result.success && result.repoUrl) {
      setStatus('success');
      setExportedRepoUrl(result.repoUrl);
    } else {
      setStatus('error');
      setErrorMsg(
        result.error ||
          'Failed to export to GitHub. Ensure your Personal Access Token has the "repo" scope checked.'
      );
    }
  };

  const handleDownloadZipBackup = async () => {
    const enrichedFiles = { ...files };
    enrichedFiles['README.md'] = generateProjectReadme(
      repoName,
      description,
      files,
      includeBadge
    );
    await exportProjectZip(enrichedFiles, `${repoName}-github-ready.zip`);
  };

  const copyCloneCommand = () => {
    if (!exportedRepoUrl) return;
    const cmd = `git clone ${exportedRepoUrl}.git`;
    navigator.clipboard.writeText(cmd);
    setCopiedClone(true);
    setTimeout(() => setCopiedClone(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-[#121526] border border-[#232a49] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#212744] bg-[#161a2e] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#24292e] border border-slate-700 flex items-center justify-center text-white shadow-md">
              <Github className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">Export to GitHub</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Real REST API
                </span>
              </div>
              <p className="text-xs text-slate-400">Push your AI sandbox codebase directly to a GitHub repository</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#202640] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-200">
          {errorMsg && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-semibold">GitHub Export Error</div>
                <div>{errorMsg}</div>
                <div className="text-[10px] text-slate-400">
                  Tip: Check that your token has the <strong>'repo'</strong> scope enabled in GitHub Developer Settings.
                </div>
              </div>
            </div>
          )}

          {status === 'success' ? (
            <div className="py-6 text-center space-y-5">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">Repository Created & Synced!</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Your project with all source files and the <strong>'Made with Athokpam'</strong> badge has been pushed to GitHub.
                </p>
              </div>

              <div className="p-3 bg-[#15192c] border border-[#252c4b] rounded-xl flex items-center justify-between text-xs font-mono text-slate-300 max-w-md mx-auto">
                <span className="truncate pr-2">{exportedRepoUrl}</span>
                <a
                  href={exportedRepoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg flex items-center gap-1.5 shrink-0 text-xs font-sans font-medium transition-colors"
                >
                  <span>Open Repo</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={copyCloneCommand}
                  className="px-4 py-2 bg-[#1b2038] hover:bg-[#232a48] text-slate-200 text-xs font-medium rounded-xl border border-[#2a335a] flex items-center gap-2 transition-colors"
                >
                  {copiedClone ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedClone ? 'Copied Clone URL!' : 'Copy Clone Command'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadZipBackup}
                  className="px-4 py-2 bg-[#1b2038] hover:bg-[#232a48] text-slate-200 text-xs font-medium rounded-xl border border-[#2a335a] flex items-center gap-2 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download ZIP Backup</span>
                </button>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs rounded-xl"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleExport} className="space-y-4">
              {/* GitHub PAT */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    GitHub Personal Access Token (classic or fine-grained) <span className="text-purple-400">*</span>
                  </label>
                  <a
                    href="https://github.com/settings/tokens/new?scopes=repo&description=Athokpam-AI-App-Builder"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
                  >
                    <span>Generate Token</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="ghp_... or github_pat_..."
                    className="w-full bg-[#161a2e] border border-[#272f4e] rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Requires <strong>'repo'</strong> scope to create repositories and commit code. Stored only in your local session.
                </p>
              </div>

              {/* Repo Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Repository Name <span className="text-purple-400">*</span>
                </label>
                <div className="flex items-center">
                  <span className="bg-[#0f1222] border border-r-0 border-[#272f4e] px-3 py-2 rounded-l-xl text-xs font-mono text-slate-400">
                    github.com/you/
                  </span>
                  <input
                    type="text"
                    required
                    value={repoName}
                    onChange={(e) => setRepoName(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '-'))}
                    placeholder="my-ai-web-app"
                    className="flex-1 bg-[#161a2e] border border-[#272f4e] rounded-r-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Repository Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="App description..."
                  className="w-full bg-[#161a2e] border border-[#272f4e] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Privacy Radio */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Repository Visibility
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setIsPrivate(false)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      !isPrivate
                        ? 'bg-purple-900/30 border-purple-500 text-white'
                        : 'bg-[#15192c] border-[#222845] hover:border-slate-600 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Globe className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-white">Public</span>
                    </div>
                    <p className="text-[10px] text-slate-400">Anyone on GitHub can see this repository.</p>
                  </div>

                  <div
                    onClick={() => setIsPrivate(true)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isPrivate
                        ? 'bg-purple-900/30 border-purple-500 text-white'
                        : 'bg-[#15192c] border-[#222845] hover:border-slate-600 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Lock className="w-4 h-4 text-purple-400" />
                      <span className="text-xs font-bold text-white">Private</span>
                    </div>
                    <p className="text-[10px] text-slate-400">Only you can see this repository.</p>
                  </div>
                </div>
              </div>

              {/* Badge Checkbox */}
              <label className="flex items-start gap-3 p-3 bg-[#15192c] border border-[#252c4b] rounded-xl cursor-pointer hover:border-purple-500/50 transition-colors">
                <input
                  type="checkbox"
                  checked={includeBadge}
                  onChange={(e) => setIncludeBadge(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-purple-600 focus:ring-purple-500 bg-[#0e1120] border-slate-600 cursor-pointer"
                />
                <div className="text-xs">
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    Include 'Made with Athokpam' Badge in README
                  </span>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Embeds the official Athokpam Labs AI shield badge in your project's GitHub markdown documentation.
                  </p>
                </div>
              </label>

              {/* Progress State when exporting */}
              {status === 'exporting' && (
                <div className="p-3.5 bg-purple-950/40 border border-purple-700/50 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs text-purple-200">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                      <span>{progressMsg}</span>
                    </div>
                    <span className="font-mono font-bold">{progressPercent}%</span>
                  </div>
                  <div className="w-full bg-[#121526] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleDownloadZipBackup}
                  className="px-3.5 py-2 text-xs font-medium text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download ZIP Instead</span>
                </button>

                <button
                  type="submit"
                  disabled={status === 'exporting' || !token.trim() || !repoName.trim()}
                  className={`px-5 py-2.5 font-bold text-xs rounded-xl flex items-center gap-2 transition-all ${
                    status === 'exporting' || !token.trim() || !repoName.trim()
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white shadow-lg shadow-purple-600/30 cursor-pointer active:scale-98'
                  }`}
                >
                  {status === 'exporting' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Pushing to GitHub...</span>
                    </>
                  ) : (
                    <>
                      <Github className="w-4 h-4" />
                      <span>Create & Push to GitHub</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
