#!/usr/bin/env bash
FLAG="/tmp/brainrot-active-$$"
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
  bash "$HOME/.brainrot/hooks/activate-visual.sh" "$PROVIDER" &
  curl -sf -X POST http://localhost:9346/start > /dev/null 2>&1 || true
fi
