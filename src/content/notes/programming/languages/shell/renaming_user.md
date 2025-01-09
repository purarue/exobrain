---
title: Bash Renaming user
---

May be nice to run `sudo su` beforehand so you have enough permission.

Run `groups` to check if you have a group with your name:

```bash
sudo usermod --move-home --login new_username --home /home/new_username old_username
```

If you did have a group:

```bash
sudo groupmod --new-name new_username old_username
```

To make sure old references work temporarily, you may want to add a link:

```bash
ln -s /home/new_username /home/old_username
```
