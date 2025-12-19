---
title: Static Site Image Gallery
---

I wanted to share some pictures with friends but MMS/discord/any other way I could send it always had limits, so to the web we go.

I didn't look too hard and stumbled on [sigal](https://github.com/saimn/sigal), which felt like a good enough stop gap until I feel like writing my own static site, relative friendly, symlink based gallery generator.

lil makefile with a (annoying) workaround to make the symlinks work nicely on the remote machine:

```make
all: build sync build_remote
build:
	# make sure to use orig_link in config file to use symlinks!
	sigal build -c trip.conf.py inputs/backpacking trip
build_remote:
	# to fix symlinks, bleh
	retry -- ssh vultr 'source ~/.bashrc && source ~/vps/server.sh && cd ./static_files/gallery && make build'
sync:
	retry -- rsync -Pavh --links "$(realpath .)/" vultr:static_files/gallery --delete-after
clean:
	rm -rf trip
```

Uses [`retry`](https://github.com/kadwanev/retry) in-case the ssh connection fails while its syncing with `rsync`.

and a little block added to my nginx config:

```nginx
location /gallery/ {
  alias /home/user/static_files/gallery/;  # location
  try_files $uri $uri/ =404;
  autoindex off;
}
```
