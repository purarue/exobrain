---
title: "Devlog: Opam on Android"
pubDate: 2023/09/17
updatedDate: 2024/03/01
description: Getting opam to work on Android
---

A post describing my process of getting opam ([ocaml](https://ocaml.org/) package manager) to work on android using [termux](https://termux.dev/en).

[Related issue on dune](https://github.com/ocaml/dune/issues/8676)

Prereqs:

```
pkg install rsync clang coreutils dash diffutils make nmap-ncat proot
```

- Install the [its-pointless community repo](https://wiki.termux.com/wiki/Package_Management)

```
curl -LO https://its-pointless.github.io/setup-pointless-repo.sh
bash setup-pointless-repo.sh
```

- Install opam

```
pkg install opam
```

I believe the only reason this works is because the creator of that repository wrote a giant patch for the `opam` build process to work on android. So, it installs a specific version of `opam`, and I'm not sure if that's going to change anytime soon.

Then:

```
unset LD_PRELOAD
termux-chroot
export LD_LIBRARY_PATH=/data/data/com.termux/files/usr/lib
opam init --bypass-checks --disable-sandboxing
```

That sets up the basic `~/.opam` directory (but eventually fails). That asks you to clean up the broken switch (version), so I did.

Then, following the debugging [here](https://github.com/ocaml/opam-repository/issues/22748):

Edit your `~/.opam/config` and reduce `jobs` to 1, and remove the `wrap-*` lines (that does the sandboxing with bubblewrap, which I couldn't figure out how to install)

Mine looks like:

```
opam-version: "2.0"
repositories: "default"
installed-switches: ["5.0.0" "default"]
switch: "5.0.0"
jobs: 1
download-jobs: 3
eval-variables: [
  sys-ocaml-version
  ["ocamlc" "-vnum"]
  "OCaml version present on your system independently of opam, if any"
]
default-compiler: [
  "ocaml-system" {>= "4.02.3"}
  "ocaml-base-compiler"
]
```

Then, `export LDFLAGS="-landroid-shmem"` and `opam switch create 5.0.0 --jobs=1`

A then just wait a while for it to build.

To install dune, [after a bunch of troubleshooting](https://github.com/ocaml/dune/issues/8676):

```sh
pkg install proot
unset LD_PRELOAD
termux-chroot

git clone --depth=1 https://github.com/ocaml/dune
cd dune

make release
make install PREFIX=$PREFIX
```

Still not sure if third party deps install properly, I've only used it for a `dune` build with no package dependencies.
