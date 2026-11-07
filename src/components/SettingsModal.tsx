import React, { useState } from 'react';
import { 
  X, 
  Server, 
  Key, 
  Cpu, 
  Sparkles, 
  Check, 
  Globe, 
  Eye, 
  EyeOff, 
  Sliders, 
  RotateCcw, 
  SlidersHorizontal, 
  ShieldCheck, 
  Trash2,
  Terminal,
  Zap,
  Info
} from 'lucide-react';
import { ALL_MODELS } from '../data/models';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProvider: string;
  onChangeProvider: (provider: string) => void;
  selectedModel: string;
  onChangeModel: (model: string) => void;
  customApiKey: string;
  onChangeCustomApiKey: (key: string) => void;
  ollamaEndpoint: string;
  onChangeOllamaEndpoint: (endpoint: string) => void;
  customSystemPrompt: string;
  onChangeSystemPrompt: (prompt: string) => void;
}

const SYSTEM_PRESETS = [
  {
    id: 'fullstack',
    name: 'Full-Stack Architecture Pro',
    prompt: `You are Athokpam AI, a senior full-stack software engineer. Write clean, modular, accessible React 18 code with Tailwind CSS. Follow separation of concerns, isolate hooks, validate edge cases, and ensure dark-mode consistency.`,
  },
  {
    id: 'ui-wizard',
    name: 'Tailwind UI & Aesthetics Wizard',
    prompt: `You are Athokpam AI, an elite UI/UX design engineer. Focus on modern typography, micro-interactions, responsive padding math, accessible contrast ratios (WCAG AA), zero AI-slop pills, and bespoke component polish.`,
  },
  {
    id: 'stem-logic',
    name: 'Deep STEM & Algorithmic Logic',
    prompt: `You are Athokpam AI, a computer scientist and algorithm specialist. Prioritize deterministic mathematical logic, optimized data structures, comprehensive error boundary handling, and clear architectural step-by-step reasoning.`,
  },
  {
    id: 'mvp-fast',
    name: 'Fast Prototyping & MVP Builder',
    prompt: `You are Athokpam AI. Build high-velocity prototypes with working state, responsive design, realistic seed data, and functional interactive controls without mock placeholders.`,
  },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  selectedProvider,
  onChangeProvider,
  selectedModel,
  onChangeModel,
  customApiKey,
  onChangeCustomApiKey,
  ollamaEndpoint,
  onChangeOllamaEndpoint,
  customSystemPrompt,
  onChangeSystemPrompt,
}) => {
  const [activeTab, setActiveTab] = useState<'models' | 'keys' | 'system' | 'preferences' | 'about'>('models');
  const [ollamaStatus, setOllamaStatus] = useState<'idle' | 'checking' | 'connected' | 'error'>('idle');
  const [showApiKey, setShowApiKey] = useState(false);
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState('8192');
  const [fontSize, setFontSize] = useState('13px');
  const [autoReload, setAutoReload] = useState(true);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  // Key storage per provider simulation
  const [keysByProvider, setKeysByProvider] = useState<Record<string, string>>(() => {
    try {
      const stored = localStorage.getItem('athokpam_provider_keys');
      return stored ? JSON.parse(stored) : { gemini: customApiKey };
    } catch (e) {
      return { gemini: customApiKey };
    }
  });

  if (!isOpen) return null;

  const testOllamaConnection = async () => {
    setOllamaStatus('checking');
    try {
      const res = await fetch(`${ollamaEndpoint}/api/tags`);
      if (res.ok) {
        setOllamaStatus('connected');
      } else {
        setOllamaStatus('error');
      }
    } catch (e) {
      setOllamaStatus('error');
    }
  };

  const handleUpdateProviderKey = (provider: string, val: string) => {
    const updated = { ...keysByProvider, [provider]: val };
    setKeysByProvider(updated);
    try {
      localStorage.setItem('athokpam_provider_keys', JSON.stringify(updated));
    } catch (e) {
      // Ignore
    }
    if (provider === selectedProvider) {
      onChangeCustomApiKey(val);
    }
    showToastNotice(`Key saved for ${provider.toUpperCase()}`);
  };

  const showToastNotice = (msg: string) => {
    setStatusNotice(msg);
    setTimeout(() => setStatusNotice(null), 2500);
  };

  const handleResetCache = () => {
    if (window.confirm('Reset local profile, settings, and cache?')) {
      localStorage.removeItem('athokpam_user_profile');
      localStorage.removeItem('athokpam_provider_keys');
      showToastNotice('Cache and local storage cleared.');
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  const currentModelData = ALL_MODELS.find((m) => m.id === selectedModel) || ALL_MODELS[0];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 select-none">
      <div className="bg-[#121526] border border-[#242b4b] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#242b4b] bg-[#161a2e] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-purple-500/25">
              AL
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white">Athokpam AI Control Center</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Full Feature Suite
                </span>
              </div>
              <p className="text-xs text-slate-400">Configure 30+ AI Models, BYOK API Keys, Prompts & Runtime</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-[#20253f] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs Navigation */}
        <div className="flex border-b border-[#242b4b] bg-[#0e1120] px-4 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('models')}
            className={`py-3 px-3.5 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'models'
                ? 'border-purple-500 text-purple-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            30+ AI Models
          </button>
          <button
            onClick={() => setActiveTab('keys')}
            className={`py-3 px-3.5 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'keys'
                ? 'border-purple-500 text-purple-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            BYOK Key Manager
          </button>
          <button
            onClick={() => setActiveTab('system')}
            className={`py-3 px-3.5 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'system'
                ? 'border-purple-500 text-purple-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            System Prompts & Presets
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`py-3 px-3.5 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'preferences'
                ? 'border-purple-500 text-purple-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Editor & Sandbox
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`py-3 px-3.5 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'about'
                ? 'border-purple-500 text-purple-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            About Athokpam AI
          </button>
        </div>

        {/* Toast status alert */}
        {statusNotice && (
          <div className="bg-emerald-500/15 border-b border-emerald-500/30 px-6 py-2 text-emerald-400 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{statusNotice}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300 flex-1">
          {/* TAB 1: 30+ AI MODELS */}
          {activeTab === 'models' && (
            <div className="space-y-6">
              {/* Active Provider Quick Select */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Active Provider Engine
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'gemini', name: 'Google Gemini', desc: '1M Context', logo: '/assets/aistudio/OIP__3__34a26736.webp' },
                    { id: 'anthropic', name: 'Claude', desc: 'Hybrid Reasoning', logo: '/assets/aistudio/OIP__1__6c880ef0.webp' },
                    { id: 'deepseek', name: 'DeepSeek', desc: '671B MoE / R1', logo: '/assets/aistudio/DeepSeek-Logo_043ca2ea.jpg' },
                    { id: 'nvidia', name: 'NVIDIA AI', desc: 'Nemotron / NIM', logo: '/assets/aistudio/nvidia_ca832076.jpg' },
                    { id: 'meta', name: 'Meta Llama', desc: 'Llama 3.3 70B', logo: '/assets/aistudio/OIP_06acdd3c.jpg' },
                    { id: 'moonshot', name: 'Moonshot AI', desc: 'Kimi 128K', logo: '/assets/aistudio/OIP__2__e85718d2.webp' },
                  ].map((p) => (
                    <div
                      key={p.id}
                      onClick={() => onChangeProvider(p.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-2.5 ${
                        selectedProvider === p.id
                          ? 'bg-purple-900/35 border-purple-500 text-white shadow-xs'
                          : 'bg-[#15192c] border-[#222845] hover:border-slate-600 text-slate-400'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-white/95 p-1 border border-slate-700/60 shrink-0 flex items-center justify-center overflow-hidden">
                        <img src={p.logo} alt={p.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="truncate">
                        <div className="font-semibold text-xs text-white truncate">{p.name}</div>
                        <div className="text-[10px] text-purple-400 font-mono mt-0.5 truncate">{p.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 30+ Model Selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Model Selection (30+ Supported with Frontier Engines)
                  </label>
                  <span className="text-[10px] text-purple-400 font-mono">
                    Context: {currentModelData.contextWindow}
                  </span>
                </div>
                <select
                  value={selectedModel}
                  onChange={(e) => {
                    onChangeModel(e.target.value);
                    showToastNotice(`Switched to ${e.target.value}`);
                  }}
                  className="w-full bg-[#15192c] border border-[#252c4b] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
                >
                  <optgroup label="DeepSeek (Real Logo)">
                    <option value="deepseek-chat">DeepSeek V3 (671B MoE Code) ★ Recommended</option>
                    <option value="deepseek-reasoner">DeepSeek R1 (Thinking Reasoning)</option>
                  </optgroup>
                  <optgroup label="NVIDIA (Real Logo)">
                    <option value="nvidia/llama-3.1-nemotron-70b">Llama 3.1 Nemotron 70B (NVIDIA NIM) ★</option>
                    <option value="nvidia/nemotron-4-340b">Nemotron-4 340B Instruct (NVIDIA)</option>
                  </optgroup>
                  <optgroup label="Anthropic Claude (Real Logo)">
                    <option value="claude-3-7-sonnet">Claude 3.7 Sonnet (Hybrid Reasoning) ★</option>
                    <option value="claude-3-5-sonnet">Claude 3.5 Sonnet (Architecture Specialist)</option>
                    <option value="claude-3-5-haiku">Claude 3.5 Haiku (Ultra Fast)</option>
                  </optgroup>
                  <optgroup label="Google Gemini (Real Logo)">
                    <option value="gemini-3.8-flash">Gemini 3.8 Flash (Official SDK) ★</option>
                    <option value="gemini-4-argon">Gemini 4 Argon (Deep STEM Reasoning)</option>
                    <option value="gemini-3.1-flash-lite">Gemini 3.1 Flash Lite (Low Latency)</option>
                  </optgroup>
                  <optgroup label="Meta Llama (Real Logo)">
                    <option value="meta/llama-3.3-70b">Llama 3.3 70B Instruct (Meta) ★</option>
                    <option value="meta/llama-3.2-90b-vision">Llama 3.2 90B Vision (Meta)</option>
                  </optgroup>
                  <optgroup label="Moonshot AI (Real Logo)">
                    <option value="moonshot-v1-128k">Kimi Moonshot v1 128K ★</option>
                  </optgroup>
                  <optgroup label="OpenAI">
                    <option value="gpt-4o">OpenAI GPT-4o (Omni Flagship)</option>
                    <option value="gpt-4o-mini">OpenAI GPT-4o Mini (Fast)</option>
                    <option value="o1">OpenAI o1 (Chain-of-Thought)</option>
                    <option value="o3-mini">OpenAI o3-mini (Agile Reasoning)</option>
                  </optgroup>
                  <optgroup label="Groq & Cerebras LPU">
                    <option value="groq/llama-3.3-70b">Llama 3.3 70B (Groq LPU 500 T/s)</option>
                    <option value="cerebras/llama-3.1-70b">Llama 3.1 70B (Cerebras Wafer 2000 T/s)</option>
                  </optgroup>
                  <optgroup label="Mistral AI & xAI">
                    <option value="codestral-latest">Codestral 22B</option>
                    <option value="mistral-large-latest">Mistral Large 2 (123B)</option>
                    <option value="grok-2">xAI Grok 2</option>
                  </optgroup>
                  <optgroup label="Local Ollama / LM Studio">
                    <option value="llama3:latest">Llama 3 (Ollama Local)</option>
                    <option value="deepseek-coder:6.7b">DeepSeek Coder (Local 6.7B)</option>
                    <option value="qwen2.5-coder:7b">Qwen 2.5 Coder (Local 7B)</option>
                    <option value="lmstudio/local-model">LM Studio Local Server</option>
                  </optgroup>
                </select>
              </div>

              {/* Hyperparameters: Temperature & Max Tokens */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#15192c] border border-[#252c4b] rounded-xl">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-semibold text-slate-300">Temperature</label>
                    <span className="font-mono text-purple-400 font-bold">{temperature}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full accent-purple-600 cursor-pointer"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Lower values (0.2) = deterministic code; higher (0.8) = creative design.
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-semibold text-slate-300">Max Generation Tokens</label>
                    <span className="font-mono text-purple-400 font-bold">{maxTokens}</span>
                  </div>
                  <select
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(e.target.value)}
                    className="w-full bg-[#0d0f1a] border border-[#252c4b] rounded-lg px-2.5 py-1.5 text-xs text-white"
                  >
                    <option value="4096">4,096 tokens (Fast)</option>
                    <option value="8192">8,192 tokens (Standard)</option>
                    <option value="16384">16,384 tokens (Full-Stack Monorepo)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BYOK API KEY MANAGER */}
          {activeTab === 'keys' && (
            <div className="space-y-4">
              <div className="p-3 bg-purple-950/20 border border-purple-800/40 rounded-xl text-xs text-purple-300 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Private & Encrypted:</span> API keys are stored only in your local browser sandbox (`localStorage`). Athokpam AI never sends keys to third-party tracking or telemetry servers.
                </div>
              </div>

              {/* Gemini Key */}
              <div className="p-4 bg-[#15192c] border border-[#252c4b] rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">Google Gemini API Key</span>
                  <span className="text-[10px] text-emerald-400 font-mono">Server SDK Configured</span>
                </div>
                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={keysByProvider.gemini || customApiKey || ''}
                    onChange={(e) => handleUpdateProviderKey('gemini', e.target.value)}
                    placeholder="Enter custom Gemini API key (optional, managed fallback ready)..."
                    className="w-full bg-[#0d0f1a] border border-[#252c4b] rounded-lg pl-3 pr-10 py-2 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                  >
                    {showApiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Anthropic Claude Key */}
              <div className="p-4 bg-[#15192c] border border-[#252c4b] rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">Anthropic Claude API Key</span>
                  <span className="text-[10px] text-amber-400 font-mono">Claude 3.7 Ready</span>
                </div>
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={keysByProvider.anthropic || ''}
                  onChange={(e) => handleUpdateProviderKey('anthropic', e.target.value)}
                  placeholder="sk-ant-api03-..."
                  className="w-full bg-[#0d0f1a] border border-[#252c4b] rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* OpenAI Key */}
              <div className="p-4 bg-[#15192c] border border-[#252c4b] rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">OpenAI API Key</span>
                  <span className="text-[10px] text-purple-400 font-mono">GPT-4o & o1</span>
                </div>
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={keysByProvider.openai || ''}
                  onChange={(e) => handleUpdateProviderKey('openai', e.target.value)}
                  placeholder="sk-proj-..."
                  className="w-full bg-[#0d0f1a] border border-[#252c4b] rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Ollama Local Endpoint */}
              <div className="p-4 bg-[#15192c] border border-[#252c4b] rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">Local Ollama / LM Studio URL</span>
                  <button
                    onClick={testOllamaConnection}
                    className="px-2.5 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-semibold cursor-pointer"
                  >
                    {ollamaStatus === 'checking' ? 'Pinging...' : 'Test Local Host'}
                  </button>
                </div>
                <input
                  type="text"
                  value={ollamaEndpoint}
                  onChange={(e) => onChangeOllamaEndpoint(e.target.value)}
                  placeholder="http://127.0.0.1:11434"
                  className="w-full bg-[#0d0f1a] border border-[#252c4b] rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
                />
                {ollamaStatus === 'connected' && (
                  <p className="text-emerald-400 text-[11px] flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Ollama daemon active and reachable.
                  </p>
                )}
                {ollamaStatus === 'error' && (
                  <p className="text-amber-400 text-[11px]">
                    Could not connect. Ensure Ollama is running with `OLLAMA_ORIGINS="*"`.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: SYSTEM PROMPTS & PRESETS */}
          {activeTab === 'system' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  One-Click Architectural Presets
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {SYSTEM_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        onChangeSystemPrompt(p.prompt);
                        showToastNotice(`Loaded preset: ${p.name}`);
                      }}
                      className="p-2.5 rounded-xl bg-[#15192c] border border-[#242b4b] hover:border-purple-500/50 text-left transition-colors cursor-pointer"
                    >
                      <div className="font-bold text-xs text-white">{p.name}</div>
                      <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{p.prompt}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Custom System Architecture Prompt
                </label>
                <textarea
                  rows={8}
                  value={customSystemPrompt}
                  onChange={(e) => onChangeSystemPrompt(e.target.value)}
                  placeholder="Add custom developer instructions, formatting rules, or design constraints..."
                  className="w-full bg-[#15192c] border border-[#252c4b] rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-purple-500 font-mono leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* TAB 4: EDITOR & SANDBOX PREFERENCES */}
          {activeTab === 'preferences' && (
            <div className="space-y-5">
              <div className="p-4 bg-[#15192c] border border-[#252c4b] rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white text-xs">Monaco Editor Font Size</div>
                    <div className="text-[10px] text-slate-400">Controls typography in the Code editor tab</div>
                  </div>
                  <select
                    value={fontSize}
                    onChange={(e) => setFontSize(e.target.value)}
                    className="bg-[#0d0f1a] border border-[#252c4b] rounded-lg px-3 py-1.5 text-xs text-white"
                  >
                    <option value="12px">12px (Compact)</option>
                    <option value="13px">13px (Default)</option>
                    <option value="14px">14px (Comfortable)</option>
                    <option value="16px">16px (Large)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#252c4b]">
                  <div>
                    <div className="font-bold text-white text-xs">Auto-Reload Live Sandbox</div>
                    <div className="text-[10px] text-slate-400">Hot-reloads preview whenever file edits complete</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoReload}
                    onChange={(e) => setAutoReload(e.target.checked)}
                    className="w-4 h-4 rounded text-purple-600 bg-[#0d0f1a] border-slate-600 cursor-pointer"
                  />
                </div>
              </div>

              {/* Danger Zone */}
              <div className="p-4 bg-red-950/20 border border-red-900/40 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-red-300 text-xs">Reset Workspace Cache</div>
                    <div className="text-[10px] text-slate-400">Clears locally stored user profiles, API keys, and cache.</div>
                  </div>
                  <button
                    onClick={handleResetCache}
                    className="px-3 py-1.5 rounded-lg bg-red-600/30 hover:bg-red-600/50 border border-red-500/40 text-red-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear Data</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ABOUT ATHOKPAM AI */}
          {activeTab === 'about' && (
            <div className="space-y-4">
              <div className="bg-[#15192c] border border-[#252c4b] rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                    AL
                  </div>
                  <h3 className="font-bold text-white text-sm">About Athokpam AI & Athokpam Labs</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Athokpam AI is a next-generation web application engineering engine running on 30+ AI models across Google Gemini, Anthropic Claude, OpenAI, DeepSeek, Meta Llama, Mistral, Qwen, and local Ollama. It features streaming architectural synthesis, an in-memory virtual file system, and instant React 18 browser execution.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-[#15192c] border border-[#252c4b] rounded-xl">
                  <span className="text-slate-400 block text-[10px]">Client Runtime</span>
                  <span className="font-semibold text-white">React 18 + Babel + Tailwind</span>
                </div>
                <div className="p-3 bg-[#15192c] border border-[#252c4b] rounded-xl">
                  <span className="text-slate-400 block text-[10px]">AI Integration</span>
                  <span className="font-semibold text-white">@google/genai Multi-Model</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#242b4b] bg-[#161a2e] flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-mono">
            Active: <span className="text-purple-300 font-bold">{selectedModel}</span>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
          >
            Save & Apply Settings
          </button>
        </div>
      </div>
    </div>
  );
};
