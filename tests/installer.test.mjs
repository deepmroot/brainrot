import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { mergeHooks, appendToFile } = require('../bin/lib/settings.js');

test('mergeHooks adds hooks to empty settings', () => {
  const tmp = path.join(os.tmpdir(), `br-test-${Date.now()}.json`);
  fs.writeFileSync(tmp, '{}');
  mergeHooks(tmp, {
    PreToolUse: { hooks: [{ type: 'command', command: 'bash ~/.brainrot/hooks/start.sh' }] },
    Stop:       { hooks: [{ type: 'command', command: 'bash ~/.brainrot/hooks/stop.sh'  }] },
  });
  const r = JSON.parse(fs.readFileSync(tmp, 'utf8'));
  assert.equal(r.hooks.PreToolUse.length, 1);
  assert.equal(r.hooks.Stop.length, 1);
  fs.unlinkSync(tmp);
});

test('mergeHooks is idempotent', () => {
  const tmp = path.join(os.tmpdir(), `br-test-${Date.now()}.json`);
  fs.writeFileSync(tmp, '{}');
  const entry = { hooks: [{ type: 'command', command: 'bash ~/.brainrot/hooks/start.sh' }] };
  mergeHooks(tmp, { PreToolUse: entry });
  mergeHooks(tmp, { PreToolUse: entry });
  const r = JSON.parse(fs.readFileSync(tmp, 'utf8'));
  assert.equal(r.hooks.PreToolUse.length, 1);
  fs.unlinkSync(tmp);
});

test('appendToFile is idempotent', () => {
  const tmp = path.join(os.tmpdir(), `br-gemini-${Date.now()}.md`);
  appendToFile(tmp, '## Brainrot\nrun start.sh');
  appendToFile(tmp, '## Brainrot\nrun start.sh');
  const c = fs.readFileSync(tmp, 'utf8');
  assert.equal((c.match(/## Brainrot/g) || []).length, 1);
  fs.unlinkSync(tmp);
});
