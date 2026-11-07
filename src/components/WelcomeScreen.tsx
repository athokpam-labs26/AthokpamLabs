import React, { useState } from 'react';
import { 
  Zap, 
  Sparkles, 
  ArrowRight, 
  LayoutDashboard, 
  Gamepad2, 
  ShoppingBag, 
  Terminal, 
  Cpu, 
  FolderSync, 
  Wand2 
} from 'lucide-react';
import { STARTER_TEMPLATES, StarterTemplate } from '../templates/starterProjects';
import { ModelOption } from '../types';

interface WelcomeScreenProps {
  onStartWithPrompt: (prompt: string) => void;
  onSelectStarter: (starter: StarterTemplate) => void;
  selectedModel: string;
  onSelectModel: (model: string) => void;
  modelOptions: ModelOption[];
  onOpenSettings: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStartWithPrompt,
  onSelectStarter,
  selectedModel,
  onSelectModel,
  modelOptions,
  onOpenSettings,
}) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onStartWithPrompt(prompt.trim());
  };

  const samplePrompts = [
    'Create an interactive Kanban board with drag-and-drop and priority tags',
    'Build a personal finance expense tracker with category budgets and monthly charts',
    'Design a real-time markdown editor with live split preview and syntax highlighting',
    'Build a retro Pomodoro timer with ambient soundscapes and task checklist',
  ];

  return (
    <div className="min-h-full flex flex-col items-center justify-center p-6 bg-radial-[at_top_center] from-[#1e1b4b]/30 via-[#0b0d18] to-[#07080f] text-slate-100 select-none overflow-y-auto">
      <div className="max-w-3xl w-full text-center space-y-8 my-auto py-10">
        {/* Brand Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1b1f38] border border-[#2e3660] shadow-xl shadow-purple-900/10 mb-2">
          <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span className="text-xs font-semibold tracking-wide text-purple-300">
            Athokpam Labs • Next-Gen AI Web Dev Sandbox (30+ LLMs)
          </span>
        </div>

        {/* Hero Title */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            What do you want to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400">build with Athokpam Labs</span>?
          </h1>
          <p className="text-sm text-slate-400 max-w-lg mx-auto">
            Prompt, run, edit, and export modern web applications in real-time powered by 30+ AI models across Gemini, Claude, GPT-4o, DeepSeek, Llama, Mistral, and local Ollama.
          </p>
        </div>

        {/* Main Prompt Box */}
        <form onSubmit={handleSubmit} className="bg-[#121528] border border-[#272e50] hover:border-purple-500/60 focus-within:border-purple-500 rounded-2xl p-3.5 shadow-2xl transition-all text-left">
          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="How can Athokpam Labs help you build something amazing today? (Supports 30+ AI models)"
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none resize-none leading-relaxed"
          />

          <div className="flex items-center justify-between pt-3 border-t border-[#1e233f] mt-1">
            <div className="flex items-center gap-2">
              <select
                value={selectedModel}
                onChange={(e) => onSelectModel(e.target.value)}
                className="bg-[#1a1f38] text-xs font-mono text-purple-300 border border-[#2c355f] rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer"
              >
                {modelOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.name}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={onOpenSettings}
                className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded hover:bg-[#1a1f38] transition-colors"
                title="Configure LLM Providers"
              >
                Providers
              </button>
            </div>

            <button
              type="submit"
              disabled={!prompt.trim()}
              className="flex items-center gap-1.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 disabled:opacity-40 text-white font-semibold text-xs px-5 py-2 rounded-xl shadow-lg shadow-purple-600/30 transition-all active:scale-95"
            >
              <span>Build App</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        {/* Quick sample prompts */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => onStartWithPrompt(p)}
              className="text-xs px-3 py-1.5 rounded-lg bg-[#141829] hover:bg-[#1c223c] border border-[#202746] text-slate-400 hover:text-purple-300 transition-colors"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Starter Templates Section */}
        <div className="space-y-4 pt-6">
          <div className="flex items-center justify-between text-xs px-1">
            <span className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
              Or start with a curated template
            </span>
            <span className="text-slate-500">Instant in-browser preview</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            {STARTER_TEMPLATES.map((starter) => (
              <div
                key={starter.id}
                onClick={() => onSelectStarter(starter)}
                className="p-4 rounded-xl bg-[#12162a]/80 hover:bg-[#191e3a] border border-[#222849] hover:border-purple-500/50 cursor-pointer transition-all flex flex-col justify-between group shadow-md"
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-3 group-hover:scale-105 transition-transform">
                    {starter.category === 'SaaS' && <LayoutDashboard className="w-4 h-4" />}
                    {starter.category === 'Game' && <Gamepad2 className="w-4 h-4" />}
                    {starter.category === 'AI' && <Sparkles className="w-4 h-4" />}
                    {starter.category === 'E-commerce' && <ShoppingBag className="w-4 h-4" />}
                  </div>
                  <h3 className="font-semibold text-sm text-white group-hover:text-purple-300 transition-colors">
                    {starter.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                    {starter.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#1d2342] flex items-center justify-between text-[10px]">
                  <span className="font-mono text-purple-400">{starter.category}</span>
                  <span className="text-slate-500 group-hover:text-white flex items-center gap-1 transition-colors">
                    Launch <ArrowRight className="w-2.5 h-2.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
