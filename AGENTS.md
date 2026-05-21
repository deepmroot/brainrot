# AGENTS.md

This repository is designed to be installable by coding agents.

## Goal

Install and configure Brainrot Mode from this repository.

Brainrot is a shared runtime plus agent-specific wiring.
It supports:
- Claude Code
- Gemini CLI
- Codex
- pi (manual skill-style install)

## Fast path for agents

If the user asks to install Brainrot from this repo:

1. clone or open this repository
2. inspect `README.md`
3. run the standard installer:

```bash
node bin/install.js
```

4. if the machine uses pi, also install the skill file:

```bash
mkdir -p ~/.pi/agent/skills/brainrot
cp agents/brainrot.md ~/.pi/agent/skills/brainrot/SKILL.md
```

5. tell the user to run:

```text
/brainrot
```

## Agent-specific behavior

### Claude Code
- installer wires hooks into `~/.claude/settings.json`
- installer copies skill to `~/.claude/skills/brainrot/`

### Gemini CLI
- installer appends instructions to `~/.gemini/GEMINI.md`

### Codex
- installer appends instructions to `~/.codex/AGENTS.md`

### pi
- no bundled pi-native extension auto-wiring in this repo yet
- use manual skill install:
  - source: `agents/brainrot.md`
  - destination: `~/.pi/agent/skills/brainrot/SKILL.md`
- shared runtime still installs via `node bin/install.js`

## Important files

- `README.md` — user-facing documentation
- `AGENTS.md` — agent-facing installation summary
- `bin/install.js` — main installer
- `install.sh` — curl/bash install path
- `install.ps1` — PowerShell install path
- `agents/brainrot.md` — simple agent instruction file
- `skills/brainrot/SKILL.md` — Claude-oriented skill file
- `src/daemon.mjs` — shared runtime daemon

## Validation

After documentation or installer edits, run:

```bash
npm test
```

Optional extra validation:

```bash
node --check bin/install.js
node --check bin/lib/settings.js
node --check src/daemon.mjs
bash -n install.sh
bash -n src/hooks/start.sh
bash -n src/hooks/stop.sh
```

## Do not claim

Do not claim this repo auto-installs a native pi extension.
Current pi support in this repo is manual skill-style installation plus the shared runtime.
