#!/usr/bin/env bash
PROVIDER="${1:-local}"
case "$PROVIDER" in
  tiktok)         ICON="🎵" LABEL="TikTok" ;;
  youtube-shorts) ICON="▶️ " LABEL="YouTube Shorts" ;;
  instagram)      ICON="📸" LABEL="Instagram" ;;
  x)              ICON="𝕏 " LABEL="X" ;;
  *)              ICON="📺" LABEL="Local Feed" ;;
esac

# Claude Code hooks capture stdout — print a single visible status line
printf "\033[38;5;213m\033[1m◉ BRAINROT ON\033[0m  %s %s · opening browser\n" "$ICON" "$LABEL"
