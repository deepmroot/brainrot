$ErrorActionPreference = "Stop"
$REPO = "deepmroot/brainrot"
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Error "brainrot: Node.js (>=18) required. https://nodejs.org"; exit 1
}
$nodeMajor = [int](node -p "process.versions.node.split('.')[0]")
if ($nodeMajor -lt 18) { Write-Error "brainrot: Node $nodeMajor too old."; exit 1 }
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$local = Join-Path $here "bin\install.js"
if (Test-Path $local) { node $local @args; exit }
npx -y "github:$REPO" @args
