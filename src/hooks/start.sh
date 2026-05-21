#!/usr/bin/env bash
# Session flag keyed on parent PID (Claude Code's process) — survives across tool calls
FLAG="/tmp/brainrot-active-${PPID}"
[ -f "$FLAG" ] && exit 0
touch "$FLAG"

if ! curl -sf http://localhost:9346/health > /dev/null 2>&1; then
  node "$HOME/.brainrot/daemon.mjs" > /tmp/brainrot-daemon.log 2>&1 &
  sleep 0.5
fi

STATUS=$(curl -s http://localhost:9346/status 2>/dev/null)
ENABLED=$(echo "$STATUS" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{console.log(JSON.parse(d).enabled)}catch(e){console.log('false')}})")
PROVIDER=$(echo "$STATUS" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{console.log(JSON.parse(d).provider)}catch(e){console.log('local')}})")

if [ "$ENABLED" = "true" ]; then
  # Skip if provider needs login (no .brainrot-ready.json and not local)
  READY="$HOME/.brainrot/profiles/provider-${PROVIDER}/.brainrot-ready.json"
  if [ "$PROVIDER" != "local" ] && [ ! -f "$READY" ]; then
    exit 0
  fi

  bash "$HOME/.brainrot/hooks/activate-visual.sh" "$PROVIDER"
  # Restore minimized browser window first (WSL), then let daemon spawn if needed
  if grep -qi microsoft /proc/version 2>/dev/null; then
    powershell.exe -NoProfile -NonInteractive -Command "
      Add-Type -TypeDefinition 'using System;using System.Runtime.InteropServices;public class W{[DllImport(\"user32.dll\")]public static extern bool ShowWindow(IntPtr h,int n);}' -ErrorAction SilentlyContinue
      Get-Process -Name msedge,chrome -ErrorAction SilentlyContinue |
        Where-Object { \$_.MainWindowHandle -ne [IntPtr]::Zero } |
        ForEach-Object { [W]::ShowWindow(\$_.MainWindowHandle, 9) }
    " > /dev/null 2>&1 || true
  fi
  curl -sf -X POST http://localhost:9346/start > /dev/null 2>&1 || true
fi
