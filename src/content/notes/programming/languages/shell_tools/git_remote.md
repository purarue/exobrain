---
title: Git on your server
---

If you have a machine you can ssh to, you can push/pull from that with git (this shows how to do so over SSH)

### New Project

To create on remote, for example in projects, create a repo named 'apple':

```bash
cd ~/projects
git init --bare apple
```

Then, you can use typical `scp` syntax, so since I have a `~/.ssh/config` setup, I can do something like:

```bash
git clone server:projects/apple
```

If you didn't have one of those, it'd be like `username@<ip address>:projects/apple`

### Existing Repository

If you have an existing local repository (you're migrating a repo away from github), you can do:

```bash
# on local
git remote set-url origin server:projects/apple
git push
```

### Push from existing local repository

And lastly if you have a existing local repository that has some commits but you've never pushed it anywhere, you can do:

```bash
# on local
git remote add origin server:projects/apple
git push --set-upstream origin main
```
