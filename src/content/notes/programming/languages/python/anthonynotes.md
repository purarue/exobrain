---
title: anthonydoescode
---

Misc notes from anthonywritescode videos

<https://www.youtube.com/watch?v=hgCVIa5qQhM>

Use `python3 -m a.main` when invoking scripts as it handles `PYTHONPATH` better

<https://www.youtube.com/watch?v=ABJvdsIANds>

Dont use `urlparse`, use `urlsplit` as it is doesn't use the archaic params field (so it has a slight perf cost)

<https://www.youtube.com/watch?v=jH39c5-y6kg>

Sqlite stuff, but `.schema` is a good command to show the schema, `.headers on` shows column names along with results so is nice

Also, he shows an example of sqlite not being able to handle concurrent writes, which makes sense since he was just spawning a bunch of bash to hit it with unique cursors at the same time, ended up doing some testing [here](./../../../databases/sql/)

<https://www.youtube.com/watch?v=98SYTvNw1kw>

Dont use `localhost`, use `127.0.0.1`. It prevents the `/etc/hosts` lookup, and also gets around IPv6 issues, as you're explicitly using IPv4

<https://www.youtube.com/watch?v=eF6qpdIY7Ko>

More interesting but I dont know If Id have a usecase for pushd/popd. It is cool to know there's a stack behind `cd`, but if I ever want to change directories, I'll do a subshell instead:

```bash
# stuff in one directory
(
	cd ../
	# stuff in another directory
)
# automatically switches back to original directory
```

<https://www.youtube.com/watch?v=10dQiNkCZGE>

OLD/NEW git commands

these are pairs of commands using the old/new commands (git checkout/git reset)

git checkout: switches branches or restores working tree states

```bash
git checkout origin/main -b feature-branch
git switch origin/main -c feature-branch # 'create'
```

```bash
git checkout feature-branch
git switch feature-branch # 'git switch -' to go back
```

```bash
git branch -r # show remote branches

origin/HEAD - >origin/main
origin/wip
```

```bash
# if you then want to check out wip, this creates the local wip branch and sets tracking branch to origin/wip
git checkout wip # this does git checkout origin/wip -b wip
git switch wip   # also does this
```

```bash
git checkout 45ae85        # puts you into a detached HEAD state
git switch --detach 45ae85 # (if you dont supply detach, it warns you to do so, as detached HEAD state is sort of weird)
```

To discard changes:

```bash
git checkout -- . # all changes, like what I used to use 'git stash'/'git stash drop' for
# or for a particular file
git checkout -- README.md # discards changes in README.md

# new version
git restore -- .
git restore -- README.md
```

```bash
git checkout -p # interactive mode to discard hunks from changed files
git restore -p  # same as above
```

```bash
# doesn't have a good equivalent in git restore

# if you want to apply changes from a subset of files from a particular revision:
# this doesn't mess with git history, it just puts those changes into your staging
git checkout v1.29.0 -- setup.py
# replacement, but it doesn't stage (this is better behaviour anyways)
git restore --source v1.29.0 -- setup.py
# if you want to stage it
git restore --staged --worktree --source v01.29.0 -- setup.py
```

'git reset': unstage files, adjust the commit revision of current branch

```bash
# to unstage changes which are in your staging area
# OLD
git reset -- setup.cfg
# NEW
git restore --staged -- setup.cfg            # just restores changed to the unstaged area
git restore --staged --worktree -- setup.cfg # unstages and discards changes

# you can also:
git restore --staged -p -- setup.cfg  # patch, prompt for changes
```

```bash
# changed commit that main points to, and changes contents of repository
git reset --hard HEAD^

# there is NO equivalent in restore/switch
```

```bash
# change contents of the repository to the pathspec, but dont change the commit that youre pointing at
git reset --soft HEAD^

# these is NO equivalent in restore/switch

# sidenote:
git rebase -i # may be a 'nicer' way to do this, but I find that git reset --soft and then manually editing files is makes more sense for my brain sometimes
```
