---
title: "Devlog: Sonic Pi"
pubDate: 2020/09/21
description: Issues installing sonic-pi on arch
---

Me documenting my issues installing [`sonic-pi`](https://github.com/sonic-pi-net/sonic-pi/blob/5a25d300e41668adee865ff361208cc84c2e647a/BUILD-LINUX.md) on arch.

<https://github.com/purarue/sonic_pi_music>

For context, I use pulseaudio, not alsa.

After running: `yay -S sonic-pi`

The default `sonic-pi` package from community failed to launch because of JACK errors; [errorlog](https://gist.github.com/purarue/99fa2e3d94d30b3193a903634990f06f)

```
JACK is running in realtime mode, but you are not allowed to use realtime scheduling.
Please check your /etc/security/limits.conf for the following line
and correct/add it if necessary:

  @audio          -       rtprio          99

After applying these changes, please re-login in order for them to take effect.

You don't appear to have a sane system configuration. It is very likely that you
encounter xruns. Please apply all the above mentioned changes and start jack again!
connect(2) call to /dev/shm/jack-1000/default/jack_0 failed (err=No such file or directory)

JACK is running in realtime mode, but you are not allowed to use realtime scheduling.
Please check your /etc/security/limits.conf for the following line
and correct/add it if necessary:

  @audio          -       rtprio          99

After applying these changes, please re-login in order for them to take effect.``
```

After adding that line to `/etc/security/limits.conf` and restarting, it errored with:

```
JACK is running in realtime mode, but you are not allowed to use realtime scheduling.

Your system has an audio group, but you are not a member of it.
Please add yourself to the audio group by executing (as root):
  usermod -a -G audio sean
```

So, I ran: `sudo usermod -aG audio "$(whoami)"`

Should be noted that the [arch wiki](https://wiki.archlinux.org/index.php/JACK_Audio_Connection_Kit) says to instead manually add your user to the `realtime` group, but sonic-pi needs you to be running this manually, so, not going to do that.

After restarting:

```
$ groups
docker users video audio wheel
```

After that, running `sonic-pi` causes this error:

```
connect(2) call to /dev/shm/jack-1000/default/jack_0 failed (err=No such file or directory)
could not open driver .so '/usr/lib/jack/jack_net.so': libcelt0.so.2: cannot open shared object file: No such file or directory

could not open driver .so '/usr/lib/jack/jack_firewire.so': libffado.so.2: cannot open shared object file: No such file or directory
```

I use `pulseaudio` instead of `alsa`. Seems that `JACK` works better with `alsa` (i.e. it has a backend for it, see `man jackd`).

Doesn't seem that there's a jack daemon running in the background, not sure if there should be:

```
[ ~ ] $ ps -ef | grep jack
sean        1959    1934  0 11:14 pts/9    00:00:00 grep jack
```

I found the solution to this on [this](https://github.com/sonic-pi-net/sonic-pi/issues/1908) issue; which is to run `jackd` and `qjackctl` manually:

```
$ cat "$(which sonic-pi-run)"

#!/bin/bash

jackd -R -d alsa -d hw:1 &
qjackctl &  # (yay -S qjackctl)
# wait for jackd and qjackctl to be up
sleep 5
sonic-pi # block

# kill background jobs
kill -15 $(jobs -p)
```

If something is already using `hw:1` (e.g. you have `mpv` playing some audio), this causes `jackd` to not be able to use `hw:1`, so it fails to acquire that, and `sonic-pi` fails with an error again.

Without `qjackctl`, it seems that this causes `pulseaudio` to break... ? and it becomes 'dummy output':

![](./images/pulseaudio.png)

So, what I typically do is:

- make sure I've used `pulseaudio` at least once since the computer has started (just play some song in `mpv` and then quit)
- quit everything that is using `pulseaudio` actively
- run `sonic-pi-run` (the script above)

And then, when I exit, `pulseaudio` takes back over.

Success!

Downsides:

- Have to be a bit careful about mistakenly opening multiple instances of `sonic-pi`. If I open it and then quit quickly, something may have been acquired but not released, which causes `pulseaudio` to become 'dummy output', or jack to fail to acquire `hw:1`.
- 'breaks' system audio/`pulseaudio` while sonic-pi is open, so its the only thing that can use audio

References:

- <https://github.com/sonic-pi-net/sonic-pi/issues/849>
- <https://www.miskatonic.org/2015/01/17/setting-up-sonic-pi-on-ubuntu/>
- <https://github.com/sonic-pi-net/sonic-pi/issues/1908>
