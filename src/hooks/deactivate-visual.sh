#!/usr/bin/env bash
RESET="\033[0m" DIM="\033[2m" BOLD="\033[1m"
COLORS=("\033[38;5;213m" "\033[38;5;177m" "\033[38;5;141m" "\033[38;5;105m" "\033[38;5;69m" "\033[38;5;238m" "\033[38;5;236m" "\033[38;5;234m")

if [ -w /dev/tty ]; then exec > /dev/tty 2>&1; else exec >&2; fi

echo ""
for color in "${COLORS[@]}"; do
  printf "\r  ${color}${BOLD}◯ BRAINROT OFF${RESET}   "
  sleep 0.05
done
printf "\r  ${DIM}◯ brainrot · off${RESET}\n"
echo ""
