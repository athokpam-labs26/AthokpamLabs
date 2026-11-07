import test from 'node:test';
import assert from 'node:assert/strict';
import { VirtualFileSystem } from './fileSystem';

test('VirtualFileSystem loads, edits, and reads files correctly', () => {
  const fs = new VirtualFileSystem({
    'src/App.tsx': 'export default function App() { return <div>Hello</div>; }',
    'package.json': '{"name": "test"}',
  });

  assert.equal(fs.getAllFiles().length, 2);
  assert.equal(fs.getFileContent('src/App.tsx'), 'export default function App() { return <div>Hello</div>; }');

  // Modify file
  fs.setFile('src/App.tsx', 'export default function App() { return <div>Hello World</div>; }');
  const file = fs.getFile('src/App.tsx');
  assert.equal(file?.isModified, true);
  assert.equal(file?.content, 'export default function App() { return <div>Hello World</div>; }');

  // Diff
  const diff = fs.getDiff('src/App.tsx');
  assert.equal(diff.hasChanges, true);
  assert.ok(diff.original.includes('Hello</div>'));
  assert.ok(diff.current.includes('Hello World</div>'));

  // Delete
  fs.deleteFile('package.json');
  assert.equal(fs.getFile('package.json'), undefined);
});

test('VirtualFileSystem builds nested folder tree', () => {
  const fs = new VirtualFileSystem({
    'src/components/Header.tsx': 'export const Header = () => null;',
    'src/components/Footer.tsx': 'export const Footer = () => null;',
    'src/App.tsx': 'export default () => null;',
    'public/index.html': '<html></html>',
  });

  const tree = fs.getTree();
  // Should have 'public' folder and 'src' folder
  const srcNode = tree.find((n) => n.name === 'src');
  assert.ok(srcNode);
  assert.equal(srcNode.type, 'folder');

  // Inside src should have App.tsx and components folder
  const componentsNode = srcNode.children?.find((n) => n.name === 'components');
  assert.ok(componentsNode);
  assert.equal(componentsNode.type, 'folder');
  assert.equal(componentsNode.children?.length, 2);
});
