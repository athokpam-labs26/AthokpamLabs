/**
 * Supported Providers & Model Families for Athokpam Labs
 * Implements frontier AI providers with real brand logos:
 * DeepSeek, NVIDIA, Anthropic Claude, Google Gemini, Meta Llama, Moonshot Kimi,
 * OpenAI, OpenRouter, Ollama, LM Studio, Mistral AI, xAI, Groq, Hugging Face,
 * Cohere, Together AI, Perplexity, Hyperbolic, Amazon Bedrock, GitHub Models,
 * Cerebras, Fireworks AI, Z-AI, and OpenAI-compatible.
 */

export interface AIProviderMeta {
  id: string;
  name: string;
  modelFamily: string;
  keyPlaceholder: string;
  docsUrl: string;
  logo?: string;
  isLocal?: boolean;
}

export const ALL_PROVIDERS: AIProviderMeta[] = [
  { 
    id: 'deepseek', 
    name: 'DeepSeek', 
    modelFamily: 'DeepSeek', 
    keyPlaceholder: 'sk-...', 
    docsUrl: 'https://platform.deepseek.com/api_keys',
    logo: '/assets/aistudio/DeepSeek-Logo_043ca2ea.jpg'
  },
  { 
    id: 'nvidia', 
    name: 'NVIDIA', 
    modelFamily: 'Nemotron / NIM', 
    keyPlaceholder: 'nvapi-...', 
    docsUrl: 'https://build.nvidia.com',
    logo: '/assets/aistudio/nvidia_ca832076.jpg'
  },
  { 
    id: 'anthropic', 
    name: 'Anthropic', 
    modelFamily: 'Claude', 
    keyPlaceholder: 'sk-ant-api03-...', 
    docsUrl: 'https://console.anthropic.com/settings/keys',
    logo: '/assets/aistudio/OIP__1__6c880ef0.webp'
  },
  { 
    id: 'gemini', 
    name: 'Google', 
    modelFamily: 'Gemini', 
    keyPlaceholder: 'AIzaSy...', 
    docsUrl: 'https://aistudio.google.com/apikey',
    logo: '/assets/aistudio/OIP__3__34a26736.webp'
  },
  { 
    id: 'meta', 
    name: 'Meta', 
    modelFamily: 'Llama', 
    keyPlaceholder: 'LLAMA_KEY / Hosted Token', 
    docsUrl: 'https://llama.meta.com',
    logo: '/assets/aistudio/OIP_06acdd3c.jpg'
  },
  { 
    id: 'moonshot', 
    name: 'Moonshot AI', 
    modelFamily: 'Kimi', 
    keyPlaceholder: 'sk-...', 
    docsUrl: 'https://platform.moonshot.cn/console/api-keys',
    logo: '/assets/aistudio/OIP__2__e85718d2.webp'
  },
  { 
    id: 'openai', 
    name: 'OpenAI', 
    modelFamily: 'GPT', 
    keyPlaceholder: 'sk-proj-...', 
    docsUrl: 'https://platform.openai.com/api-keys' 
  },
  { 
    id: 'openrouter', 
    name: 'OpenRouter', 
    modelFamily: 'Multiple model families', 
    keyPlaceholder: 'sk-or-v1-...', 
    docsUrl: 'https://openrouter.ai/keys' 
  },
  { 
    id: 'ollama', 
    name: 'Ollama', 
    modelFamily: 'Qwen, Llama, DeepSeek, etc.', 
    keyPlaceholder: 'http://127.0.0.1:11434', 
    docsUrl: 'https://ollama.com', 
    isLocal: true 
  },
  { 
    id: 'lmstudio', 
    name: 'LM Studio', 
    modelFamily: 'Local models', 
    keyPlaceholder: 'http://localhost:1234/v1', 
    docsUrl: 'https://lmstudio.ai', 
    isLocal: true 
  },
  { 
    id: 'mistral', 
    name: 'Mistral AI', 
    modelFamily: 'Mistral', 
    keyPlaceholder: 'api-key...', 
    docsUrl: 'https://console.mistral.ai/api-keys' 
  },
  { 
    id: 'xai', 
    name: 'xAI', 
    modelFamily: 'Grok', 
    keyPlaceholder: 'xai-...', 
    docsUrl: 'https://console.x.ai' 
  },
  { 
    id: 'groq', 
    name: 'Groq', 
    modelFamily: 'Llama and other hosted models', 
    keyPlaceholder: 'gsk_...', 
    docsUrl: 'https://console.groq.com/keys' 
  },
  { 
    id: 'huggingface', 
    name: 'Hugging Face', 
    modelFamily: 'Open models', 
    keyPlaceholder: 'hf_...', 
    docsUrl: 'https://huggingface.co/settings/tokens' 
  },
  { 
    id: 'cohere', 
    name: 'Cohere', 
    modelFamily: 'Command', 
    keyPlaceholder: 'co-...', 
    docsUrl: 'https://dashboard.cohere.com/api-keys' 
  },
  { 
    id: 'together', 
    name: 'Together AI', 
    modelFamily: 'Open models', 
    keyPlaceholder: 'together-...', 
    docsUrl: 'https://api.together.ai/settings/api-keys' 
  },
  { 
    id: 'perplexity', 
    name: 'Perplexity', 
    modelFamily: 'Sonar', 
    keyPlaceholder: 'pplx-...', 
    docsUrl: 'https://www.perplexity.ai/settings/api' 
  },
  { 
    id: 'hyperbolic', 
    name: 'Hyperbolic', 
    modelFamily: 'Open models', 
    keyPlaceholder: 'hyp_...', 
    docsUrl: 'https://app.hyperbolic.xyz' 
  },
  { 
    id: 'bedrock', 
    name: 'Amazon Bedrock', 
    modelFamily: 'AWS-hosted models', 
    keyPlaceholder: 'AWS_ACCESS_KEY_ID:SECRET', 
    docsUrl: 'https://aws.amazon.com/bedrock' 
  },
  { 
    id: 'github_models', 
    name: 'GitHub Models', 
    modelFamily: 'Hosted AI models', 
    keyPlaceholder: 'ghp_... (GitHub Token)', 
    docsUrl: 'https://github.com/marketplace/models' 
  },
  { 
    id: 'cerebras', 
    name: 'Cerebras', 
    modelFamily: 'Hosted models', 
    keyPlaceholder: 'csk-...', 
    docsUrl: 'https://cloud.cerebras.ai' 
  },
  { 
    id: 'fireworks', 
    name: 'Fireworks AI', 
    modelFamily: 'Hosted models', 
    keyPlaceholder: 'fw-...', 
    docsUrl: 'https://fireworks.ai/api-keys' 
  },
  { 
    id: 'zai', 
    name: 'Z-AI', 
    modelFamily: 'GLM', 
    keyPlaceholder: 'zhipu-...', 
    docsUrl: 'https://open.bigmodel.cn' 
  },
  { 
    id: 'custom', 
    name: 'OpenAI-compatible', 
    modelFamily: 'Custom API models', 
    keyPlaceholder: 'https://api.custom.com/v1', 
    docsUrl: '#' 
  },
];

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  providerName: string;
  modelFamily: string;
  contextWindow: string;
  description: string;
  tag: 'Reasoning' | 'Coding' | 'Multimodal' | 'Ultra-Fast' | 'Local';
  recommended?: boolean;
  logo?: string;
}

export const ALL_MODELS: AIModel[] = [
  // 1. DeepSeek (with real logo)
  {
    id: 'deepseek-chat',
    name: 'DeepSeek V3 (671B MoE)',
    provider: 'deepseek',
    providerName: 'DeepSeek',
    modelFamily: 'DeepSeek',
    contextWindow: '64K tokens',
    description: 'Leading 671B Mixture-of-Experts frontier coding benchmark model.',
    tag: 'Coding',
    recommended: true,
    logo: '/assets/aistudio/DeepSeek-Logo_043ca2ea.jpg',
  },
  {
    id: 'deepseek-reasoner',
    name: 'DeepSeek R1 (Thinking)',
    provider: 'deepseek',
    providerName: 'DeepSeek',
    modelFamily: 'DeepSeek',
    contextWindow: '64K tokens',
    description: 'Open reasoning model delivering deep mathematical and algorithmic logic.',
    tag: 'Reasoning',
    recommended: true,
    logo: '/assets/aistudio/DeepSeek-Logo_043ca2ea.jpg',
  },

  // 2. NVIDIA (with real logo)
  {
    id: 'nvidia/llama-3.1-nemotron-70b',
    name: 'Llama 3.1 Nemotron 70B (NVIDIA NIM)',
    provider: 'nvidia',
    providerName: 'NVIDIA',
    modelFamily: 'Nemotron / NIM',
    contextWindow: '128K tokens',
    description: 'NVIDIA customized model optimized for high accuracy and software synthesis.',
    tag: 'Reasoning',
    recommended: true,
    logo: '/assets/aistudio/nvidia_ca832076.jpg',
  },
  {
    id: 'nvidia/nemotron-4-340b',
    name: 'Nemotron-4 340B Instruct (NVIDIA)',
    provider: 'nvidia',
    providerName: 'NVIDIA',
    modelFamily: 'Nemotron / NIM',
    contextWindow: '128K tokens',
    description: 'NVIDIA flagship frontier generative model for complex architectures.',
    tag: 'Coding',
    logo: '/assets/aistudio/nvidia_ca832076.jpg',
  },

  // 3. Anthropic - Claude (with real logo)
  {
    id: 'claude-3-7-sonnet',
    name: 'Claude 3.7 Sonnet',
    provider: 'anthropic',
    providerName: 'Anthropic',
    modelFamily: 'Claude',
    contextWindow: '200K tokens',
    description: 'Frontier hybrid reasoning with unmatched full-stack architectural precision.',
    tag: 'Coding',
    recommended: true,
    logo: '/assets/aistudio/OIP__1__6c880ef0.webp',
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'anthropic',
    providerName: 'Anthropic',
    modelFamily: 'Claude',
    contextWindow: '200K tokens',
    description: 'Standard-setting coding and frontend component design specialist.',
    tag: 'Coding',
    logo: '/assets/aistudio/OIP__1__6c880ef0.webp',
  },
  {
    id: 'claude-3-5-haiku',
    name: 'Claude 3.5 Haiku',
    provider: 'anthropic',
    providerName: 'Anthropic',
    modelFamily: 'Claude',
    contextWindow: '200K tokens',
    description: 'Ultra-fast agile code editor for sub-second hot-reloads.',
    tag: 'Ultra-Fast',
    logo: '/assets/aistudio/OIP__1__6c880ef0.webp',
  },

  // 4. Google - Gemini (with real logo)
  {
    id: 'gemini-3.8-flash',
    name: 'Gemini 3.8 Flash',
    provider: 'gemini',
    providerName: 'Google',
    modelFamily: 'Gemini',
    contextWindow: '1M tokens',
    description: 'High-speed multimodal generation with server-side @google/genai.',
    tag: 'Ultra-Fast',
    recommended: true,
    logo: '/assets/aistudio/OIP__3__34a26736.webp',
  },
  {
    id: 'gemini-4-argon',
    name: 'Gemini 4 Argon',
    provider: 'gemini',
    providerName: 'Google',
    modelFamily: 'Gemini',
    contextWindow: '1M tokens',
    description: 'Advanced STEM reasoning and deep architectural synthesis.',
    tag: 'Reasoning',
    logo: '/assets/aistudio/OIP__3__34a26736.webp',
  },
  {
    id: 'gemini-3.1-flash-lite',
    name: 'Gemini 3.1 Flash Lite',
    provider: 'gemini',
    providerName: 'Google',
    modelFamily: 'Gemini',
    contextWindow: '1M tokens',
    description: 'Ultra low-latency lightweight engine for instant iterations.',
    tag: 'Ultra-Fast',
    logo: '/assets/aistudio/OIP__3__34a26736.webp',
  },

  // 5. Meta - Llama (with real logo)
  {
    id: 'meta/llama-3.3-70b',
    name: 'Llama 3.3 70B Instruct (Meta)',
    provider: 'meta',
    providerName: 'Meta',
    modelFamily: 'Llama',
    contextWindow: '128K tokens',
    description: 'Meta flagship open-weights coding model with frontier benchmark scores.',
    tag: 'Coding',
    recommended: true,
    logo: '/assets/aistudio/OIP_06acdd3c.jpg',
  },
  {
    id: 'meta/llama-3.2-90b-vision',
    name: 'Llama 3.2 90B Vision (Meta)',
    provider: 'meta',
    providerName: 'Meta',
    modelFamily: 'Llama',
    contextWindow: '128K tokens',
    description: 'Multimodal vision understanding for UI screenshots and interactive diagrams.',
    tag: 'Multimodal',
    logo: '/assets/aistudio/OIP_06acdd3c.jpg',
  },

  // 6. Moonshot AI - Kimi (with real logo)
  {
    id: 'moonshot-v1-128k',
    name: 'Kimi (Moonshot v1 128K)',
    provider: 'moonshot',
    providerName: 'Moonshot AI',
    modelFamily: 'Kimi',
    contextWindow: '128K tokens',
    description: 'Extensive context processing for entire codebases and monorepos.',
    tag: 'Coding',
    recommended: true,
    logo: '/assets/aistudio/OIP__2__e85718d2.webp',
  },

  // 7. OpenAI - GPT
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'openai',
    providerName: 'OpenAI',
    modelFamily: 'GPT',
    contextWindow: '128K tokens',
    description: 'Flagship versatile intelligence for full-stack apps and design systems.',
    tag: 'Multimodal',
    recommended: true,
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'openai',
    providerName: 'OpenAI',
    modelFamily: 'GPT',
    contextWindow: '128K tokens',
    description: 'Affordable, rapid prototyping engine.',
    tag: 'Ultra-Fast',
  },
  {
    id: 'o1',
    name: 'OpenAI o1',
    provider: 'openai',
    providerName: 'OpenAI',
    modelFamily: 'GPT',
    contextWindow: '200K tokens',
    description: 'Chain-of-thought model engineered for hard software engineering problems.',
    tag: 'Reasoning',
  },
  {
    id: 'o3-mini',
    name: 'OpenAI o3-mini',
    provider: 'openai',
    providerName: 'OpenAI',
    modelFamily: 'GPT',
    contextWindow: '200K tokens',
    description: 'High-speed reasoning model specialized in STEM and coding.',
    tag: 'Reasoning',
  },

  // 8. xAI - Grok
  {
    id: 'grok-2',
    name: 'Grok 2',
    provider: 'xai',
    providerName: 'xAI',
    modelFamily: 'Grok',
    contextWindow: '128K tokens',
    description: 'Frontier model with real-time reasoning and coding power.',
    tag: 'Reasoning',
  },
  {
    id: 'grok-2-mini',
    name: 'Grok 2 Mini',
    provider: 'xai',
    providerName: 'xAI',
    modelFamily: 'Grok',
    contextWindow: '128K tokens',
    description: 'Efficient coding assistant with low response latency.',
    tag: 'Ultra-Fast',
  },

  // 9. Groq - Llama and hosted models
  {
    id: 'groq/llama-3.3-70b',
    name: 'Llama 3.3 70B (Groq LPU)',
    provider: 'groq',
    providerName: 'Groq',
    modelFamily: 'Llama and other hosted models',
    contextWindow: '128K tokens',
    description: 'Ultra high-speed LPU inference delivering over 500 tokens/sec.',
    tag: 'Ultra-Fast',
  },
  {
    id: 'groq/llama-3.1-8b',
    name: 'Llama 3.1 8B Instant (Groq)',
    provider: 'groq',
    providerName: 'Groq',
    modelFamily: 'Llama and other hosted models',
    contextWindow: '128K tokens',
    description: 'Near-instantaneous response times for real-time code typing.',
    tag: 'Ultra-Fast',
  },

  // 10. Mistral AI - Mistral
  {
    id: 'codestral-latest',
    name: 'Codestral 22B',
    provider: 'mistral',
    providerName: 'Mistral AI',
    modelFamily: 'Mistral',
    contextWindow: '32K tokens',
    description: 'Explicitly designed code-completion and synthesis engine.',
    tag: 'Coding',
  },
  {
    id: 'mistral-large-latest',
    name: 'Mistral Large 2 (123B)',
    provider: 'mistral',
    providerName: 'Mistral AI',
    modelFamily: 'Mistral',
    contextWindow: '128K tokens',
    description: 'Flagship reasoning and multi-language software architecture.',
    tag: 'Reasoning',
  },

  // 11. OpenRouter - Multiple model families
  {
    id: 'openrouter/auto',
    name: 'OpenRouter Auto Router',
    provider: 'openrouter',
    providerName: 'OpenRouter',
    modelFamily: 'Multiple model families',
    contextWindow: '128K tokens',
    description: 'Intelligent multi-provider routing across hundreds of open & closed models.',
    tag: 'Coding',
  },

  // 12. Ollama - Qwen, Llama, DeepSeek (Local)
  {
    id: 'llama3:latest',
    name: 'Llama 3 8B (Ollama Local)',
    provider: 'ollama',
    providerName: 'Ollama',
    modelFamily: 'Qwen, Llama, DeepSeek, etc.',
    contextWindow: '8K tokens',
    description: '100% private offline execution running locally on your hardware.',
    tag: 'Local',
  },
  {
    id: 'deepseek-coder:6.7b',
    name: 'DeepSeek Coder 6.7B (Local)',
    provider: 'ollama',
    providerName: 'Ollama',
    modelFamily: 'Qwen, Llama, DeepSeek, etc.',
    contextWindow: '16K tokens',
    description: 'Specialized local code synthesis engine with zero network dependencies.',
    tag: 'Local',
    logo: '/assets/aistudio/DeepSeek-Logo_043ca2ea.jpg',
  },
  {
    id: 'qwen2.5-coder:7b',
    name: 'Qwen 2.5 Coder 7B (Local)',
    provider: 'ollama',
    providerName: 'Ollama',
    modelFamily: 'Qwen, Llama, DeepSeek, etc.',
    contextWindow: '32K tokens',
    description: 'High benchmark local coding model with robust React support.',
    tag: 'Local',
  },

  // 13. LM Studio - Local models
  {
    id: 'lmstudio/local-model',
    name: 'LM Studio Local Server',
    provider: 'lmstudio',
    providerName: 'LM Studio',
    modelFamily: 'Local models',
    contextWindow: '32K tokens',
    description: 'Local OpenAI-compatible inference via LM Studio app.',
    tag: 'Local',
  },

  // 14. Hugging Face - Open models
  {
    id: 'hf/qwen-2.5-coder-32b',
    name: 'Qwen 2.5 Coder 32B (Hugging Face)',
    provider: 'huggingface',
    providerName: 'Hugging Face',
    modelFamily: 'Open models',
    contextWindow: '32K tokens',
    description: 'Top-tier open-source coding engine hosted on Hugging Face Inference.',
    tag: 'Coding',
  },

  // 15. Cohere - Command
  {
    id: 'command-r-plus',
    name: 'Command R+ (104B)',
    provider: 'cohere',
    providerName: 'Cohere',
    modelFamily: 'Command',
    contextWindow: '128K tokens',
    description: 'Enterprise-grade RAG, complex reasoning, and code generation.',
    tag: 'Reasoning',
  },

  // 16. Together AI - Open models
  {
    id: 'together/llama-3.1-405b',
    name: 'Llama 3.1 405B Turbo (Together AI)',
    provider: 'together',
    providerName: 'Together AI',
    modelFamily: 'Open models',
    contextWindow: '128K tokens',
    description: 'Frontier 405B parameter model served at blazing cloud inference speeds.',
    tag: 'Reasoning',
  },

  // 17. Perplexity - Sonar
  {
    id: 'sonar-pro',
    name: 'Sonar Pro (Search-Grounded)',
    provider: 'perplexity',
    providerName: 'Perplexity',
    modelFamily: 'Sonar',
    contextWindow: '128K tokens',
    description: 'Live web-grounded code intelligence with current framework documentation.',
    tag: 'Multimodal',
  },

  // 18. Hyperbolic - Open models
  {
    id: 'hyperbolic/deepseek-r1',
    name: 'DeepSeek R1 (Hyperbolic GPU)',
    provider: 'hyperbolic',
    providerName: 'Hyperbolic',
    modelFamily: 'Open models',
    contextWindow: '64K tokens',
    description: 'Decentralized high-throughput reasoning on dedicated H100 clusters.',
    tag: 'Reasoning',
    logo: '/assets/aistudio/DeepSeek-Logo_043ca2ea.jpg',
  },

  // 19. Amazon Bedrock - AWS-hosted models
  {
    id: 'bedrock/claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet (AWS Bedrock)',
    provider: 'bedrock',
    providerName: 'Amazon Bedrock',
    modelFamily: 'AWS-hosted models',
    contextWindow: '200K tokens',
    description: 'Enterprise AWS cloud-compliant Claude inference with IAM security.',
    tag: 'Coding',
    logo: '/assets/aistudio/OIP__1__6c880ef0.webp',
  },

  // 20. GitHub Models - Hosted AI models
  {
    id: 'github/gpt-4o',
    name: 'GPT-4o (GitHub Models API)',
    provider: 'github_models',
    providerName: 'GitHub Models',
    modelFamily: 'Hosted AI models',
    contextWindow: '128K tokens',
    description: 'Directly authenticated via your GitHub Developer Token.',
    tag: 'Coding',
  },

  // 21. Cerebras - Hosted models
  {
    id: 'cerebras/llama-3.1-70b',
    name: 'Llama 3.1 70B (Cerebras Wafer)',
    provider: 'cerebras',
    providerName: 'Cerebras',
    modelFamily: 'Hosted models',
    contextWindow: '128K tokens',
    description: 'World-record token generation speeds up to 2,000 tokens per second.',
    tag: 'Ultra-Fast',
  },

  // 22. Fireworks AI - Hosted models
  {
    id: 'fireworks/llama-3.3-70b',
    name: 'Llama 3.3 70B (Fireworks AI)',
    provider: 'fireworks',
    providerName: 'Fireworks AI',
    modelFamily: 'Hosted models',
    contextWindow: '128K tokens',
    description: 'Fast, cost-effective compound AI inference for production codebases.',
    tag: 'Ultra-Fast',
  },

  // 23. Z-AI - GLM
  {
    id: 'glm-4-plus',
    name: 'GLM-4 Plus',
    provider: 'zai',
    providerName: 'Z-AI',
    modelFamily: 'GLM',
    contextWindow: '128K tokens',
    description: 'Advanced bilingual full-stack generation from Zhipu AI.',
    tag: 'Reasoning',
  },

  // 24. OpenAI-compatible - Custom API models
  {
    id: 'custom-openai',
    name: 'Custom OpenAI-Compatible API',
    provider: 'custom',
    providerName: 'OpenAI-compatible',
    modelFamily: 'Custom API models',
    contextWindow: 'Custom',
    description: 'Connect any custom v1/chat/completions endpoint, vLLM, or private cluster.',
    tag: 'Local',
  },
];

/**
 * Returns the official logo URL for a provider ID if available
 */
export function getProviderLogo(providerId: string): string | undefined {
  const provider = ALL_PROVIDERS.find((p) => p.id === providerId);
  return provider?.logo;
}

/**
 * Returns the official logo URL for a model ID if available
 */
export function getModelLogo(modelId: string): string | undefined {
  const model = ALL_MODELS.find((m) => m.id === modelId);
  if (model?.logo) return model.logo;
  if (model?.provider) return getProviderLogo(model.provider);
  return undefined;
}
