#!/usr/bin/env bash
PROVIDER="${1:-local}"
case "$PROVIDER" in
  tiktok)         ICON="🎵" LABEL="TikTok" ;;
  youtube-shorts) ICON="▶️ " LABEL="YouTube Shorts" ;;
  instagram)      ICON="📸" LABEL="Instagram" ;;
  x)              ICON="𝕏 " LABEL="X" ;;
  *)              ICON="📺" LABEL="Local Feed" ;;
esac

RESET="\033[0m" BOLD="\033[1m" DIM="\033[2m"
COLORS=("\033[38;5;213m" "\033[38;5;207m" "\033[38;5;201m" "\033[38;5;165m" "\033[38;5;129m" "\033[38;5;93m" "\033[38;5;57m" "\033[38;5;93m" "\033[38;5;129m" "\033[38;5;165m" "\033[38;5;201m" "\033[38;5;207m" "\033[38;5;213m" "\033[38;5;219m" "\033[38;5;225m" "\033[38;5;231m")

if [ -w /dev/tty ]; then exec > /dev/tty 2>&1; else exec >&2; fi

echo ""
for sweep in 1 2; do
  for color in "${COLORS[@]}"; do
    printf "\r  ${color}${BOLD}◉ BRAINROT ON  ${ICON} ${LABEL}${RESET}   "
    sleep 0.04
  done
done
printf "\r  \033[38;5;213m${BOLD}◉ BRAINROT${RESET}  ${DIM}${ICON} ${LABEL} · vibing while claude works${RESET}\n"
echo ""
