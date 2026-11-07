import test from 'node:test';
import assert from 'node:assert/strict';
import { getProviderLogo, getModelLogo, ALL_PROVIDERS, ALL_MODELS } from './models';

test('getProviderLogo returns real logos for all 6 requested brand assets', () => {
  assert.equal(getProviderLogo('deepseek'), '/assets/aistudio/DeepSeek-Logo_043ca2ea.jpg');
  assert.equal(getProviderLogo('nvidia'), '/assets/aistudio/nvidia_ca832076.jpg');
  assert.equal(getProviderLogo('anthropic'), '/assets/aistudio/OIP__1__6c880ef0.webp');
  assert.equal(getProviderLogo('gemini'), '/assets/aistudio/OIP__3__34a26736.webp');
  assert.equal(getProviderLogo('meta'), '/assets/aistudio/OIP_06acdd3c.jpg');
  assert.equal(getProviderLogo('moonshot'), '/assets/aistudio/OIP__2__e85718d2.webp');
});

test('getModelLogo resolves model-specific or provider logo', () => {
  assert.equal(getModelLogo('deepseek-chat'), '/assets/aistudio/DeepSeek-Logo_043ca2ea.jpg');
  assert.equal(getModelLogo('nvidia/llama-3.1-nemotron-70b'), '/assets/aistudio/nvidia_ca832076.jpg');
  assert.equal(getModelLogo('claude-3-7-sonnet'), '/assets/aistudio/OIP__1__6c880ef0.webp');
  assert.equal(getModelLogo('gemini-3.8-flash'), '/assets/aistudio/OIP__3__34a26736.webp');
  assert.equal(getModelLogo('meta/llama-3.3-70b'), '/assets/aistudio/OIP_06acdd3c.jpg');
  assert.equal(getModelLogo('moonshot-v1-128k'), '/assets/aistudio/OIP__2__e85718d2.webp');
});

test('ALL_PROVIDERS includes NVIDIA and Meta', () => {
  const nvidia = ALL_PROVIDERS.find((p) => p.id === 'nvidia');
  const meta = ALL_PROVIDERS.find((p) => p.id === 'meta');
  assert.ok(nvidia, 'NVIDIA provider must exist');
  assert.ok(meta, 'Meta provider must exist');
  assert.equal(nvidia?.name, 'NVIDIA');
  assert.equal(meta?.name, 'Meta');
});

test('ALL_MODELS includes Nemotron and Llama 3.3 models', () => {
  const nemotron = ALL_MODELS.find((m) => m.id === 'nvidia/llama-3.1-nemotron-70b');
  const llama33 = ALL_MODELS.find((m) => m.id === 'meta/llama-3.3-70b');
  assert.ok(nemotron, 'Nemotron 70B must be present in ALL_MODELS');
  assert.ok(llama33, 'Llama 3.3 70B must be present in ALL_MODELS');
});
