/**
 * Recommendation Engine for Athokpam Labs
 * Suggests the optimal AI model among 30+ choices based on the user's role and build goal.
 */

export interface RoleRecommendation {
  recommendedModelId: string;
  recommendedModelName: string;
  provider: string;
  confidenceScore: number;
  reasoning: string;
  suggestedStarterTemplateId: string;
}

export function recommendModelForUser(role: string, goal: string): RoleRecommendation {
  const normalizedRole = (role || '').toLowerCase();
  const normalizedGoal = (goal || '').toLowerCase();

  // Reasoning / Complex STEM / Logic
  if (
    normalizedRole.includes('research') ||
    normalizedRole.includes('data') ||
    normalizedGoal.includes('logic') ||
    normalizedGoal.includes('stem') ||
    normalizedGoal.includes('algorithm')
  ) {
    return {
      recommendedModelId: 'deepseek-reasoner',
      recommendedModelName: 'DeepSeek R1 (Thinking)',
      provider: 'deepseek',
      confidenceScore: 98,
      reasoning: 'Exceptional deep chain-of-thought mathematical and algorithmic synthesis for complex logic.',
      suggestedStarterTemplateId: 'saas-analytics',
    };
  }

  // Full-Stack Engineer / Complex Architecture
  if (
    normalizedRole.includes('full-stack') ||
    normalizedRole.includes('lead') ||
    normalizedRole.includes('architect') ||
    normalizedGoal.includes('full-stack') ||
    normalizedGoal.includes('backend')
  ) {
    return {
      recommendedModelId: 'claude-3-7-sonnet',
      recommendedModelName: 'Claude 3.7 Sonnet',
      provider: 'anthropic',
      confidenceScore: 99,
      reasoning: 'State-of-the-art hybrid reasoning with unmatched full-stack architectural coherence.',
      suggestedStarterTemplateId: 'saas-analytics',
    };
  }

  // Designer / Frontend / UI-UX
  if (
    normalizedRole.includes('design') ||
    normalizedRole.includes('frontend') ||
    normalizedGoal.includes('landing') ||
    normalizedGoal.includes('portfolio') ||
    normalizedGoal.includes('ui')
  ) {
    return {
      recommendedModelId: 'gemini-3.8-flash',
      recommendedModelName: 'Gemini 3.8 Flash',
      provider: 'gemini',
      confidenceScore: 97,
      reasoning: 'Blazing-fast multimodal generation, responsive Tailwind CSS layouts, and modern typography.',
      suggestedStarterTemplateId: 'portfolio',
    };
  }

  // Founder / Solopreneur / Fast Prototyping
  if (
    normalizedRole.includes('founder') ||
    normalizedRole.includes('solopreneur') ||
    normalizedRole.includes('product') ||
    normalizedGoal.includes('saas') ||
    normalizedGoal.includes('mvp')
  ) {
    return {
      recommendedModelId: 'gpt-4o',
      recommendedModelName: 'OpenAI GPT-4o',
      provider: 'openai',
      confidenceScore: 96,
      reasoning: 'Flagship versatile intelligence for swift SaaS MVPs, copy generation, and data flows.',
      suggestedStarterTemplateId: 'saas-analytics',
    };
  }

  // Local / Privacy enthusiast
  if (
    normalizedRole.includes('privacy') ||
    normalizedGoal.includes('local') ||
    normalizedGoal.includes('offline')
  ) {
    return {
      recommendedModelId: 'llama3:latest',
      recommendedModelName: 'Llama 3 (Ollama Local)',
      provider: 'ollama',
      confidenceScore: 94,
      reasoning: 'Zero external network latency and 100% private local execution on your machine.',
      suggestedStarterTemplateId: 'saas-analytics',
    };
  }

  // Default balanced frontier recommendation
  return {
    recommendedModelId: 'gemini-3.8-flash',
    recommendedModelName: 'Gemini 3.8 Flash',
    provider: 'gemini',
    confidenceScore: 95,
    reasoning: 'Top-tier speed, native server-side integration with no setup required, and robust React 18 generation.',
    suggestedStarterTemplateId: 'saas-analytics',
  };
}
