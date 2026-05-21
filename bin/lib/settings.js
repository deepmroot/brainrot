'use strict';
const fs = require('fs');
const path = require('path');

function readJson(filePath) {
  try { return JSON.parse(fs.readFileSync(filePath, 'utf8')); } catch { return {}; }
}

function writeJson(filePath, obj) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(obj, null, 2) + '\n');
}

function mergeHooks(settingsPath, hookEntries) {
  const settings = readJson(settingsPath);
  if (!settings.hooks) settings.hooks = {};
  for (const [event, entry] of Object.entries(hookEntries)) {
    if (!settings.hooks[event]) settings.hooks[event] = [];
    const cmd = entry.hooks[0].command;
    const alreadyWired = settings.hooks[event].some(e =>
      e.hooks && e.hooks.some(h => h.command === cmd)
    );
    if (!alreadyWired) settings.hooks[event].push(entry);
  }
  writeJson(settingsPath, settings);
}

function appendToFile(filePath, block) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const existing = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
  if (existing.includes('## Brainrot')) return;
  fs.appendFileSync(filePath, '\n' + block + '\n');
}

module.exports = { readJson, writeJson, mergeHooks, appendToFile };
