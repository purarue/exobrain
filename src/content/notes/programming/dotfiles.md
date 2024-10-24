---
title: Dotfiles
---

Other than just using a dotfile repo as literal dotfiles, just copying what you're currently using; the the two intermediate 'styles' of dotfile management are:

- a bare git repo, what [`yadm`](https://yadm.io/) automates (what I currently use)
- a symlink farm, like [`stow`](https://www.gnu.org/software/stow/)

I currently use `yadm`. The tradeoff is (unlike `stow`) you don't have to keep track of multiple copies/symlinks, but it does mean you have to maintain a [huge gitignore](https://github.com/purarue/dotfiles/blob/f6dfeff93a94a2c0b1f1c1a5506a8ff2a7cbc397/.gitignore) to ignore all files you don't want to commit.

yadm also has a ['bootstrap'](https://github.com/purarue/dotfiles/blob/f6dfeff93a94a2c0b1f1c1a5506a8ff2a7cbc397/.config/yadm/bootstrap) script, which just makes it nicer to deploy as I'm setting up a new machine.

Above that, is probably using [nix](https://nixos.org/) to declare more reproducible builds.
