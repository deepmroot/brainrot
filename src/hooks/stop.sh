#!/usr/bin/env bash
rm -f "/tmp/brainrot-active-${PPID}" 2>/dev/null || true
curl -sf -X POST http://localhost:9346/stop > /dev/null 2>&1 || true
bash "$HOME/.brainrot/hooks/deactivate-visual.sh" &
