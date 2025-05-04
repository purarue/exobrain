---
title: Dotfiles
---

Other than just using a dotfile repo with no additional tooling, just updating a git repository which you sync to github, and then manually copying what you're currently using into the correct paths, the the two intermediate 'styles' of dotfile management are:

- a bare git repo, what [`yadm`](https://yadm.io/) automates (what I currently use)
- a symlink farm, like [`stow`](https://www.gnu.org/software/stow/)

I currently use `yadm`. The tradeoff is (unlike `stow`) you don't have to keep track of multiple copies/symlinks, but it does mean you have to maintain a [huge gitignore](https://github.com/purarue/dotfiles/blob/f6dfeff93a94a2c0b1f1c1a5506a8ff2a7cbc397/.gitignore) to ignore all files you don't want to commit.
