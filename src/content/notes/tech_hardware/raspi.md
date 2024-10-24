---
title: Raspberry Pi Notes
---

General Notes on setting up a raspberry pi.

### Basic Install:

- Download the minimal install of `NOOBS` from [here](https://www.raspberrypi.org/downloads/noobs/)
- Format the microSD card as FAT32, and put the files from the NOOBS download into the root directory (dont need to flash/etcher)
- Install the Base NOOBS Debian Image, without any of the recommended applications.

### General Config

- Run my <https://github.com/purarue/bootstrap> script
- `sudo raspi-config` to setup network; enable `ssh` (Interfacing Options)

Once everything is configured, `sudo raspi-config` > Boot Options > Desktop/CLI > Console Autologin, to run the pi as headless.

### Mount a Hard Drive (automatic mounting):

Pretty much just have to put the correct line into `/etc/fstab`. See [here](https://www.raspberrypi.org/documentation/configuration/external-storage.md) for instructions.

If you want to put it at `/home/data`, instead of `/mnt/something` like that page describes:

```
sudo mkdir -p /home/data
sudo mount /dev/... /home/data
# to get UUID
sudo blkid
sudo nano /etc/fstab
UUID=<blkid> <location> <FSTYPE> defaults,nofail 0 0
e.g.
UUID=fbfb6131-f332461	/home/data	ext4 defaults,nofail 0 0
```

`man fstab`: the `defaults` option: `rw`, `suid`, `dev`, `exec`, `auto`, `nouser`, and `async`.

[What the numbers at the end of the `/etc/fstab` mean](https://unix.stackexchange.com/a/17726/282432)

- First 0: `dump` shouldn't make backups
- Second 0: `fsck` should not run a check on this drive
