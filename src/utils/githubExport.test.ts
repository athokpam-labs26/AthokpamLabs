import test from 'node:test';
import assert from 'node:assert/strict';
import { generateProjectReadme } from './githubExport';

test('generateProjectReadme includes Made with Athokpam badge when enabled', () => {
  const readme = generateProjectReadme(
    'my-super-app',
    'A powerful SaaS dashboard',
    { 'src/App.tsx': '// code', 'package.json': '{}' },
    true
  );

  assert.ok(readme.includes('# my-super-app'));
  assert.ok(readme.includes('Made with Athokpam'));
  assert.ok(readme.includes('https://img.shields.io/badge/Made%20with-Athokpam%20AI-6366f1'));
  assert.ok(readme.includes('Athokpam Labs'));
  assert.ok(readme.includes('src/App.tsx'));
});

test('generateProjectReadme omits badge when disabled', () => {
  const readme = generateProjectReadme(
    'unbadged-app',
    'Plain description',
    { 'src/index.ts': '// code' },
    false
  );

  assert.ok(readme.includes('# unbadged-app'));
  assert.ok(!readme.includes('Made with Athokpam'));
  assert.ok(readme.includes('Plain description'));
});

test('generateProjectReadme formats fallback files gracefully if empty files map', () => {
  const readme = generateProjectReadme('blank-app', '', {});
  assert.ok(readme.includes('# blank-app'));
  assert.ok(readme.includes('npm run dev'));
});
