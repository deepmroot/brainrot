# Brainrot testing

## Installer checks

Run at least one of:

```bash
node bin/install.js
npx -y github:deepmroot/brainrot
```

On Windows:

```powershell
irm https://raw.githubusercontent.com/deepmroot/brainrot/main/install.ps1 | iex
```

## Runtime smoke test

Inside a supported agent:

```text
/brainrot
/brainrot status
/brainrot menu
/brainrot demo browser
/brainrot provider youtube-shorts
/brainrot autoscroll off
```

Validate:

- provider selection works
- browser opens only during active work
- browser hides when the run ends
- the same provider profile is reused
- `/brainrot menu` can launch immediately
- autoscroll toggles successfully

## CI expectations

- `npm test` passes
- `node --check` passes for runtime scripts
- `bash -n` passes for shell hooks
- `install.ps1` parses without PowerShell errors
- README asset references resolve correctly
