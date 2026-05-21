#!/usr/bin/env node
'use strict';
const fs   = require('fs');
const path = require('path');
const os   = require('os');
const { mergeHooks, appendToFile } = require('./lib/settings.js');

const HOME      = os.homedir();
const BRAINROT  = path.join(HOME, '.brainrot');
const REPO_ROOT = path.join(__dirname, '..');

const log  = m => process.stdout.write(m + '\n');
const ok   = m => log(`\x1b[32m✓\x1b[0m ${m}`);
const info = m => log(`  ${m}`);

function detectAgents() {
  return {
    claudeCode: fs.existsSync(path.join(HOME, '.claude')),
    gemini:     fs.existsSync(path.join(HOME, '.gemini')),
    codex:      fs.existsSync(path.join(HOME, '.codex')),
  };
}

function migrateOldInstall() {
  const oldConfig = path.join(HOME, '.claude', 'brainrot', 'config.json');
  const newConfig = path.join(BRAINROT, 'config.json');
  if (fs.existsSync(oldConfig) && !fs.existsSync(newConfig)) {
    fs.mkdirSync(BRAINROT, { recursive: true });
    fs.copyFileSync(oldConfig, newConfig);
    info('Migrated config from ~/.claude/brainrot/');
  }
}

function copyRuntime() {
  fs.mkdirSync(path.join(BRAINROT, 'hooks'), { recursive: true });
  fs.mkdirSync(path.join(BRAINROT, 'profiles'), { recursive: true });
  for (const f of ['daemon.mjs', 'browser-feed.html']) {
    fs.copyFileSync(path.join(REPO_ROOT, 'src', f), path.join(BRAINROT, f));
  }
  for (const f of ['start.sh','stop.sh','activate-visual.sh','deactivate-visual.sh']) {
    const dest = path.join(BRAINROT, 'hooks', f);
    fs.copyFileSync(path.join(REPO_ROOT, 'src', 'hooks', f), dest);
    fs.chmodSync(dest, 0o755);
  }
}

function wireClaudeCode() {
  mergeHooks(path.join(HOME, '.claude', 'settings.json'), {
    PreToolUse: { hooks: [{ type: 'command', command: 'bash ~/.brainrot/hooks/start.sh' }] },
    Stop:       { hooks: [{ type: 'command', command: 'bash ~/.brainrot/hooks/stop.sh'  }] },
  });
  const skillSrc = path.join(REPO_ROOT, 'skills', 'brainrot', 'SKILL.md');
  const dest = path.join(HOME, '.claude', 'skills', 'brainrot');
  fs.mkdirSync(dest, { recursive: true });
  if (fs.existsSync(skillSrc)) {
    fs.copyFileSync(skillSrc, path.join(dest, 'SKILL.md'));
  }
}

function wireGemini() {
  appendToFile(path.join(HOME, '.gemini', 'GEMINI.md'),
    '## Brainrot\n' +
    'At the start of any multi-step task, run: `bash ~/.brainrot/hooks/start.sh`\n' +
    'When the task is complete, run: `bash ~/.brainrot/hooks/stop.sh`\n');
}

function wireCodex() {
  appendToFile(path.join(HOME, '.codex', 'AGENTS.md'),
    '## Brainrot\n' +
    'At the start of any multi-step task, run: `bash ~/.brainrot/hooks/start.sh`\n' +
    'When the task is complete, run: `bash ~/.brainrot/hooks/stop.sh`\n');
}

function main() {
  log('\nbrainrot — cross-agent doomscroll mode\n');
  const agents = detectAgents();
  if (agents.claudeCode) ok('Detected: Claude Code');
  if (agents.gemini)     ok('Detected: Gemini CLI');
  if (agents.codex)      ok('Detected: Codex');
  if (!agents.claudeCode && !agents.gemini && !agents.codex)
    log('⚠ No agents detected — copying runtime anyway. Run install again after installing an agent.');

  migrateOldInstall();
  copyRuntime();
  ok('Copied runtime to ~/.brainrot/');

  if (agents.claudeCode) { wireClaudeCode(); ok('Wired Claude Code hooks'); ok('Installed Claude skill to ~/.claude/skills/brainrot/'); }
  if (agents.gemini)     { wireGemini();     ok('Wired Gemini CLI (GEMINI.md)'); }
  if (agents.codex)      { wireCodex();      ok('Wired Codex (AGENTS.md)'); }

  log('\nRun \x1b[1m/brainrot\x1b[0m to get started.\n');
}

main();
