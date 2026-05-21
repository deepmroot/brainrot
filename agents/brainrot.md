---
name: brainrot
description: Calls ~/.brainrot/hooks/start.sh at task start and stop.sh when done. Handles /brainrot commands via daemon at http://localhost:9346.
---

At the start of any task: `bash ~/.brainrot/hooks/start.sh`
When done: `bash ~/.brainrot/hooks/stop.sh`

/brainrot on  → POST /config {"enabled":true} + activate-visual.sh
/brainrot off → POST /config {"enabled":false} + POST /stop + deactivate-visual.sh
/brainrot status → GET /status
