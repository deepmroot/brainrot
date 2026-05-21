# brainrot 🧠📱

> doomscroll while your AI codes for you

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Opens TikTok, YouTube Shorts, Instagram, or X while your AI agent works — hides when done, refocuses your terminal.

Works with **Claude Code**, **Gemini CLI**, **Codex**.

## Install

```bash
curl -fsSL https://raw.githubusercontent.com/deepmroot/brainrot/main/install.sh | bash
```

Windows:
```powershell
irm https://raw.githubusercontent.com/deepmroot/brainrot/main/install.ps1 | iex
```

## Usage

```
/brainrot        setup wizard or arm
/brainrot on     arm — browser opens on next agent run
/brainrot off    disarm
/brainrot status show state
/brainrot demo   open browser now
/brainrot menu   interactive menu
```

## Providers

| Command | Opens |
|---------|-------|
| `/brainrot provider tiktok` | TikTok |
| `/brainrot provider youtube-shorts` | YouTube Shorts |
| `/brainrot provider instagram` | Instagram |
| `/brainrot provider x` | X |
| `/brainrot provider local` | Local fake feed (no login) |

Real providers require one-time login. After logging in, run `/brainrot provider-ready`.

## How it works

1. `install.sh` wires `PreToolUse` and `Stop` hooks into your agent config
2. When agent starts a tool call → browser opens with your feed
3. When agent finishes → browser hides, terminal refocuses
4. Armed state persists in `~/.brainrot/config.json` — survives new sessions

## Requirements

- Node.js ≥ 18
- Claude Code, Gemini CLI, or Codex
- Microsoft Edge, Chrome, or Chromium

## License

MIT
