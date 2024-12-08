---
title: EJS Treesitter Syntax Highlighting in Neovim
---

[Ejs](https://ejs.co/#features) is an embedded javascript templating language.

After installing [nvim-treesitter`](https://github.com/nvim-treesitter/nvim-treesitter) and running:

```vim
:TSInstall html javascript embedded_template
```

Adding this to your config seems to work well enough for `ejs` files:

```lua
vim.filetype.add({ extension = { ejs = "ejs" } })
vim.treesitter.language.register("html", "ejs")
vim.treesitter.language.register("javascript", "ejs")
vim.treesitter.language.register("embedded_template", "ejs")
```
