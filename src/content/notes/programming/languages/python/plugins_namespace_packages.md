---
title: Python Plugins/Namespace Packages
---

My [HPI](https://github.com/purarue/HPI) repo is an example of using [namespace packages as an plugin mechanism](https://packaging.python.org/guides/creating-and-discovering-plugins/#using-namespace-packages).

Both of them are installed as an editable package (like `pip install -e .`, which adds a `egg` file to `~/.local/lib/python3.9/site-packages/`, and a line to `~/.local/lib/python3.9/site-packages/easy-install.pth`.

Upsides:

- Any changes to either repo immediately update the local packages, no need to reinstall/re-run `setup.py`.
- Relative imports work across directory structures, no need to symlink.

Downsides:

- Requires quite a bit of domain knowledge on python packaging and troubleshooting to get work
- How name conflicts (i.e. if my HPI fork had a `my.location` subpackage and so did the upstream HPI, which are both installed as a namespace package) are handled are by the order of the paths in the `easy-install.pth`, e.g.:

```bash
cat ~/.local/lib/python3.9/site-packages/easy-install.pth
/home/username/Repos/HPI
/home/username/Repos/HPI-to-master
```

means that `HPI` overrides any namespace packages in `HPI-to-master`.

The fact that it overrides is great! Since it means I can overwrite files in the upstream repo without having to maintain a fork and having to deal with merging changes back and forth. But, sometimes when re-installing (or for some reason I can't seem to find) `easy-install.pth` gets messed with. To fix that, created [reorder_editable](https://github.com/purarue/reorder_editable), which naively reorders my `easy-install.pth`.
