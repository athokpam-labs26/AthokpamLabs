import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Wand2, 
  Terminal, 
  FileCode, 
  Play, 
  CheckCircle2, 
  ChevronDown, 
  ChevronRight, 
  Brain, 
  Paperclip,
  RotateCcw,
  Bot,
  User,
  ArrowRight
} from 'lucide-react';
import { ChatMessage, ModelOption } from '../types';
import { getModelLogo } from '../data/models';

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isStreaming: boolean;
  onOpenFileInEditor: (filePath: string) => void;
  selectedModel: string;
  onSelectModel: (modelId: string) => void;
  modelOptions: ModelOption[];
  onResetChat: () => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  onSendMessage,
  isStreaming,
  onOpenFileInEditor,
  selectedModel,
  onSelectModel,
  modelOptions,
  onResetChat,
}) => {
  const [input, setInput] = useState('');
  const [expandedThoughts, setExpandedThoughts] = useState<Record<string, boolean>>({});
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [modelSearch, setModelSearch] = useState('');
  const [modelProviderFilter, setModelProviderFilter] = useState('all');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isStreaming) return;
    onSendMessage(input.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const toggleThought = (id: string) => {
    setExpandedThoughts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleEnhancePrompt = () => {
    if (!input.trim()) return;
    setInput((prev) => 
      `${prev.trim()} - Implement modern modular components with Tailwind CSS, clean dark aesthetic, interactive animations, robust state management, and accessible UI.`
    );
  };

  const suggestionChips = [
    '✨ Add Dark Mode & Theme Toggle',
    '📊 Add Interactive Analytics Chart',
    '🔍 Add Filter & Search Bar',
    '⚡ Optimize Mobile Responsive Layout',
  ];

  return (
    <div className="h-full flex flex-col bg-[#0e101a] border-r border-[#1b1f33] overflow-hidden select-none">
      {/* Panel Header */}
      <div className="px-4 py-2.5 bg-[#121524] border-b border-[#1b1f33] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-semibold text-slate-200">Athokpam AI Engineer</span>
          <span className="text-[10px] text-purple-300 font-mono px-1.5 py-0.2 rounded bg-purple-500/10 border border-purple-500/20">30+ LLMs</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onResetChat}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-[#1a1e33] transition-colors"
            title="Reset conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Message Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600/20 to-indigo-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 shadow-lg shadow-purple-500/10">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-200 mb-1">What would you like to build?</h3>
            <p className="text-xs text-slate-400 max-w-xs mb-6">
              Prompt, run, edit, and export modern web apps directly inside the browser.
            </p>
            <div className="w-full space-y-2 max-w-sm">
              {suggestionChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => onSendMessage(chip.replace(/^[^\w]+/, ''))}
                  className="w-full text-left text-xs px-3.5 py-2.5 rounded-xl bg-[#141829] hover:bg-[#1c2138] border border-[#232946] text-slate-300 hover:text-purple-300 transition-all flex items-center justify-between group"
                >
                  <span>{chip}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 text-xs ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-6 h-6 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[88%] rounded-2xl p-3.5 space-y-2.5 ${
                  msg.sender === 'user'
                    ? 'bg-purple-600 text-white rounded-br-xs shadow-md shadow-purple-600/20'
                    : 'bg-[#151829] border border-[#212642] text-slate-200 rounded-bl-xs'
                }`}
              >
                {/* Assistant Thought Block */}
                {msg.thought && (
                  <div className="border border-purple-500/20 bg-purple-950/20 rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleThought(msg.id)}
                      className="w-full px-3 py-2 flex items-center justify-between text-[11px] font-medium text-purple-300 hover:bg-purple-900/20 transition-colors"
                    >
                      <div className="flex items-center gap-1.5">
                        <Brain className="w-3.5 h-3.5 text-purple-400" />
                        <span>Architectural Reasoning</span>
                      </div>
                      {expandedThoughts[msg.id] ? (
                        <ChevronDown className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5" />
                      )}
                    </button>
                    {expandedThoughts[msg.id] && (
                      <div className="px-3 py-2 text-[11px] text-slate-300 font-mono whitespace-pre-wrap border-t border-purple-500/10 bg-[#0f111d]">
                        {msg.thought}
                      </div>
                    )}
                  </div>
                )}

                {/* Main message text */}
                {msg.content && (
                  <div className="leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </div>
                )}

                {/* Athokpam AI Artifact Card */}
                {msg.artifact && (
                  <div className="border border-[#2d345a] bg-[#0d0f1a] rounded-xl overflow-hidden mt-2">
                    <div className="px-3 py-2 bg-[#191d33] border-b border-[#2d345a] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="font-semibold text-xs text-white truncate">
                          {msg.artifact.title}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                        Athokpam AI
                      </span>
                    </div>

                    <div className="p-2 space-y-1.5 font-mono text-[11px]">
                      {msg.artifact.actions.map((act) => (
                        <div
                          key={act.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-[#141728] border border-[#202540] hover:border-purple-500/40 transition-colors group"
                        >
                          <div className="flex items-center gap-2 truncate pr-2">
                            {act.type === 'shell' && <Terminal className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                            {act.type === 'file' && <FileCode className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                            {act.type === 'start' && <Play className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}

                            <span className="truncate text-slate-300">
                              {act.type === 'file' ? act.filePath : act.content.split('\n')[0]}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {act.type === 'file' && act.filePath && (
                              <button
                                onClick={() => onOpenFileInEditor(act.filePath!)}
                                className="text-[10px] text-purple-400 hover:text-purple-300 px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                View Code
                              </button>
                            )}
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-[9px] text-slate-400 text-right opacity-60">
                  {msg.timestamp}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-6 h-6 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))
        )}

        {isStreaming && (
          <div className="flex gap-3 text-xs">
            <div className="w-6 h-6 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 animate-pulse">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-[#151829] border border-[#212642] rounded-2xl p-3.5 flex items-center gap-2 text-slate-400">
              <div className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
              <span>Architecting and generating components...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Composer Section */}
      <div className="p-3 bg-[#111320] border-t border-[#1b1f33] shrink-0">
        <form onSubmit={handleSubmit} className="bg-[#161a2b] border border-[#252a47] rounded-xl p-2.5 focus-within:border-purple-500 transition-colors shadow-lg">
          <textarea
            ref={textareaRef}
            rows={2}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
            }}
            onKeyDown={handleKeyDown}
            placeholder="Ask Athokpam Labs AI to edit files, add features, or create new apps..."
            className="w-full bg-transparent text-xs text-slate-100 placeholder-slate-500 focus:outline-none resize-none leading-relaxed"
          />

          <div className="flex items-center justify-between pt-2 border-t border-[#232845] mt-1">
            <div className="flex items-center gap-2">
              {/* Model Selector Pill */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#1d2238] hover:bg-[#252b47] border border-[#2e3557] text-[11px] font-mono text-purple-300 transition-colors"
                >
                  {getModelLogo(selectedModel) ? (
                    <img
                      src={getModelLogo(selectedModel)}
                      alt=""
                      className="w-3.5 h-3.5 rounded-xs object-contain bg-white/95 p-0.5"
                    />
                  ) : (
                    <Sparkles className="w-3 h-3 text-purple-400" />
                  )}
                  <span className="truncate max-w-[120px]">{selectedModel}</span>
                  <span className="text-[9px] px-1 bg-purple-500/20 text-purple-300 rounded">30+</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {isModelDropdownOpen && (
                  <div className="absolute bottom-full left-0 mb-2 w-72 sm:w-80 bg-[#16192a] border border-[#272e4d] rounded-xl shadow-2xl p-2.5 z-50 text-xs">
                    <div className="flex items-center justify-between pb-1.5 border-b border-[#242b4a] mb-2">
                      <span className="text-[10px] font-semibold text-slate-300 uppercase tracking-wider">
                        Select AI Model (30+ Supported)
                      </span>
                      <span className="text-[10px] text-purple-400 font-mono">Athokpam Labs</span>
                    </div>

                    {/* Search bar inside dropdown */}
                    <div className="mb-2">
                      <input
                        type="text"
                        placeholder="Search models (e.g. Claude, DeepSeek, Gemini)..."
                        value={modelSearch}
                        onChange={(e) => setModelSearch(e.target.value)}
                        className="w-full bg-[#0e101c] border border-[#272e4d] rounded-lg px-2.5 py-1 text-[11px] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    {/* Scrollable Model List */}
                    <div className="max-h-56 overflow-y-auto space-y-1">
                      {modelOptions
                        .filter((opt) => {
                          if (modelSearch) {
                            return opt.name.toLowerCase().includes(modelSearch.toLowerCase()) || opt.id.toLowerCase().includes(modelSearch.toLowerCase());
                          }
                          return true;
                        })
                        .map((opt) => {
                          const logo = getModelLogo(opt.id);
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => {
                                onSelectModel(opt.id);
                                setIsModelDropdownOpen(false);
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs transition-colors ${
                                selectedModel === opt.id
                                  ? 'bg-purple-600/20 text-purple-300 font-medium border border-purple-500/30'
                                  : 'text-slate-300 hover:bg-[#20253e]'
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate pr-2">
                                {logo ? (
                                  <img
                                    src={logo}
                                    alt=""
                                    className="w-5 h-5 rounded-md object-contain bg-white/95 p-0.5 border border-slate-700 shrink-0"
                                  />
                                ) : (
                                  <div className="w-5 h-5 rounded-md bg-slate-800 text-slate-400 text-[10px] font-bold flex items-center justify-center shrink-0">
                                    {opt.name.charAt(0)}
                                  </div>
                                )}
                                <div className="truncate">
                                  <div className="truncate font-medium">{opt.name}</div>
                                  <div className="text-[10px] text-slate-500 font-mono">{opt.id}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                <span className="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-slate-400 font-mono uppercase">
                                  {opt.provider}
                                </span>
                                {opt.recommended && (
                                  <span className="text-[9px] px-1 py-0.2 bg-emerald-500/20 text-emerald-400 rounded font-semibold">
                                    Top
                                  </span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>

              {/* Enhance Prompt */}
              <button
                type="button"
                onClick={handleEnhancePrompt}
                title="Enhance prompt with design and code specs"
                className="p-1 rounded text-slate-400 hover:text-purple-300 hover:bg-[#1d2238] transition-colors"
              >
                <Wand2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-500 hidden sm:inline">↵ Send</span>
              <button
                type="submit"
                disabled={!input.trim() || isStreaming}
                className="p-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 disabled:hover:from-purple-600 text-white transition-all shadow-md shadow-purple-600/30"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
