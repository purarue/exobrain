---
title: Docker
---

Reminder that if you want to run docker without sudo, you need to add yourself to the `docker` group. It should probably already be installed on any sane install of docker, so:

```
# else create it
sudo groupadd docker
# add yourself
sudo usermod -aG docker $(whoami)
# login to the new group
newgrp docker
```
