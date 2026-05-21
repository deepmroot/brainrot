#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import { spawn } from 'node:child_process';

const IS_WSL = (() => {
  try { return fs.readFileSync('/proc/version','utf8').toLowerCase().includes('microsoft'); } catch { return false; }
})();

const BRAINROT_DIR = path.join(os.homedir(), '.brainrot');
const CONFIG_PATH = path.join(BRAINROT_DIR, 'config.json');
const BROWSER_FEED_PATH = path.join(BRAINROT_DIR, 'browser-feed.html');
const PROFILES_DIR = path.join(BRAINROT_DIR, 'profiles');
const PORT = 9346;

const PROVIDERS = ['local','tiktok','instagram','youtube-shorts','x'];
const PROVIDER_URLS = {
  local: '', tiktok: 'https://www.tiktok.com/',
  instagram: 'https://www.instagram.com/',
  'youtube-shorts': 'https://www.youtube.com/shorts',
  x: 'https://x.com/',
};

const DEFAULT_CONFIG = {
  enabled: false, provider: 'local', theme: 'subway-surfer',
  intensity: 'max', mode: 'browser', position: 'center',
  autoscroll: true, autoscrollIdleSeconds: 8,
  refocusOnCompletion: true, browserUrl: '',
};

function loadConfig() {
  try {
    if (!fs.existsSync(CONFIG_PATH)) return { ...DEFAULT_CONFIG };
    return { ...DEFAULT_CONFIG, ...JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8')) };
  } catch { return { ...DEFAULT_CONFIG }; }
}

function saveConfig(cfg) {
  fs.mkdirSync(BRAINROT_DIR, { recursive: true });
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(cfg, null, 2));
}

let config = loadConfig();
let browserActive = false;

function getBrowserCmd() {
  const candidates = IS_WSL
    ? ['/mnt/c/Program Files/Microsoft/Edge/Application/msedge.exe',
       '/mnt/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
       '/mnt/c/Program Files/Google/Chrome/Application/chrome.exe']
    : ['google-chrome','chromium','chromium-browser','microsoft-edge'];
  if (IS_WSL) {
    for (const c of candidates) {
      try { if (fs.existsSync(c)) return c; } catch {}
    }
  }
  return candidates[0];
}

function getUrl() {
  if (config.browserUrl) return config.browserUrl;
  if (config.provider === 'local') return `file://${BROWSER_FEED_PATH}`;
  return PROVIDER_URLS[config.provider] || PROVIDER_URLS.tiktok;
}

function startBrowser() {
  if (browserActive) return;
  const profileDir = path.join(PROFILES_DIR, `provider-${config.provider}`);
  fs.mkdirSync(profileDir, { recursive: true });
  const proc = spawn(getBrowserCmd(), [
    `--user-data-dir=${profileDir}`,
    '--no-first-run', '--no-default-browser-check',
    '--disable-features=TranslateUI', getUrl(),
  ], { detached: true, stdio: 'ignore' });
  proc.unref();
  browserActive = true;
}

function stopBrowser() { browserActive = false; }

function json(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise(resolve => {
    let d = '';
    req.on('data', c => d += c);
    req.on('end', () => {
      if (!d.trim()) return resolve({});
      try { resolve(JSON.parse(d)); } catch { resolve({}); }
    });
  });
}

http.createServer(async (req, res) => {
  const { method, url } = req;
  if (method === 'GET'  && url === '/health') return json(res, 200, { ok: true });
  if (method === 'GET'  && url === '/status') return json(res, 200, { ...config, browserActive });
  if (method === 'POST' && url === '/config') {
    const body = await readBody(req);
    config = { ...config, ...body };
    if (body.provider && !PROVIDERS.includes(body.provider)) config.provider = DEFAULT_CONFIG.provider;
    saveConfig(config);
    return json(res, 200, { ok: true, config });
  }
  if (method === 'POST' && url === '/start') { startBrowser(); return json(res, 200, { ok: true }); }
  if (method === 'POST' && url === '/stop')  { stopBrowser();  return json(res, 200, { ok: true }); }
  json(res, 404, { error: 'not found' });
}).listen(PORT, '127.0.0.1', () => process.stdout.write(`brainrot daemon listening on ${PORT}\n`));
