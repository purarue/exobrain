---
title: Personal Server Setup
description: A devlog of me setting up my personal server
pubDate: 2020/06/12
---

Recently I've been playing with VMs/VPSs as web servers, so I've been setting up lots of servers. This is both to self-document what I've been doing, and maybe it gives someone a new tool to use.

Setup the VM however with whatever you'd like. I've been a fan of debian on the server recently.

1. `ssh root@<ip-addr>`
2. create a user for me and give me `sudo` privileges

```shell
# my terminal doesn't have the best terminfo support out of the box; default to xterm-256color
export TERM=xterm-256color
adduser sean
usermod -aG sudo sean
```

If needed, create the `.ssh` directory with perms

```
su - sean  # switch to user
cd
chmod go-w ~/
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

3. create a ssh key (`ssh-keygen -t rsa -b 4096 -o -a 100`) for connecting to the server, `ssh-copy-id` it up to the server

`ssh-copy-id -i ~/.ssh/file sean@<ip-addr>`

4. Add the block for the server to my `~/.ssh/config` file:

```
Host vps
  User sean
  Hostname <server ip>
  IdentityFile ~/.ssh/private_key
```

Then I can just connect with `ssh vps`

5. `ssh` onto the server and run my [`bootstrap`](https://github.com/purarue/bootstrap/) script:
   That sets up some bash defaults: aliases, `neovim` configuration, installs [`fzf`](https://github.com/junegunn/fzf), prompts me to setup Github username/email.

```
sudo apt install neovim git curl
bash -c "$(curl -fsSL https://raw.githubusercontent.com/purarue/bootstrap/master/bootstrap)"
```

6. Strengthen `ssh` configuration: disable root login, password authentication (have to use ssh-key). Make sure the following lines exist and are uncommented in `/etc/ssh/sshd_config`:

```
ChallengeResponseAuthentication no
PasswordAuthentication no
UsePAM no
PermitRootLogin no
```

6b. May have to setup `ufw`, to setup ports

```shell
# apt install ufw
ufw allow 22
ufw allow 80
ufw allow 443
ufw enable
ufw status
ufw reload
```

Reload ssh: `sudo systemctl reload ssh`

7. Setup a gitlab/github ssh key and start an `ssh-agent`, but dont '`eval ssh-agent`' every time you log in, just the first time, by putting this in `~/.bash_profile`:

```shell
if [ ! -S ~/.ssh/ssh_auth_sock ]; then
  eval `ssh-agent`
  ln -sf "$SSH_AUTH_SOCK" ~/.ssh/ssh_auth_sock
fi
export SSH_AUTH_SOCK=~/.ssh/ssh_auth_sock
ssh-add -l > /dev/null || ssh-add ~/.ssh/github
```

8. Install `nginx`:

Just the base installation for now, test it by going to the IP address in the browser to make sure firewall is properly configured.

`sudo apt install nginx`

This is heavily modified after my applications are set up, see below.

9. Install lots of things to configure my applications/webapps, see [vps](https://github.com/purarue/vps):

```shell
# setup docker
sudo apt-get install apt-transport-https ca-certificates curl gnupg2 software-properties-common
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo apt-key add –
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/debian buster stable"
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io
sudo groupadd docker
sudo usermod -aG docker "$(whoami)"
sudo systemctl restart docker
docker run hello-world  # test connection to docker socket, may require a restart/relog

# setup postgresql
sudo apt install postgresql postgresql-client
sudo su
su postgres
adduser glue_worker # primarily used for my elixir server
createuser --pwprompt glue_worker
createdb -O glue_worker glue_db
psql -d glue_db -h localhost -U glue_worker # test connection

# rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# node/npm
curl -sL 'https://deb.nodesource.com/setup_14.x' | sudo bash -
sudo apt install nodejs

# lots of other apt installs
sudo apt update
sudo apt install python3.7 docker-compose pipenv supervisor jq elixir erlang-inets erlang-dev \
    erlang-parsetools erlang-xmerl rsync goaccess apache2-utils fail2ban libssl-dev \
    htop tree unzip

# Set up environment (put this in ~/.bash_profile):
# NPM global packages are put in ~/.local/share/npm-packages to avoid permission errors/requiring sudo to install npm packages
export NPM_CONFIG_PREFIX="${HOME}/.local/share/npm-packages"
PATH="$HOME/.rvm/rubies/ruby-2.7.0/bin:$HOME/.cargo/bin:$HOME/vps:$HOME/.local/bin:$NPM_CONFIG_PREFIX/bin:$PATH"
export PATH
# rvm automatically adds its rvm function to ~/.bash_profile

# re-source/relog in to source environment variables in ~/.bash_profile; now that npm dir is set, install global npm packages
npm install -g uglifycss elm html-minifier

# install ranger for some nicer file management, and speedtest-cli in case I want to check network speed
pip3 install --user --upgrade ranger-fm speedtest-cli

# add myself to the adm group so that I have permission to view logs at /var/log/ without sudo
sudo usermod -aG adm "$(whoami)"

# Run my `vps_install` script to setup all of my application data/verify I have all of my packages installed: https://github.com/purarue/vps
# sets up logging for all my applications, centralizes that in ~/logs, sets up basic HTTPAuth for nginx using apache2-utils, sets up supervisor for process management
git clone git@github.com:purarue/vps ~/vps
cd ~/vps
./vps_install  # clone/setup all my applications
./generate_static_sites  # clone/generate all my static sites
```

10. Setup my DNS info on my domain name registrar, point it to the IP address of the VPS, follow instructions to set up [`certbot`](https://certbot.eff.org/instructions) for `HTTPS`:

Make sure the `server_name` directive exists in the `server` block running on port 80 in `/etc/nginx/sites-available/default` before trying to do `certbot`, so it can grab the domain name from there.

```shell
sudo apt install certbot python-certbot-nginx
sudo certbot --nginx
sudo certbot renew --dry-run # test renewal
```

11. Disable `logrotate` for certain logs. I'm not a fan of it rotating to the `.tar.gz` files, I prefer to have the one giant log file to I can parse/script with it easier.

I do this for `/var/log/auth.log`, `nginx` and `fail2ban`:

```shell
cd /etc/logrotate.d/
sudoedit rsyslog  # remove auth
sudo mv nginx nginx.disabled
sudo mv fail2ban fail2ban.disabled
```

12. Setup the basic nginx server blocks to have nginx redirect from HTTP to HTTPS and from my [https://www.sean.fish](https://www.sean.fish) to just [https://sean.fish](https://sean.fish). In `/etc/nginx/sites-available/default`:

```shell
# redirect from HTTP to HTTPS
server {
  listen 80 default_server;
  listen [::]:80 default_server;
  server_name _;
  return 301 https://$host$request_uri;
}

# redirect from www to non-www URL
server {
  listen 443 ssl;
  server_name www.sean.fish;
  ssl_certificate /etc/letsencrypt/live/sean.fish/fullchain.pem; # managed by Certbot
  ssl_certificate_key /etc/letsencrypt/live/sean.fish/privkey.pem; # managed by Certbot
  include /etc/letsencrypt/options-ssl-nginx.conf;
  ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

  rewrite ^/(.*) https://sean.fish/$1 permanent;
}

server {

  listen [::]:443 ssl http2 ipv6only=on;
  listen 443 ssl;
  ssl_certificate /etc/letsencrypt/live/sean.fish/fullchain.pem; # managed by Certbot
  ssl_certificate_key /etc/letsencrypt/live/sean.fish/privkey.pem; # managed by Certbot
  include /etc/letsencrypt/options-ssl-nginx.conf;
  ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

	root /var/www/html;
	index index.html;
	server_name sean.fish;

# .... location blocks continued for different servers
}
```

Its also possible to configure this at the `DNS` level using a `CNAME`, but I like being able to see which requests are getting redirected/whose going to `www` in my nginx logs.

13. Configure `linux`/`nginx` for better performance/more connections/open files (especially since I use phoenix as my main server):

```shell
## /etc/nginx/nginx.conf
# at the top
worker_rlimit_nofile 37268;
events {
    worker_connections 37268;
}

## /etc/security/limits.conf
# at the bottom
* soft nofile 37268
* hard nofile 37268
root soft nofile 37268
root hard nofile 37268

## /etc/systemd/system.conf
# uncomment this line and set to:
DefaultLimitNOFILE=37268

# In both of these files:
## /etc/pam.d/common-session
## /etc/pam.d/common-session-noninteractive
# at the bottom, add:
session required pam_limits.so
```

Restart the system, and check that `nginx`'s file limit has increased:

`ps -ef | grep nginx`

`cat /proc/<nginx_pid>/limits`

14. Setup `fail2ban` to stop unauthorized ssh attempts/temporarily banning suspicious behavior. I pretty much followed [this tutorial](https://www.digitalocean.com/community/tutorials/how-to-protect-an-nginx-server-with-fail2ban-on-ubuntu-14-04), and enabled [this badbots filter](https://gist.github.com/dale3h/660fe549df8232d1902f338e6d3b39ed). Remember to whitelist your own IP:

`ignoreip = 127.0.0.1 ::1 <your public ipv4 address>`

15. Setup some server monitoring.

Install [`netdata`](https://www.netdata.cloud/) and [my fork of `superhooks`](https://github.com/purarue/superhooks) (in my `supervisord.conf` in my [vps repo](https://github.com/purarue/vps)) for server and [`supervisor`](https://github.com/Supervisor/supervisor) process monitoring respectively:

```
bash <(curl -Ss https://my-netdata.io/kickstart.sh)
```

I use the [`go` module for nginx](https://learn.netdata.cloud/docs/agent/tutorials/collect-apache-nginx-web-logs/), and use webhooks for discord ([netdata docs](https://learn.netdata.cloud/docs/agent/health/notifications/discord/)), to get notifications whenever something goes wrong on my server (e.g. high CPU usage, too many 300x/400x requests, an application using too much ram, lots of other alerts that come default with netdata...), and whenever one of my supervisor processes unexpectedly crashes.

Both `netdata` and [`goaccess`](https://goaccess.io/) (nginx log parser) are password protected with `apache2-utils`'s `htpasswd`, which is setup in `vps_install`. To set it up:

`sudo htpasswd -c /etc/nginx/.htpasswd sean`, and then on the routes:

```
location /logs {
  alias /home/username/.goaccess_html;
  try_files $uri $uri/ =404;
  auth_basic "for logs!";
  auth_basic_user_file /etc/nginx/.htpasswd;
}

location /netdata/ {
  proxy_pass http://127.0.0.1:19999/;
  auth_basic "for netdata!";
  auth_basic_user_file /etc/nginx/.htpasswd;
}
```

References:

- [https://www.cyberciti.biz/faq/how-to-disable-ssh-password-login-on-linux/](https://www.cyberciti.biz/faq/how-to-disable-ssh-password-login-on-linux/)
- [https://github.com/junegunn/fzf](https://github.com/junegunn/fzf)
- [https://unix.stackexchange.com/questions/90853/how-can-i-run-ssh-add-automatically-without-a-password-prompt](https://unix.stackexchange.com/questions/90853/how-can-i-run-ssh-add-automatically-without-a-password-prompt)
- [https://phoenixnap.com/kb/how-to-install-docker-on-debian-10](https://phoenixnap.com/kb/how-to-install-docker-on-debian-10)
- [https://linuxize.com/post/how-to-install-node-js-on-debian-10/](https://linuxize.com/post/how-to-install-node-js-on-debian-10/)
- [https://certbot.eff.org/lets-encrypt/debianbuster-nginx](https://certbot.eff.org/lets-encrypt/debianbuster-nginx)
- [https://www.youtube.com/watch?v=Vrzug5IcuKg](https://www.youtube.com/watch?v=Vrzug5IcuKg)
- [https://www.digitalocean.com/community/tutorials/how-to-protect-an-nginx-server-with-fail2ban-on-ubuntu-14-04](https://www.digitalocean.com/community/tutorials/how-to-protect-an-nginx-server-with-fail2ban-on-ubuntu-14-04)
- [https://gist.github.com/dale3h/660fe549df8232d1902f338e6d3b39ed](https://gist.github.com/dale3h/660fe549df8232d1902f338e6d3b39ed)
- [https://docs.nginx.com/nginx/admin-guide/security-controls/configuring-http-basic-authentication/](https://docs.nginx.com/nginx/admin-guide/security-controls/configuring-http-basic-authentication/)
