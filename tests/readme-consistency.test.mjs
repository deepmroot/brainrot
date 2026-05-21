import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const readmePath = path.join(root, 'README.md');
const readme = fs.readFileSync(readmePath, 'utf8');

const requiredSnippets = [
  'curl -fsSL https://raw.githubusercontent.com/deepmroot/brainrot/main/install.sh | bash',
  'irm https://raw.githubusercontent.com/deepmroot/brainrot/main/install.ps1 | iex',
  'npx -y github:deepmroot/brainrot',
  'npm install -g github:deepmroot/brainrot',
  'docs/assets/real-pi-youtube-shorts.png',
  'docs/assets/real-claude-code-tiktok.png',
  'docs/assets/brainrot-architecture.svg',
  '## Why this exists',
  '## Architecture',
  '## Maintainer release notes',
  '/brainrot menu',
  '~/.pi/agent/skills/brainrot/SKILL.md',
  'cp agents/brainrot.md ~/.pi/agent/skills/brainrot/SKILL.md',
];

test('README contains key install, usage, and documentation sections', () => {
  for (const snippet of requiredSnippets) {
    assert.ok(readme.includes(snippet), `README is missing: ${snippet}`);
  }
});

test('README local asset references exist on disk', () => {
  const matches = [...readme.matchAll(/docs\/assets\/[A-Za-z0-9._-]+/g)].map(m => m[0]);
  const unique = [...new Set(matches)];
  assert.ok(unique.length > 0, 'No docs/assets references found in README');
  for (const rel of unique) {
    const full = path.join(root, rel.replace(/\//g, path.sep));
    assert.ok(fs.existsSync(full), `Missing asset referenced by README: ${rel}`);
  }
});
