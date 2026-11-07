import React, { useState, useEffect } from 'react';
import { 
  User, 
  Users,
  Briefcase, 
  Key, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Cpu, 
  Info,
  Server,
  Lock,
  ChevronRight,
  ExternalLink,
  AlertTriangle
} from 'lucide-react';
import { UserProfile } from '../types';
import { recommendModelForUser } from '../utils/recommendationEngine';
import { ALL_MODELS, ALL_PROVIDERS } from '../data/models';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onComplete: (profile: UserProfile) => void;
  initialProfile?: UserProfile | null;
  pendingPrompt?: string;
  isMandatory?: boolean;
}

const ROLES = [
  { id: 'Full-Stack Software Engineer', label: 'Full-Stack Software Engineer', desc: 'React, Node.js, databases, end-to-end architectures' },
  { id: 'Frontend Developer', label: 'Frontend Developer', desc: 'UI/UX precision, animations, modern CSS & responsive layouts' },
  { id: 'Founder / Solopreneur', label: 'Founder & Solopreneur', desc: 'Rapid MVPs, SaaS products, fast validation' },
  { id: 'Product Designer', label: 'Product Designer / UI-UX', desc: 'Design systems, interactive mockups, high-converting pages' },
  { id: 'AI Researcher & Engineer', label: 'AI Researcher & Engineer', desc: 'STEM logic, complex prompt workflows, algorithms' },
  { id: 'Student & Learner', label: 'Student / Learning to Code', desc: 'Step-by-step guidance, readable explanations' },
];

const GOALS = [
  { id: 'SaaS Dashboards & Business Tools', label: 'SaaS Dashboards & Internal Business Tools' },
  { id: 'Full-Stack Web Applications', label: 'Full-Stack Web Applications (React + APIs)' },
  { id: 'High-Converting Landing Pages', label: 'High-Converting Landing Pages & Portfolios' },
  { id: 'Complex STEM / Algorithm Logic', label: 'Complex STEM / Logic & Data Workflows' },
  { id: 'AI Automation & Agents', label: 'Autonomous AI Agents & Tooling' },
  { id: 'Mobile Progressive Web Apps (PWA)', label: 'Mobile Responsive & Progressive Web Apps' },
  { id: 'Private & Local LLM Development', label: 'Private & Local LLM Prototyping (Ollama / LM Studio)' },
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  initialProfile,
  pendingPrompt,
  isMandatory = true,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Profile fields: Name, Team, Role, Goal
  const [name, setName] = useState(initialProfile?.name || '');
  const [teamName, setTeamName] = useState(initialProfile?.teamName || '');
  const [email, setEmail] = useState(initialProfile?.email || '');
  const [role, setRole] = useState(initialProfile?.role || 'Full-Stack Software Engineer');
  const [goal, setGoal] = useState(initialProfile?.goal || 'Full-Stack Web Applications');

  // Terms and conditions acceptance
  const [agreedToTerms, setAgreedToTerms] = useState(initialProfile?.agreedToTerms ?? false);

  // Mandatory API Provider & Key selection (No Guest Bypass)
  const [selectedProvider, setSelectedProvider] = useState(initialProfile?.apiKeyProvider || 'openai');
  const [apiKey, setApiKey] = useState(initialProfile?.apiKey || '');
  const [localEndpoint, setLocalEndpoint] = useState(
    initialProfile?.ollamaEndpoint || 'http://127.0.0.1:11434'
  );

  // Recommendation engine state
  const recommendation = recommendModelForUser(role, goal);
  const [chosenModel, setChosenModel] = useState(
    initialProfile?.selectedModel || recommendation.recommendedModelId
  );

  // Sync recommendation when role or goal changes
  useEffect(() => {
    if (!initialProfile) {
      setChosenModel(recommendation.recommendedModelId);
    }
  }, [role, goal]);

  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const currentProviderMeta = ALL_PROVIDERS.find((p) => p.id === selectedProvider) || ALL_PROVIDERS[0];

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Full Name is required. You cannot proceed without providing your name.');
      return;
    }
    if (!teamName.trim()) {
      setErrorMsg('Team or Organization Name is required. Please enter your team name.');
      return;
    }
    setErrorMsg('');
    setStep(2);
  };

  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      setErrorMsg('You must accept the Athokpam Labs Terms of Service & Safety Agreement to access the platform. Access cannot be granted without acceptance.');
      return;
    }
    setErrorMsg('');
    setStep(3);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Strict validation: Terms mandatory
    if (!agreedToTerms) {
      setErrorMsg('Access denied: You must accept the Athokpam Terms & Conditions.');
      return;
    }

    // Strict validation: API Key mandatory (No Guest access)
    const effectiveKey = currentProviderMeta.isLocal ? localEndpoint.trim() : apiKey.trim();
    if (!effectiveKey) {
      setErrorMsg(
        `API Key / Endpoint is strictly required for ${currentProviderMeta.name}. Guest access is disabled.`
      );
      return;
    }

    const profile: UserProfile = {
      name: name.trim(),
      teamName: teamName.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@${teamName.toLowerCase().replace(/\s+/g, '')}.com`,
      role,
      goal,
      agreedToTerms: true,
      apiKeyProvider: selectedProvider,
      apiKey: currentProviderMeta.isLocal ? '' : effectiveKey,
      ollamaEndpoint: currentProviderMeta.isLocal ? effectiveKey : undefined,
      recommendedModel: recommendation.recommendedModelId,
      selectedModel: chosenModel || recommendation.recommendedModelId,
      createdAt: initialProfile?.createdAt || new Date().toISOString(),
    };

    onComplete(profile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-[#121526] border border-[#232a49] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="px-6 py-5 border-b border-[#212744] bg-[#161a2e] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white font-black text-sm shadow-md shadow-purple-500/25">
              AL
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">Athokpam Labs</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Developer Verification
                </span>
              </div>
              <p className="text-xs text-slate-400">Mandatory setup: Profile, Organization, Terms, and AI Model Keys</p>
            </div>
          </div>
          {!isMandatory && onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#202640] transition-colors"
            >
              ✕
            </button>
          )}
        </div>

        {/* Stepper Progress Bar */}
        <div className="bg-[#0e1120] px-6 py-3 border-b border-[#212744] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step >= 1 ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              1
            </span>
            <span className={step === 1 ? 'text-white font-medium' : 'text-slate-400'}>
              Identity & Team
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />

            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step >= 2 ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              2
            </span>
            <span className={step === 2 ? 'text-white font-medium' : 'text-slate-400'}>
              Terms (Mandatory)
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />

            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step >= 3 ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              3
            </span>
            <span className={step === 3 ? 'text-white font-medium' : 'text-slate-400'}>
              API Key (Required)
            </span>
          </div>

          <span className="text-[11px] text-purple-400 font-mono">Step {step} of 3</span>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-slate-200">
          {errorMsg && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: Name, Team Name, Professional Role & Goal */}
          {step === 1 && (
            <form onSubmit={handleNextStep1} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Your Full Name <span className="text-purple-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Athokpam Bijen"
                    className="w-full bg-[#161a2e] border border-[#272f4e] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Team or Organization Name <span className="text-purple-400">*</span>
                </label>
                <div className="relative">
                  <Users className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="e.g. Athokpam AI Core / Engineering"
                    className="w-full bg-[#161a2e] border border-[#272f4e] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Work Email <span className="text-slate-500 text-[10px] font-normal">(Optional for cloud sync)</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-[#161a2e] border border-[#272f4e] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  What is your professional role? <span className="text-purple-400">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {ROLES.map((r) => {
                    const isSelected = role === r.id;
                    return (
                      <div
                        key={r.id}
                        onClick={() => setRole(r.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all text-left ${
                          isSelected
                            ? 'bg-purple-900/30 border-purple-500 text-white shadow-sm shadow-purple-950'
                            : 'bg-[#15192c] border-[#222845] hover:border-slate-600 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-xs">{r.label}</span>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />}
                        </div>
                        <p className="text-[10px] text-slate-400 line-clamp-1">{r.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  What do you like to build? <span className="text-purple-400">*</span>
                </label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full bg-[#161a2e] border border-[#272f4e] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
                >
                  {GOALS.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.label}
                    </option>
                  ))}
                </select>
              </div>

              {pendingPrompt && (
                <div className="p-3 bg-purple-950/20 border border-purple-800/40 rounded-xl text-xs text-purple-300">
                  <span className="font-semibold text-white">Your initial prompt:</span> "{pendingPrompt}"
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-purple-600/30 flex items-center gap-2 cursor-pointer"
                >
                  <span>Continue to Terms & Conditions</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Strict Terms & Conditions Agreement */}
          {step === 2 && (
            <form onSubmit={handleNextStep2} className="space-y-4">
              <div className="flex items-center gap-2.5 text-white">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm">Athokpam Labs Terms of Service & Safety</h3>
              </div>

              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-[11px] text-amber-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                <span>
                  <strong>Notice:</strong> Acceptance of the Athokpam Labs terms and developer agreement is strictly mandatory. If you do not accept, login will remain permanently blocked.
                </span>
              </div>

              {/* Scrollable Terms Box */}
              <div className="p-4 bg-[#0d101e] border border-[#202640] rounded-xl text-[11px] text-slate-300 leading-relaxed max-h-56 overflow-y-auto space-y-3">
                <p>
                  <strong>1. Mandatory Acceptance of Terms:</strong> By registering with Athokpam Labs, you agree to comply with our Terms of Service, Acceptable AI Use Policy, and Developer Agreement.
                </p>
                <p>
                  <strong>2. AI Code Generation & In-Browser Sandbox:</strong> Athokpam Labs provides generative artificial intelligence tools (supporting 30+ LLMs across OpenAI, Anthropic, Google Gemini, DeepSeek, xAI, Mistral, and local Ollama) that synthesize client code, Node.js scripts, and React configurations directly in an in-browser sandbox container.
                </p>
                <p>
                  <strong>3. 100% Intellectual Property Ownership:</strong> All project code, architectures, and intellectual assets you generate within Athokpam Labs belong 100% to you and your organization ({teamName || 'Your Team'}). Athokpam Labs claims zero ownership or licensing rights over your exported applications.
                </p>
                <p>
                  <strong>4. Security & BYOK API Keys:</strong> API keys entered for custom providers (OpenAI, Anthropic, Gemini, DeepSeek, Groq, etc.) are stored solely in your browser's private local environment (`localStorage`) and sent directly to the model inference endpoints. Keys are never logged or stored on third-party servers.
                </p>
                <p>
                  <strong>5. Prohibited Uses:</strong> Users must not generate malicious software, exploit scripts, unauthorized penetration tests, or deceptive malware.
                </p>
              </div>

              {/* Agreement Checkbox */}
              <label className="flex items-start gap-3 p-3.5 bg-[#15192c] border border-[#252c4b] rounded-xl cursor-pointer hover:border-purple-500/50 transition-colors">
                <input
                  type="checkbox"
                  required
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-purple-600 focus:ring-purple-500 bg-[#0e1120] border-slate-600 cursor-pointer"
                />
                <div className="text-xs">
                  <span className="font-semibold text-white">
                    I agree to the Athokpam Labs Terms of Service and Privacy Policy <span className="text-purple-400">*</span>
                  </span>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    I acknowledge that I retain 100% ownership of my code and agree to responsible AI software development.
                  </p>
                </div>
              </label>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  ← Back to Identity
                </button>
                <button
                  type="submit"
                  disabled={!agreedToTerms}
                  className={`px-5 py-2.5 font-semibold text-xs rounded-xl flex items-center gap-2 transition-all ${
                    agreedToTerms
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30 cursor-pointer'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <span>Accept & Proceed to API Key</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Mandatory API Key & 30+ Model Match (No Guest Mode) */}
          {step === 3 && (
            <form onSubmit={handleFinalSubmit} className="space-y-4">
              {/* Dynamic Recommendation Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-purple-950/40 border border-purple-500/40 shadow-inner">
                <div className="flex items-center gap-2 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-1">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>Athokpam AI Match for {name} ({teamName})</span>
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <h4 className="text-base font-bold text-white">{recommendation.recommendedModelName}</h4>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-semibold">
                    {recommendation.confidenceScore}% Match
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {recommendation.reasoning}
                </p>
              </div>

              {/* Provider Selection (24 Providers with Real Logos) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Select Your AI Provider <span className="text-purple-400">*</span>
                  </label>
                  <span className="text-[10px] text-purple-400 font-mono">No Guest Access</span>
                </div>
                <div className="flex items-center gap-2.5">
                  {currentProviderMeta.logo ? (
                    <div className="w-10 h-10 rounded-xl bg-white border border-purple-500/40 p-1 shadow-md shrink-0 flex items-center justify-center overflow-hidden">
                      <img
                        src={currentProviderMeta.logo}
                        alt={currentProviderMeta.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-[#1e2440] border border-[#2e375c] text-purple-300 font-bold text-xs flex items-center justify-center shrink-0">
                      {currentProviderMeta.name.charAt(0)}
                    </div>
                  )}
                  <select
                    value={selectedProvider}
                    onChange={(e) => {
                      setSelectedProvider(e.target.value);
                      const matchingModel = ALL_MODELS.find((m) => m.provider === e.target.value);
                      if (matchingModel) {
                        setChosenModel(matchingModel.id);
                      }
                    }}
                    className="flex-1 bg-[#161a2e] border border-[#272f4e] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    {ALL_PROVIDERS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.modelFamily}) {p.isLocal ? '— Local / Private' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Mandatory API Key / Endpoint Input */}
              <div className="p-4 bg-[#15192c] border border-[#252c4b] rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    {currentProviderMeta.logo ? (
                      <img
                        src={currentProviderMeta.logo}
                        alt=""
                        className="w-4 h-4 rounded-xs object-contain bg-white/90 p-0.5"
                      />
                    ) : (
                      <Key className="w-3.5 h-3.5 text-purple-400" />
                    )}
                    <span>
                      {currentProviderMeta.isLocal ? 'Local Provider Endpoint URL' : `${currentProviderMeta.name} API Key`} <span className="text-purple-400">*</span>
                    </span>
                  </label>
                  <a
                    href={currentProviderMeta.docsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-purple-400 hover:text-purple-300 flex items-center gap-1"
                  >
                    <span>Get Key</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>

                {currentProviderMeta.isLocal ? (
                  <div>
                    <input
                      type="text"
                      required
                      value={localEndpoint}
                      onChange={(e) => setLocalEndpoint(e.target.value)}
                      placeholder={currentProviderMeta.keyPlaceholder}
                      className="w-full bg-[#0d0f1a] border border-[#252c4b] rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      Local server address (e.g. <code>http://127.0.0.1:11434</code> for Ollama or <code>http://localhost:1234/v1</code> for LM Studio).
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="password"
                        required
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder={`e.g. ${currentProviderMeta.keyPlaceholder}`}
                        className="w-full bg-[#0d0f1a] border border-[#252c4b] rounded-lg pl-9 pr-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      An API key is strictly required to verify developer access. Keys remain securely on your client.
                    </p>
                  </div>
                )}
              </div>

              {/* Model Picker from 30+ */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Target AI Model (30+ Models Available)
                  </label>
                  <span className="text-[10px] text-purple-400 font-mono">
                    {ALL_MODELS.length} Models Loaded
                  </span>
                </div>
                <select
                  value={chosenModel}
                  onChange={(e) => setChosenModel(e.target.value)}
                  className="w-full bg-[#161a2e] border border-[#272f4e] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
                >
                  {ALL_MODELS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.providerName}) — {m.modelFamily} {m.recommended ? '★ Recommended' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  ← Back to Terms
                </button>
                <button
                  type="submit"
                  disabled={
                    !agreedToTerms ||
                    (currentProviderMeta.isLocal ? !localEndpoint.trim() : !apiKey.trim())
                  }
                  className={`px-6 py-2.5 font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 transform active:scale-98 transition-all ${
                    !agreedToTerms || (currentProviderMeta.isLocal ? !localEndpoint.trim() : !apiKey.trim())
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-none'
                      : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white shadow-purple-600/30 cursor-pointer'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Authenticate & Launch Athokpam Labs</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
