import test from 'node:test';
import assert from 'node:assert';
import { recommendModelForUser } from './recommendationEngine.ts';

test('recommendModelForUser selects DeepSeek for researchers and complex logic', () => {
  const rec = recommendModelForUser('AI Researcher', 'Complex STEM algorithms & logic');
  assert.strictEqual(rec.recommendedModelId, 'deepseek-reasoner');
  assert.strictEqual(rec.provider, 'deepseek');
  assert.ok(rec.confidenceScore >= 95);
});

test('recommendModelForUser selects Claude 3.7 for full-stack software engineers', () => {
  const rec = recommendModelForUser('Full-Stack Software Engineer', 'Full-stack web applications');
  assert.strictEqual(rec.recommendedModelId, 'claude-3-7-sonnet');
  assert.strictEqual(rec.provider, 'anthropic');
});

test('recommendModelForUser selects Gemini 3.8 Flash for UI/UX designers and landing pages', () => {
  const rec = recommendModelForUser('Product Designer', 'High-converting landing pages');
  assert.strictEqual(rec.recommendedModelId, 'gemini-3.8-flash');
  assert.strictEqual(rec.provider, 'gemini');
});

test('recommendModelForUser selects Ollama for local privacy requirements', () => {
  const rec = recommendModelForUser('Privacy Developer', 'Local offline prototypes');
  assert.strictEqual(rec.recommendedModelId, 'llama3:latest');
  assert.strictEqual(rec.provider, 'ollama');
});

test('recommendModelForUser defaults gracefully for empty inputs', () => {
  const rec = recommendModelForUser('', '');
  assert.strictEqual(rec.recommendedModelId, 'gemini-3.8-flash');
  assert.ok(rec.reasoning.length > 0);
});
