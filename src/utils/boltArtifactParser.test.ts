import test from 'node:test';
import assert from 'node:assert/strict';
import { parseBoltArtifact, formatBoltArtifact, parseAthokpamArtifact } from './boltArtifactParser';

test('parseBoltArtifact parses standard XML artifact correctly', () => {
  const sample = `
I have created the requested counters component.

<thought>
Let's build a clean React counter with increment and reset buttons.
</thought>

<athokpamArtifact id="counter-app" title="Create Counter App">
  <athokpamAction type="shell">
    npm install lucide-react
  </athokpamAction>
  <athokpamAction type="file" filePath="src/App.tsx">
    import React from 'react';
    export default function App() { return <div>Counter</div>; }
  </athokpamAction>
  <athokpamAction type="start">
    npm run dev
  </athokpamAction>
</athokpamArtifact>

Hope you enjoy this app!
`;

  const parsed = parseAthokpamArtifact(sample);
  assert.equal(parsed.thought, "Let's build a clean React counter with increment and reset buttons.");
  assert.ok(parsed.artifact);
  assert.equal(parsed.artifact?.id, 'counter-app');
  assert.equal(parsed.artifact?.title, 'Create Counter App');
  assert.equal(parsed.artifact?.actions.length, 3);
  assert.equal(parsed.artifact?.actions[0].type, 'shell');
  assert.equal(parsed.artifact?.actions[0].content, 'npm install lucide-react');
  assert.equal(parsed.artifact?.actions[1].type, 'file');
  assert.equal(parsed.artifact?.actions[1].filePath, 'src/App.tsx');
  assert.ok(parsed.artifact?.actions[1].content.includes('<div>Counter</div>'));
  assert.equal(parsed.artifact?.actions[2].type, 'start');
  assert.ok(parsed.markdownText.includes('I have created the requested counters component.'));
  assert.ok(parsed.markdownText.includes('Hope you enjoy this app!'));
});

test('formatBoltArtifact generates proper tags', () => {
  const xml = formatBoltArtifact('todo-app', 'Todo App', [
    { path: 'src/App.tsx', content: 'export default () => <h1>Todo</h1>;' }
  ], ['npm install']);

  assert.ok(xml.includes('Artifact id="todo-app" title="Todo App">'));
  assert.ok(xml.includes('Action type="shell">'));
  assert.ok(xml.includes('filePath="src/App.tsx"'));
  assert.ok(xml.includes('Artifact>'));
});
