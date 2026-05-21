import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

test('AGENTS.md exists and documents agent install flow', () => {
  const content = read('AGENTS.md');
  for (const snippet of [
    'node bin/install.js',
    'agents/brainrot.md',
    '~/.pi/agent/skills/brainrot/SKILL.md',
    'Claude Code',
    'Gemini CLI',
    'Codex',
    'pi',
  ]) {
    assert.ok(content.includes(snippet), `AGENTS.md missing: ${snippet}`);
  }
});

test('llms.txt exists and includes repo install hint', () => {
  const content = read('llms.txt');
  for (const snippet of [
    'https://github.com/deepmroot/brainrot',
    'node bin/install.js',
    '/brainrot',
  ]) {
    assert.ok(content.includes(snippet), `llms.txt missing: ${snippet}`);
  }
});
