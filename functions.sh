#!/bin/zsh
exo() {
	cd "$REPOS/exobrain" || return 1
	./scripts/exo "$@"
}
exo-upload() {
	local abspath
	[[ -f "$1" ]] || {
		echo 'not a file' >&2
		return 1
	}
	abspath=$(realpath "$1")
	(cd "$REPOS/exobrain" && ./scripts/exo-upload.py upload -t photography "$abspath")
}

# vim: ft=bash
