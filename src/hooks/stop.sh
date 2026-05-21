#!/usr/bin/env bash
rm -f "/tmp/brainrot-active-${PPID}" 2>/dev/null || true
curl -sf -X POST http://localhost:9346/stop > /dev/null 2>&1 || true

# Minimize browser window (WSL: Edge/Chrome are Windows processes)
if grep -qi microsoft /proc/version 2>/dev/null; then
  powershell.exe -NoProfile -NonInteractive -Command "
    Add-Type -TypeDefinition 'using System;using System.Runtime.InteropServices;public class W{[DllImport(\"user32.dll\")]public static extern bool ShowWindow(IntPtr h,int n);}' -ErrorAction SilentlyContinue
    Get-Process -Name msedge,chrome -ErrorAction SilentlyContinue |
      Where-Object { \$_.MainWindowHandle -ne [IntPtr]::Zero } |
      ForEach-Object { [W]::ShowWindow(\$_.MainWindowHandle, 6) }
  " > /dev/null 2>&1 || true
fi

bash "$HOME/.brainrot/hooks/deactivate-visual.sh"
