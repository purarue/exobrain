---
title: Docker
---

Reminder that if you want to run docker without sudo, you need to add yourself to the `docker` group. It should probably already be installed on any sane install of docker, so:

```bash
# else create it
sudo groupadd docker
# add yourself
sudo usermod -aG docker $(whoami)
# login to the new group (this works per-terminal, need to re-log for it to work permanently)
newgrp docker
```
