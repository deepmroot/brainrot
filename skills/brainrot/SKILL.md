---
name: brainrot
description: Use when user says "/brainrot", "brainrot on", "brainrot off", "brainrot provider", "brainrot status", "brainrot demo", "brainrot theme", "brainrot intensity", "brainrot position", "brainrot autoscroll", "brainrot menu", "provider-ready", "provider-reset", "set up brainrot", "enable brainrot", or "turn on brainrot". Opt-in waiting-mode that opens TikTok/YouTube Shorts/Instagram/X/local feed while Claude works, hides when done. Keep strictly opt-in.
---

# Brainrot Mode

Opt-in distraction tool. When armed, opens a browser with short-form content while Claude works. Hides + refocuses terminal when Claude finishes.

## ALWAYS: Ensure daemon running first

```bash
curl -sf http://localhost:9346/health > /dev/null 2>&1 || \
  (node ~/.brainrot/daemon.mjs > /tmp/brainrot-daemon.log 2>&1 & sleep 0.5)
```

---

## `/brainrot` — guided setup or arm

**Step 1: Check current state**

```bash
curl -s http://localhost:9346/status
```

**Step 2A: If `enabled: false` AND `provider: local` AND no profiles exist → first-time setup**

Use AskUserQuestion tool with these options (max 4):

```
question: "Pick your Brainrot provider:"
header: "Provider"
options:
  - TikTok           → "Opens TikTok while Claude works. One-time login required."
  - YouTube Shorts   → "Opens YouTube Shorts. Requires Google login."
  - Instagram / X    → "Instagram Reels or X feed — choose after. One-time login required."
  - Local fake feed  → "Animated fake doomscroll UI, no login, works immediately."
```

If user picks "Instagram / X", follow up with a second AskUserQuestion:
```
question: "Which one?"
options: Instagram, X
```

Then based on their choice, run:

```bash
# Map: 1→tiktok  2→instagram  3→youtube-shorts  4→x  5→local
curl -s -X POST http://localhost:9346/config \
  -H 'Content-Type: application/json' \
  -d '{"provider":"<chosen>","enabled":true,"mode":"browser","position":"center"}'
```

If provider is `local`:
- No login needed.
- Tell user: "Brainrot armed. Local feed will open on your next agent run. Run `/brainrot demo` to preview it now."

If provider is real (tiktok/instagram/youtube-shorts/x):
- Run demo to open browser for login:
  ```bash
  curl -s -X POST http://localhost:9346/start
  ```
- Tell user: "Opening browser for [provider] login. Log in, then tell me when you're done (or run `/brainrot provider-ready`)."
- After user says done: run `/brainrot provider-ready` flow below.

**Step 2B: If already configured and setup complete → arm**

```bash
curl -s -X POST http://localhost:9346/config \
  -H 'Content-Type: application/json' \
  -d '{"enabled":true}'
```

Tell user: `"Brainrot armed. [provider] will open automatically on your next agent run. Run /brainrot menu for more options."`

---

## `/brainrot menu`

Get status first, then use AskUserQuestion:

```
question: "Brainrot menu · provider: [provider]"
header: "Brainrot"
options:
  - Activate now     → "Open brainrot browser immediately"
  - Switch provider  → "Change to a different feed"
  - Toggle autoscroll → "Currently: on/off"
  - Turn off         → "Disable brainrot"
```

Then act on their choice:

**1 — Activate now:**
```bash
curl -s -X POST http://localhost:9346/config -H 'Content-Type: application/json' -d '{"enabled":true}'
curl -s -X POST http://localhost:9346/start
```

**2 — Switch provider:** Re-run the provider picker (same as first-time setup Step 2A).

**3 — Toggle autoscroll:**
```bash
# Read current autoscroll from status, then toggle
curl -s -X POST http://localhost:9346/config -H 'Content-Type: application/json' -d '{"autoscroll":<true|false>}'
```

**4 — Open demo:** Run `/brainrot demo` flow.

**5 — Turn off:**
```bash
curl -s -X POST http://localhost:9346/config -H 'Content-Type: application/json' -d '{"enabled":false}'
curl -s -X POST http://localhost:9346/stop
```

Tell user: "Brainrot disabled."

---

## `/brainrot status`

```bash
curl -s http://localhost:9346/status
```

Format result as:
```
Brainrot [ON/OFF] · mode=[mode] · position=[position] · provider=[provider] · theme=[theme] · intensity=[intensity] · autoscroll=[on/off] · browser=[active/hidden]
```

---

## `/brainrot on`
```bash
curl -s -X POST http://localhost:9346/config -H 'Content-Type: application/json' -d '{"enabled":true}'
```
Tell user: "Brainrot armed. [provider] will open on your next agent run."

## `/brainrot off`
```bash
curl -s -X POST http://localhost:9346/config -H 'Content-Type: application/json' -d '{"enabled":false}'
curl -s -X POST http://localhost:9346/stop
```
Tell user: "Brainrot disabled."

---

## `/brainrot provider <name>`
Valid: `local`, `tiktok`, `instagram`, `youtube-shorts`, `x`

```bash
curl -s -X POST http://localhost:9346/config \
  -H 'Content-Type: application/json' \
  -d '{"provider":"<name>","browserUrl":""}'
```

If provider requires login (not `local`): tell user to run `/brainrot demo` to log in, then `/brainrot provider-ready` when done.

---

## `/brainrot provider-ready`

Get provider from status, then write ready marker:

```bash
PROVIDER=$(curl -s http://localhost:9346/status | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>console.log(JSON.parse(d).provider))")
mkdir -p "$HOME/.brainrot/profiles/provider-${PROVIDER}"
echo "{\"readyAt\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",\"key\":\"provider-${PROVIDER}\",\"label\":\"${PROVIDER}\"}" \
  > "$HOME/.brainrot/profiles/provider-${PROVIDER}/.brainrot-ready.json"
echo "Marked ${PROVIDER} as ready"
```

Tell user: "Brainrot is ready with [provider]. It will open automatically on your next agent run."

---

## `/brainrot provider-reset [name]`

```bash
rm -rf ~/.brainrot/profiles/provider-<name>
echo "Reset <name> profile — next launch will require login again"
```

---

## `/brainrot demo`

Open browser now regardless of armed state:

```bash
curl -s -X POST http://localhost:9346/config -H 'Content-Type: application/json' -d '{"enabled":true}'
curl -s -X POST http://localhost:9346/start
```

Tell user: "Brainrot demo opened. Browser should appear. Run `/brainrot off` to close."

---

## `/brainrot theme <name>`
Valid: `subway-surfer`, `slime`, `sigma-edit`
```bash
curl -s -X POST http://localhost:9346/config -H 'Content-Type: application/json' -d '{"theme":"<name>"}'
```

## `/brainrot intensity <level>`
Valid: `low`, `medium`, `max`
```bash
curl -s -X POST http://localhost:9346/config -H 'Content-Type: application/json' -d '{"intensity":"<level>"}'
```

## `/brainrot position <pos>`
Valid: `left`, `center`, `right`
```bash
curl -s -X POST http://localhost:9346/config -H 'Content-Type: application/json' -d '{"position":"<pos>"}'
```

## `/brainrot autoscroll on|off`
```bash
curl -s -X POST http://localhost:9346/config -H 'Content-Type: application/json' -d '{"autoscroll":<true|false>}'
```

## `/brainrot browser-url <url>`
Override browser target. Use `local` to clear:
```bash
curl -s -X POST http://localhost:9346/config -H 'Content-Type: application/json' -d '{"browserUrl":"<url>"}'
# To clear: {"browserUrl":""}
```

---

## How it works

- `PreToolUse` hook → `start.sh` → opens browser when Claude starts working
- `Stop` hook → `stop.sh` → hides browser (not kills), refocuses terminal
- Same provider session **resumed** (not restarted) across agent runs — window is hidden/shown, not killed
- Daemon persists at `localhost:9346`
- Per-provider browser profiles: `~/.brainrot/profiles/`
- Config: `~/.brainrot/config.json`
