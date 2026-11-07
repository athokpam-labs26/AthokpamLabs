import React, { useState } from 'react';
import { 
  Plus, 
  ArrowUp, 
  Mic, 
  MicOff, 
  ChevronDown, 
  Sparkles, 
  User, 
  Cpu, 
  Layers, 
  Check, 
  Code2, 
  Terminal, 
  ShieldCheck, 
  Zap, 
  ExternalLink,
  Laptop,
  CheckCircle2,
  Lock,
  Globe,
  Sliders,
  Play,
  Download,
  GitBranch,
  Split,
  Eye,
  FileCode,
  ArrowRight
} from 'lucide-react';
import { UserProfile } from '../types';
import { ALL_MODELS, AIModel } from '../data/models';
import { STARTER_TEMPLATES, StarterTemplate } from '../templates/starterProjects';

interface LandingPageProps {
  userProfile: UserProfile | null;
  onOpenOnboarding: () => void;
  onSubmitPrompt: (prompt: string, selectedModelId: string) => void;
  onOpenWorkspace: () => void;
  selectedModel: string;
  onChangeModel: (model: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  userProfile,
  onOpenOnboarding,
  onSubmitPrompt,
  onOpenWorkspace,
  selectedModel,
  onChangeModel,
}) => {
  const [promptText, setPromptText] = useState('');
  const [isMicActive, setIsMicActive] = useState(false);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [activeNavDropdown, setActiveNavDropdown] = useState<'solutions' | 'resources' | null>(null);
  const [activeStepTab, setActiveStepTab] = useState<number>(0);

  // Active Model object
  const currentModelObj = ALL_MODELS.find((m) => m.id === selectedModel) || ALL_MODELS[0];

  const handleSendPrompt = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!promptText.trim()) return;

    if (!userProfile) {
      onOpenOnboarding();
      return;
    }

    onSubmitPrompt(promptText.trim(), selectedModel);
  };

  const handleStarterClick = (template: StarterTemplate) => {
    const starterPrompt = `Build an interactive ${template.title}. Feature rich with dark mode, animations, and clean components.`;
    setPromptText(starterPrompt);
    if (!userProfile) {
      onOpenOnboarding();
    } else {
      onSubmitPrompt(starterPrompt, selectedModel);
    }
  };

  const HOW_IT_WORKS_STEPS = [
    {
      step: '01',
      title: 'Prompt with 30+ LLMs',
      desc: 'Describe what you want to build in natural language. Athokpam AI connects to Google Gemini, Claude, GPT-4o, DeepSeek, or local Ollama to plan your architecture.',
      highlight: 'Multi-Model Prompting',
      icon: Sparkles,
      previewCode: `// Prompt input to Athokpam AI
"Create a real-time SaaS sales dashboard with revenue velocity charts and user filters"`,
    },
    {
      step: '02',
      title: 'Real-Time File Synthesis',
      desc: 'Athokpam AI streams modular code directly into an in-memory Virtual File System. Watch files, dependencies, and Tailwind styles generate incrementally in seconds.',
      highlight: 'Virtual AST Synthesis',
      icon: Code2,
      previewCode: `<athokpamArtifact id="saas-app" title="SaaS Dashboard">
  <athokpamAction type="file" filePath="src/App.tsx">
    export default function Dashboard() { ... }
  </athokpamAction>
</athokpamArtifact>`,
    },
    {
      step: '03',
      title: 'In-Browser React 18 Sandbox',
      desc: 'No remote containers or cold starts. Code compiles in client memory with in-browser Babel and Tailwind CSS CDN, mounting an interactive sandbox immediately.',
      highlight: 'Zero Cold Start Runtime',
      icon: Zap,
      previewCode: `// Sandboxed React 18 Runtime
Mounted: App.tsx (148ms)
Active: http://localhost:3000/ [Preview Live]`,
    },
    {
      step: '04',
      title: 'Inspect Diffs & 1-Click ZIP',
      desc: 'Test across mobile, tablet, and desktop viewports, inspect git-like diffs for every change, simulate terminal shell commands, and export clean ZIP archives.',
      highlight: 'Production Ready Export',
      icon: Download,
      previewCode: `✔ Project checkpoint verified
✔ Downloaded athokpam-project.zip (ready for 'npm run dev')`,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans select-none overflow-x-hidden text-neutral-900 bg-white">
      {/* 
        ========================================================================
        HERO WRAPPER: Animated celestial gradient mesh background matching Lovable
        ========================================================================
      */}
      <div className="relative w-full min-h-[92vh] flex flex-col justify-between overflow-hidden">
        {/* Animated multi-layered atmospheric mesh gradient */}
        <div 
          className="absolute inset-0 pointer-events-none animate-mesh-drift"
          style={{
            background: `
              radial-gradient(circle at 50% 12%, rgba(147, 197, 253, 0.95) 0%, rgba(186, 230, 253, 0.6) 35%, transparent 70%),
              radial-gradient(circle at 85% 25%, rgba(192, 132, 252, 0.8) 0%, rgba(232, 121, 249, 0.5) 40%, transparent 70%),
              radial-gradient(circle at 15% 30%, rgba(167, 139, 250, 0.75) 0%, rgba(192, 132, 252, 0.4) 45%, transparent 70%),
              radial-gradient(circle at 50% 85%, rgba(244, 63, 94, 0.95) 0%, rgba(236, 72, 153, 0.85) 35%, rgba(225, 29, 72, 0.5) 60%, transparent 90%),
              radial-gradient(circle at 80% 95%, rgba(251, 113, 133, 0.9) 0%, transparent 60%),
              radial-gradient(circle at 20% 95%, rgba(244, 63, 94, 0.85) 0%, transparent 60%),
              linear-gradient(180deg, #b9d5fc 0%, #d8b4fe 40%, #f472b6 70%, #f43f5e 100%)
            `,
          }}
        />

        {/* Ambient floating glowing orbs for fluid living background animation */}
        <div className="absolute -top-20 left-1/4 w-96 h-96 rounded-full bg-cyan-300/40 animate-orb-glow pointer-events-none" />
        <div className="absolute top-1/3 -right-20 w-[500px] h-[500px] rounded-full bg-fuchsia-400/35 animate-orb-glow pointer-events-none" style={{ animationDelay: '3s' }} />
        <div className="absolute bottom-10 -left-20 w-[450px] h-[450px] rounded-full bg-rose-500/30 animate-orb-glow pointer-events-none" style={{ animationDelay: '6s' }} />

        {/* Soft blur overlay to create creamy cinematic look */}
        <div className="absolute inset-0 backdrop-blur-[60px] pointer-events-none" />

        {/* 
          ======================================================================
          TOP NAVIGATION BAR (Clean, high-fashion Lovable aesthetic)
          ======================================================================
        */}
        <header className="relative z-30 w-full px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <div 
              onClick={onOpenWorkspace}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              {/* Lovable-inspired Heart/Gem Gradient Monogram */}
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF3B69] via-[#9E4BFF] to-[#3B82F6] flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-pink-500/25 group-hover:scale-105 transition-transform">
                ♥
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold tracking-tight text-neutral-900">
                  Athokpam
                </span>
                <span className="text-xl font-medium tracking-tight text-neutral-700">
                  Labs
                </span>
              </div>
            </div>

            {/* Navigation Links with quiet hover states */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-700">
              {/* Solutions Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setActiveNavDropdown(activeNavDropdown === 'solutions' ? null : 'solutions')}
                  className="flex items-center gap-1 hover:text-neutral-950 transition-colors py-1 cursor-pointer"
                >
                  <span>Solutions</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                </button>

                {activeNavDropdown === 'solutions' && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white/95 backdrop-blur-md rounded-2xl border border-neutral-200/80 shadow-xl p-2 z-50 text-xs">
                    <div 
                      onClick={() => {
                        handleStarterClick(STARTER_TEMPLATES[0]);
                        setActiveNavDropdown(null);
                      }}
                      className="p-2.5 rounded-xl hover:bg-neutral-100 cursor-pointer flex items-center gap-2.5 text-neutral-800"
                    >
                      <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                        📊
                      </div>
                      <div>
                        <div className="font-semibold text-neutral-900">SaaS Dashboards</div>
                        <div className="text-[11px] text-neutral-500">Analytics, charts & MRR velocity</div>
                      </div>
                    </div>

                    <div 
                      onClick={() => {
                        handleStarterClick(STARTER_TEMPLATES[1]);
                        setActiveNavDropdown(null);
                      }}
                      className="p-2.5 rounded-xl hover:bg-neutral-100 cursor-pointer flex items-center gap-2.5 text-neutral-800"
                    >
                      <div className="w-7 h-7 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center font-bold">
                        ✨
                      </div>
                      <div>
                        <div className="font-semibold text-neutral-900">AI Creator Apps</div>
                        <div className="text-[11px] text-neutral-500">Prompt tools & smart content studios</div>
                      </div>
                    </div>

                    <div 
                      onClick={() => {
                        handleStarterClick(STARTER_TEMPLATES[2]);
                        setActiveNavDropdown(null);
                      }}
                      className="p-2.5 rounded-xl hover:bg-neutral-100 cursor-pointer flex items-center gap-2.5 text-neutral-800"
                    >
                      <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                        📋
                      </div>
                      <div>
                        <div className="font-semibold text-neutral-900">Kanban & CRM Tools</div>
                        <div className="text-[11px] text-neutral-500">Drag-and-drop pipelines & tasks</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Resources Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setActiveNavDropdown(activeNavDropdown === 'resources' ? null : 'resources')}
                  className="flex items-center gap-1 hover:text-neutral-950 transition-colors py-1 cursor-pointer"
                >
                  <span>Resources</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                </button>

                {activeNavDropdown === 'resources' && (
                  <div className="absolute top-full left-0 mt-2 w-72 bg-white/95 backdrop-blur-md rounded-2xl border border-neutral-200/80 shadow-xl p-3 z-50 text-xs">
                    <div className="font-semibold text-neutral-900 px-2 py-1 uppercase tracking-wider text-[10px] text-neutral-400">
                      Frontier AI Engine
                    </div>
                    <div className="p-2 rounded-xl bg-purple-50 text-purple-900 mb-2">
                      <span className="font-bold">33+ LLMs Supported</span>
                      <p className="text-[11px] text-purple-700 mt-0.5">
                        Gemini 3.8 Flash, Claude 3.7 Sonnet, GPT-4o, DeepSeek R1, Llama 3.3, and local Ollama.
                      </p>
                    </div>
                    <div className="text-[11px] text-neutral-600 px-2">
                      React 18 Sandbox • Tailwind CSS • Virtual File System • Instant ZIP Export
                    </div>
                  </div>
                )}
              </div>

              <a href="#how-it-works" className="hover:text-neutral-950 transition-colors">
                How It Works
              </a>
              <a href="#features" className="hover:text-neutral-950 transition-colors">
                Key Features
              </a>
              <a href="#models" className="hover:text-neutral-950 transition-colors">
                30+ Models
              </a>
              <a href="#security" className="hover:text-neutral-950 transition-colors">
                Security
              </a>
            </nav>
          </div>

          {/* Right Controls: Auth / User Profile */}
          <div className="flex items-center gap-3">
            {userProfile ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenOnboarding}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 hover:bg-white border border-neutral-200/70 shadow-xs text-xs font-medium text-neutral-800 transition-all cursor-pointer"
                  title="Edit Profile & AI Keys"
                >
                  <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-[10px]">
                    {userProfile.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-semibold">{userProfile.name}</span>
                  <span className="text-[10px] text-neutral-500 font-mono hidden sm:inline">
                    ({userProfile.role.split(' ')[0]})
                  </span>
                </button>

                <button
                  onClick={onOpenWorkspace}
                  className="px-4 py-2 rounded-full bg-neutral-900 hover:bg-black text-white text-xs font-semibold shadow-md shadow-neutral-900/15 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>Open Workspace</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <button
                  onClick={onOpenOnboarding}
                  className="px-4 py-1.5 rounded-full border border-neutral-300/80 bg-white/70 hover:bg-white text-neutral-800 text-sm font-medium transition-all cursor-pointer shadow-xs"
                >
                  Log in
                </button>
                <button
                  onClick={onOpenOnboarding}
                  className="px-5 py-2 rounded-full bg-neutral-900 hover:bg-black text-white text-sm font-medium shadow-md shadow-neutral-900/15 transition-all cursor-pointer"
                >
                  Get started
                </button>
              </div>
            )}
          </div>
        </header>

        {/* 
          ======================================================================
          HERO CENTER: Headline, Promo Chip & Warm Cream Prompt Box
          ======================================================================
        */}
        <div className="relative z-20 flex-1 flex flex-col items-center justify-center px-4 pt-6 pb-12 max-w-4xl mx-auto w-full text-center">
          {/* Promo Pill Banner matching screenshot */}
          <div 
            onClick={onOpenOnboarding}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-white/60 shadow-sm mb-6 text-xs text-neutral-800 cursor-pointer hover:bg-white/90 transition-all"
          >
            <span className="px-2 py-0.5 rounded-full bg-[#6366F1] text-white font-bold text-[11px] shadow-xs">
              Promo
            </span>
            <span className="font-medium">
              Credits go 2x further until Apr 30
            </span>
            <span className="text-neutral-500">→</span>
          </div>

          {/* Hero Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-neutral-900 tracking-tight leading-[1.08] mb-4">
            Build something Athokpam AI
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-neutral-700/90 font-normal max-w-xl mx-auto mb-10 leading-relaxed">
            Create apps and websites by chatting with AI
          </p>

          {/* 
            ====================================================================
            ICONIC PROMPT BOX (Warm eggshell/cream card matching Lovable)
            ====================================================================
          */}
          <div className="w-full max-w-2xl bg-[#FDFBF7] border border-neutral-200/80 rounded-[28px] shadow-2xl shadow-rose-950/10 p-5 text-left transition-all focus-within:ring-2 focus-within:ring-purple-400/40 focus-within:border-purple-300">
            <textarea
              rows={3}
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendPrompt();
                }
              }}
              placeholder="Ask Athokpam AI to create an internal tool that..."
              className="w-full bg-transparent resize-none border-none outline-none text-neutral-800 placeholder-neutral-400 text-base sm:text-lg leading-relaxed font-normal"
            />

            {/* Bottom Controls Row inside the Prompt Box */}
            <div className="pt-2 flex items-center justify-between border-t border-neutral-200/50 mt-1">
              {/* Left Action: Plus Attachment */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPromptText((prev) => prev ? `${prev} with authentication, role-based access, and dark mode` : 'Create a full-stack SaaS CRM with customer pipelines, deal stages, and real-time revenue analytics');
                  }}
                  title="Enhance prompt with presets"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/50 transition-colors cursor-pointer"
                >
                  <Plus className="w-5 h-5" />
                </button>
                <span className="text-xs text-neutral-400 hidden sm:inline">
                  30+ Models Connected
                </span>
              </div>

              {/* Right Controls: Model Selector, Mic, Send */}
              <div className="flex items-center gap-2.5">
                {/* Build / Model Selector Dropdown with Real Logos */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-neutral-200/60 text-xs font-semibold text-neutral-700 transition-colors cursor-pointer"
                  >
                    {currentModelObj.logo ? (
                      <img
                        src={currentModelObj.logo}
                        alt={currentModelObj.name}
                        className="w-4 h-4 rounded-sm object-contain bg-white/90 p-0.5 border border-neutral-300/60 shadow-2xs"
                      />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    )}
                    <span>Build</span>
                    <span className="text-[11px] text-neutral-500 font-normal">({currentModelObj.name.split(' ')[0]})</span>
                    <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
                  </button>

                  {/* Popover Model Picker */}
                  {isModelDropdownOpen && (
                    <div className="absolute right-0 bottom-full mb-2 w-80 max-h-80 overflow-y-auto bg-white rounded-2xl border border-neutral-200 shadow-xl p-2 z-50 text-xs">
                      <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                        Select AI Model (Frontier Logos)
                      </div>
                      {ALL_MODELS.map((model) => (
                        <div
                          key={model.id}
                          onClick={() => {
                            onChangeModel(model.id);
                            setIsModelDropdownOpen(false);
                          }}
                          className={`p-2 rounded-xl cursor-pointer flex items-center justify-between transition-colors ${
                            model.id === selectedModel
                              ? 'bg-purple-100 text-purple-900 font-semibold'
                              : 'hover:bg-neutral-100 text-neutral-800'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {model.logo ? (
                              <img
                                src={model.logo}
                                alt={model.name}
                                className="w-6 h-6 rounded-md object-contain bg-white p-0.5 border border-neutral-200 shadow-2xs shrink-0"
                              />
                            ) : (
                              <div className="w-6 h-6 rounded-md bg-neutral-200 text-neutral-600 flex items-center justify-center font-bold text-[10px] shrink-0">
                                {model.name.charAt(0)}
                              </div>
                            )}
                            <div>
                              <div className="text-xs flex items-center gap-1.5">
                                <span>{model.name}</span>
                                {model.recommended && (
                                  <span className="text-[9px] px-1 py-0.2 rounded bg-purple-200 text-purple-800 font-mono">
                                    ★
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-neutral-400">{model.providerName} • {model.modelFamily}</div>
                            </div>
                          </div>
                          {model.id === selectedModel && <Check className="w-3.5 h-3.5 text-purple-600" />}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Voice / Mic Button */}
                <button
                  type="button"
                  onClick={() => setIsMicActive(!isMicActive)}
                  title={isMicActive ? 'Microphone active' : 'Click to voice dictate'}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                    isMicActive 
                      ? 'bg-red-500 text-white animate-pulse' 
                      : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/50'
                  }`}
                >
                  {isMicActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                {/* Send Button (Dark circle with up arrow matching screenshot) */}
                <button
                  type="button"
                  onClick={() => handleSendPrompt()}
                  disabled={!promptText.trim()}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    promptText.trim()
                      ? 'bg-neutral-900 text-white hover:bg-black shadow-md shadow-neutral-900/20 scale-100'
                      : 'bg-neutral-400 text-white opacity-70 cursor-not-allowed'
                  }`}
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Starter Chips */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-neutral-700/80 font-medium mr-1">Inspirations:</span>
            {STARTER_TEMPLATES.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => handleStarterClick(tpl)}
                className="px-3 py-1 rounded-full bg-white/70 hover:bg-white border border-white/60 text-xs font-medium text-neutral-800 shadow-xs hover:shadow-sm transition-all cursor-pointer"
              >
                {tpl.title}
              </button>
            ))}
          </div>
        </div>

        {/* Ambient bottom divider transition */}
        <div className="h-10 w-full" />
      </div>

      {/* 
        ========================================================================
        HOW IT WORKS SECTION: Interactive Step-by-Step Flow
        ========================================================================
      */}
      <section id="how-it-works" className="py-20 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-purple-600 uppercase tracking-widest font-mono">
            Seamless Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight mt-2 mb-4">
            How Athokpam AI Works
          </h2>
          <p className="text-neutral-600 text-base leading-relaxed">
            From natural language prompt to live interactive React 18 application in seconds. Zero build setup or deployment delays.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {HOW_IT_WORKS_STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isSelected = activeStepTab === idx;
            return (
              <div
                key={step.step}
                onClick={() => setActiveStepTab(idx)}
                className={`p-6 rounded-2xl border transition-all cursor-pointer text-left ${
                  isSelected
                    ? 'bg-neutral-900 text-white border-neutral-800 shadow-xl scale-[1.02]'
                    : 'bg-neutral-50/70 border-neutral-200/80 hover:border-purple-300 text-neutral-900'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-2xl font-black font-mono ${
                    isSelected ? 'text-purple-400' : 'text-neutral-300'
                  }`}>
                    {step.step}
                  </span>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    isSelected ? 'bg-purple-600 text-white' : 'bg-neutral-200 text-neutral-700'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div className={`text-[10px] font-bold uppercase tracking-wider mb-1 font-mono ${
                  isSelected ? 'text-purple-300' : 'text-purple-600'
                }`}>
                  {step.highlight}
                </div>
                <h3 className={`text-base font-bold mb-2 ${isSelected ? 'text-white' : 'text-neutral-900'}`}>
                  {step.title}
                </h3>
                <p className={`text-xs leading-relaxed ${isSelected ? 'text-neutral-300' : 'text-neutral-600'}`}>
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Interactive Step Preview Console */}
        <div className="rounded-2xl bg-[#0e1120] border border-[#212744] shadow-2xl p-6 text-left max-w-4xl mx-auto overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-[#212744] text-xs">
            <div className="flex items-center gap-2 text-slate-300 font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Phase {HOW_IT_WORKS_STEPS[activeStepTab].step}: {HOW_IT_WORKS_STEPS[activeStepTab].title}</span>
            </div>
            <span className="text-[10px] font-mono text-purple-400">
              Interactive Execution Pipeline
            </span>
          </div>
          <pre className="mt-4 p-4 rounded-xl bg-[#090b14] text-emerald-300 text-xs font-mono leading-relaxed overflow-x-auto border border-[#1a1f36]">
            {HOW_IT_WORKS_STEPS[activeStepTab].previewCode}
          </pre>
        </div>
      </section>

      {/* 
        ========================================================================
        KEY FEATURES SECTION: Full Capabilities of Athokpam AI
        ========================================================================
      */}
      <section id="features" className="py-20 px-6 bg-neutral-50/70 border-t border-neutral-200 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-purple-600 uppercase tracking-widest font-mono">
              Everything You Need
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight mt-2 mb-4">
              Key Features Built for Real Development
            </h2>
            <p className="text-neutral-600 text-base leading-relaxed">
              Athokpam AI brings all aspects of professional software engineering into a single in-browser workspace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-neutral-900 mb-1.5">30+ Frontier LLM Models</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Seamlessly toggle between Google Gemini 3.8 Flash, Claude 3.7 Sonnet, OpenAI GPT-4o, DeepSeek R1, Llama 3.3, and offline Ollama.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-neutral-900 mb-1.5">Virtual File System</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                True hierarchical file tree navigation. Create, rename, delete, and inspect files with real-time state tracking and instant diffs.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-neutral-900 mb-1.5">React 18 Live Sandbox</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                In-browser Babel transpiler compiles JSX and TypeScript on the fly with Tailwind CSS styles, live console interceptors, and error boundaries.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
                <Terminal className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-neutral-900 mb-1.5">Interactive Dev Terminal</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Simulated Node shell executes `npm install`, `npm run dev`, and directory checks with timestamped build logs and diagnostics.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
                <Split className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-neutral-900 mb-1.5">Visual Diff Inspector</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Inspect side-by-side git-like code additions and deletions across turns before committing or reverting checkpoints.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                <Download className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-neutral-900 mb-1.5">1-Click Clean ZIP Export</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Download your full production codebase with package.json, ready to run locally via `npm run dev` or deploy to Vercel and Google Cloud.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 
        ========================================================================
        FEATURE SHOWCASE: 30+ LLMs Support
        ========================================================================
      */}
      <section id="models" className="py-20 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-purple-600 uppercase tracking-widest font-mono">
            Uncapped Intelligence
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight mt-2 mb-4">
            30+ Frontier AI Models in One Unified Workbench
          </h2>
          <p className="text-neutral-600 text-base leading-relaxed">
            Switch effortlessly between Google Gemini, Anthropic Claude, OpenAI, DeepSeek, Meta Llama, and private local Ollama. Athokpam AI streams real-time code modifications directly into an in-browser React 18 sandbox.
          </p>
        </div>

        {/* Models Grid by Provider with Real Logos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 1. Google Gemini Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-blue-50/60 to-white border border-blue-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-white border border-blue-200/80 p-1.5 shadow-xs flex items-center justify-center">
                  <img
                    src="/assets/aistudio/OIP__3__34a26736.webp"
                    alt="Google Gemini Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 font-mono">
                  1M Context
                </span>
              </div>
              <h3 className="font-bold text-neutral-900 text-lg mb-1">Google Gemini</h3>
              <span className="text-xs font-semibold text-blue-600 font-mono">Gemini 3.8 Flash & 4 Argon</span>
              <p className="text-xs text-neutral-600 mt-2 mb-4 leading-relaxed">
                Native high-speed multimodal AI engine. Instant UI synthesis, automated routing, and deep STEM logic.
              </p>
              <div className="space-y-1.5 text-xs text-neutral-700 mb-5">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Official @google/genai SDK</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Sub-second incremental streaming</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                onChangeModel('gemini-3.8-flash');
                window.scrollTo({ top: 300, behavior: 'smooth' });
              }}
              className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Select Gemini 3.8 Flash</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* 2. Anthropic Claude Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-amber-50/60 to-white border border-amber-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-white border border-amber-200/80 p-1.5 shadow-xs flex items-center justify-center">
                  <img
                    src="/assets/aistudio/OIP__1__6c880ef0.webp"
                    alt="Anthropic Claude Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-mono">
                  Hybrid Reasoning
                </span>
              </div>
              <h3 className="font-bold text-neutral-900 text-lg mb-1">Anthropic Claude</h3>
              <span className="text-xs font-semibold text-amber-700 font-mono">Claude 3.7 & 3.5 Sonnet</span>
              <p className="text-xs text-neutral-600 mt-2 mb-4 leading-relaxed">
                Gold standard for frontend component architecture, complex state management, and full-stack React systems.
              </p>
              <div className="space-y-1.5 text-xs text-neutral-700 mb-5">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Unmatched coding precision</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>200K token monorepo context</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                onChangeModel('claude-3-7-sonnet');
                window.scrollTo({ top: 300, behavior: 'smooth' });
              }}
              className="w-full py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Select Claude 3.7 Sonnet</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* 3. DeepSeek Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-indigo-50/60 to-white border border-indigo-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-white border border-indigo-200/80 p-1.5 shadow-xs flex items-center justify-center overflow-hidden">
                  <img
                    src="/assets/aistudio/DeepSeek-Logo_043ca2ea.jpg"
                    alt="DeepSeek AI Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800 font-mono">
                  671B MoE
                </span>
              </div>
              <h3 className="font-bold text-neutral-900 text-lg mb-1">DeepSeek AI</h3>
              <span className="text-xs font-semibold text-indigo-600 font-mono">DeepSeek V3 & R1 Thinking</span>
              <p className="text-xs text-neutral-600 mt-2 mb-4 leading-relaxed">
                Open-source breakthrough with chain-of-thought reasoning, mathematical proofs, and competitive coding benchmarks.
              </p>
              <div className="space-y-1.5 text-xs text-neutral-700 mb-5">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Deep algorithmic thinking tags</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Ultra-efficient compute footprint</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                onChangeModel('deepseek-chat');
                window.scrollTo({ top: 300, behavior: 'smooth' });
              }}
              className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Select DeepSeek V3</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* 4. NVIDIA Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-emerald-50/60 to-white border border-emerald-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-white border border-emerald-200/80 p-1.5 shadow-xs flex items-center justify-center overflow-hidden">
                  <img
                    src="/assets/aistudio/nvidia_ca832076.jpg"
                    alt="NVIDIA Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-mono">
                  NVIDIA NIM
                </span>
              </div>
              <h3 className="font-bold text-neutral-900 text-lg mb-1">NVIDIA AI</h3>
              <span className="text-xs font-semibold text-emerald-700 font-mono">Llama 3.1 Nemotron 70B & 340B</span>
              <p className="text-xs text-neutral-600 mt-2 mb-4 leading-relaxed">
                Hardware-accelerated Nemotron intelligence optimized on TensorRT-LLM for hyper-fast inference and high accuracy.
              </p>
              <div className="space-y-1.5 text-xs text-neutral-700 mb-5">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Nemotron reward-model alignment</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>High-throughput enterprise inference</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                onChangeModel('nvidia/llama-3.1-nemotron-70b');
                window.scrollTo({ top: 300, behavior: 'smooth' });
              }}
              className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Select Nemotron 70B</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* 5. Meta Llama Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-sky-50/60 to-white border border-sky-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-white border border-sky-200/80 p-1.5 shadow-xs flex items-center justify-center overflow-hidden">
                  <img
                    src="/assets/aistudio/OIP_06acdd3c.jpg"
                    alt="Meta Llama Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-sky-100 text-sky-800 font-mono">
                  Open Weights
                </span>
              </div>
              <h3 className="font-bold text-neutral-900 text-lg mb-1">Meta Llama</h3>
              <span className="text-xs font-semibold text-sky-600 font-mono">Llama 3.3 70B & 3.2 Vision</span>
              <p className="text-xs text-neutral-600 mt-2 mb-4 leading-relaxed">
                The world's most widely deployed open-weights ecosystem with full-stack coding and multimodal image parsing.
              </p>
              <div className="space-y-1.5 text-xs text-neutral-700 mb-5">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                  <span>Multimodal UI mockup parsing</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                  <span>128K context window support</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                onChangeModel('meta/llama-3.3-70b');
                window.scrollTo({ top: 300, behavior: 'smooth' });
              }}
              className="w-full py-2 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Select Llama 3.3 70B</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* 6. Moonshot AI (Kimi) Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-purple-50/60 to-white border border-purple-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-black border border-neutral-800 p-1.5 shadow-xs flex items-center justify-center overflow-hidden">
                  <img
                    src="/assets/aistudio/OIP__2__e85718d2.webp"
                    alt="Moonshot Kimi Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 font-mono">
                  128K Monorepo
                </span>
              </div>
              <h3 className="font-bold text-neutral-900 text-lg mb-1">Moonshot AI (Kimi)</h3>
              <span className="text-xs font-semibold text-purple-700 font-mono">Kimi Moonshot v1 128K</span>
              <p className="text-xs text-neutral-600 mt-2 mb-4 leading-relaxed">
                Extensive context reasoning capable of ingesting entire multi-file repositories and refactoring whole components.
              </p>
              <div className="space-y-1.5 text-xs text-neutral-700 mb-5">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                  <span>Long-context dependency synthesis</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                  <span>Multi-file cross-referencing</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                onChangeModel('moonshot-v1-128k');
                window.scrollTo({ top: 300, behavior: 'smooth' });
              }}
              className="w-full py-2 bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Select Kimi 128K</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </section>

      {/* 
        ========================================================================
        SANDBOX WORKSPACE HIGHLIGHT
        ========================================================================
      */}
      <section className="py-16 px-6 bg-neutral-900 text-white w-full">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-mono">
              <Zap className="w-3.5 h-3.5" />
              <span>Athokpam AI Virtual Engine</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Full-Stack React 18 Sandbox in Every Turn
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Athokpam AI mounts an active virtual file system inside your browser. Every file change hot-reloads live, executes Node commands, simulates a real shell terminal, and exports to a clean ZIP archive with one click.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-neutral-800/80 border border-neutral-700">
                <Code2 className="w-5 h-5 text-purple-400 mb-2" />
                <h4 className="font-semibold text-sm">Monaco Code Editor</h4>
                <p className="text-[11px] text-slate-400 mt-1">Full syntax highlighting, folder trees, and interactive file diffs.</p>
              </div>
              <div className="p-4 rounded-xl bg-neutral-800/80 border border-neutral-700">
                <Terminal className="w-5 h-5 text-emerald-400 mb-2" />
                <h4 className="font-semibold text-sm">Interactive Terminal</h4>
                <p className="text-[11px] text-slate-400 mt-1">Simulates npm installs, dev servers, and live console errors.</p>
              </div>
            </div>

            <button
              onClick={onOpenWorkspace}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center gap-2 cursor-pointer"
            >
              <span>Launch Live Workspace Sandbox</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 w-full max-w-lg rounded-2xl overflow-hidden border border-neutral-700 shadow-2xl bg-[#11131f] p-4 text-xs font-mono">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800 text-slate-400">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-2 text-[11px] text-slate-300">athokpam-sandbox: ~/project</span>
              </div>
              <span className="text-[10px] text-purple-400">30+ Models Ready</span>
            </div>
            <div className="py-4 space-y-2 text-slate-300">
              <p className="text-purple-400">⚡ Initializing Athokpam AI Virtual Container...</p>
              <p className="text-emerald-400">✔ Mounted VirtualFileSystem (React 18 + Tailwind CSS)</p>
              <p className="text-slate-400">$ npm install lucide-react</p>
              <p className="text-slate-500">added 24 packages in 0.42s</p>
              <p className="text-slate-400">$ npm run dev</p>
              <p className="text-emerald-400">➜ Local: http://localhost:3000/ [Preview Active]</p>
              <p className="text-slate-400 pt-2 font-sans text-xs">
                Active Model: <span className="text-white font-bold">{currentModelObj.name}</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 
        ========================================================================
        SECURITY & DATA PRIVACY
        ========================================================================
      */}
      <section id="security" className="py-16 px-6 bg-neutral-50 border-t border-neutral-200">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900">Developer First Privacy & Security</h2>
          <p className="text-xs text-neutral-600 max-w-xl mx-auto leading-relaxed">
            Your code, API keys, and prompts belong strictly to you. Athokpam AI isolates custom API keys inside encrypted client-side browser storage, with zero logging or model training on your proprietary code.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-semibold text-neutral-700">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-500" /> 100% Code Ownership
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-500" /> Client-Side Storage
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-500" /> Private Ollama Offline Compatible
            </span>
          </div>
        </div>
      </section>

      {/* 
        ========================================================================
        FOOTER
        ========================================================================
      */}
      <footer className="border-t border-neutral-200 py-10 px-6 bg-white text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#FF3B69] via-[#9E4BFF] to-[#3B82F6] flex items-center justify-center text-white font-extrabold text-xs">
              ♥
            </div>
            <span className="font-bold text-neutral-800 text-sm">Athokpam AI</span>
            <span className="text-[11px] text-neutral-400">© 2026. Next-Gen AI Web Dev Sandbox.</span>
          </div>

          <div className="flex items-center gap-6 text-neutral-600">
            <a href="#how-it-works" className="hover:text-neutral-900 transition-colors">How It Works</a>
            <a href="#features" className="hover:text-neutral-900 transition-colors">Key Features</a>
            <a href="#models" className="hover:text-neutral-900 transition-colors">30+ AI Models</a>
            <a href="#security" className="hover:text-neutral-900 transition-colors">Security & Terms</a>
            <button onClick={onOpenOnboarding} className="hover:text-neutral-900 transition-colors cursor-pointer">
              Profile & Keys
            </button>
            <button onClick={onOpenWorkspace} className="text-purple-600 font-semibold hover:text-purple-800 transition-colors cursor-pointer">
              Launch Workspace →
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
