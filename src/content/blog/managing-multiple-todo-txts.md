---
title: Managing multiple todo.txt files
description: How I manage multiple todo.txt files
pubDate: 2024/02/27
updatedDate: 2024/03/11
---

This is relating to using [`todo.txt`](https://github.com/todotxt/todo.txt) format to manage todos, which I've been using for a few years now.

For the uninitiated, `todo.txt` is a simple format for managing todos. Its just a textfile, and each line is a task.

There are lots of more tags/contexts/priorities you can add, but I tend to only use priority and about half of the time add one project tag.

[![todo.txt](https://github.com/todotxt/todo.txt/raw/master/description.svg)](https://github.com/todotxt/todo.txt?tab=readme-ov-file#todotxt-format-rules)

Following some version of the [plaintext productivity](https://plaintext-productivity.net/1-03-how-i-organize-my-todo-txt-file.html) philosophy, I split my todos into multiple files.

> "My to-do list is only going to contain tasks I plan to do in the near future"

My main `todo.txt` are only things that if I have free time, I can do immediately. They should not be timed gated behind someone else, a date, or anything else.

In the past, I've created [entirely new config files and a big script](https://github.com/purarue/bookmark.txt) to help manage this complexity, but as I've added todo-actions (third party commands like [`@proycon`s scripts](https://git.sr.ht/~proycon/todotxt-more)), it gets more annoying to sync configuration changes between multiple files.

To solve this, I create a wrapper `todo.txt` script which maintains a separate data directory entirely. For more long-term goals/ideas, I create a script called `eventually`:

```bash
#!/bin/sh
export TODO_DIR="${XDG_DOCUMENTS_DIR}/Notes/eventually"
exec todo.sh "$@"
```

That sets the `TODO_DIR` environment variable. Then, in my `~/.config/todo/config` file, I have:

```bash
# Your todo.txt directory (this should be an absolute path)
if [[ -z "$TODO_DIR" ]]; then
	export TODO_DIR="${HPIDATA}/todo"  # default if unset
fi

# Your todo/done/report.txt locations
export TODO_FILE="$TODO_DIR/todo.txt"
export DONE_FILE="$TODO_DIR/done.txt"
export REPORT_FILE="$TODO_DIR/report.txt"
```

The `todo.txt` configuration file is just a `bash` script, so it makes it very easy to configure in this way. It also means all of your arguments are passed onto the `todo.sh` without modification, which could be a source of potentional configuration errors

Ive found this to be the least amount of mental overhead to create a new `todo.txt` file, which I see as more important than creating some very specific system with filters and tags which I can waste time fiddling with.

Since my `~/Documents/` directory is synced with [syncthing](https://syncthing.net/), everything is automatically backed up and synced across my devices.

Edit: I've since created a [script](https://purarue.xyz/d/todo-new?redirect) that just generates that tiny file for me, so I can create new lists whenever I want.
