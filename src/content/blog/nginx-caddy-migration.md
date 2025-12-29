---
title: "Devlog: nginx to caddy migration"
description: Migrating my mess of a nginx config to caddy
pubDate: 2025/12/25
---

I recently made the switch from [`nginx`](https://nginx.org/en/) to [`caddy`](https://caddyserver.com/), so I thought I'd document some of the weirder workarounds I ended up doing, as I couldn't find examples for them online.

Here are (most of) both of them in full, I'll show some of the patterns I used commonly below:

<details>
<summary>nginx config</summary>

```nginx
include /etc/nginx/modules-enabled/\*.conf;

http {

    default_type application/octet-stream;

    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    include /etc/nginx/conf.d/*.conf;
    server {
        if ($host = www.purarue.xyz) {
            return 301 https://$host$request_uri;
        } # managed by Certbot

        if ($host = purarue.xyz) {
            return 301 https://$host$request_uri;
        } # managed by Certbot

        listen 80 default_server;
        listen [::]:80 default_server;

        server_name www.purarue.xyz purarue.xyz;
        return 301 https://purarue.xyz$request_uri;
    }

    server {
        listen [::]:443 ssl default_server;
        listen 443 ssl default_server;
        server_name www.purarue.xyz;
        ssl_certificate /etc/letsencrypt/live/purarue.xyz/fullchain.pem; # managed by Certbot
        ssl_certificate_key /etc/letsencrypt/live/purarue.xyz/privkey.pem; # managed by Certbot
        include /etc/letsencrypt/options-ssl-nginx.conf;
        ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

        rewrite ^/(.\*) https://purarue.xyz/$1 permanent;

    }

    server {
        listen [::]:443 ssl http2 ipv6only=on;
        listen 443 ssl;
        ssl_certificate /etc/letsencrypt/live/purarue.xyz/fullchain.pem; # managed by Certbot
        ssl_certificate_key /etc/letsencrypt/live/purarue.xyz/privkey.pem; # managed by Certbot
        include /etc/letsencrypt/options-ssl-nginx.conf;
        ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

        index index.html;
        server_name purarue.xyz;

        underscores_in_headers on;

        root /home/user/static_files;
        # base phoenix server

        location @phoenix {
            include /etc/nginx/pheonix_params;
            proxy_pass http://localhost:8082;
        }

        error_page 502 @offline;
        location @offline {
            try_files /502.html 502;
        }

        # if the path doesn't match some static file, forward to @phoenix server

        location / {
            try_files $uri $uri/index.html @phoenix;
        }

        location ~ ^(/remote/logincheck|wp-login.php).\*$ {
            return 404;
        }

        include /etc/nginx/sites-enabled/\*;

        error_page 400 /error_html/400.html;
        error_page 401 /error_html/401.html;
        error_page 402 /error_html/402.html;
        error_page 403 /error_html/403.html;
        error_page 404 /error_html/404.html;
        error_page 405 /error_html/405.html;
        error_page 406 /error_html/406.html;
        error_page 407 /error_html/407.html;
        error_page 408 /error_html/408.html;
        error_page 409 /error_html/409.html;
        error_page 410 /error_html/410.html;
        error_page 411 /error_html/411.html;
        error_page 412 /error_html/412.html;
        error_page 413 /error_html/413.html;
        error_page 414 /error_html/414.html;
        error_page 415 /error_html/415.html;
        error_page 416 /error_html/416.html;
        error_page 417 /error_html/417.html;
        error_page 418 /error_html/418.html;
        error_page 421 /error_html/421.html;
        error_page 422 /error_html/422.html;
        error_page 423 /error_html/423.html;
        error_page 424 /error_html/424.html;
        error_page 425 /error_html/425.html;
        error_page 426 /error_html/426.html;
        error_page 428 /error_html/428.html;
        error_page 429 /error_html/429.html;
        error_page 431 /error_html/431.html;
        error_page 451 /error_html/451.html;
        error_page 500 /error_html/500.html;
        error_page 501 /error_html/501.html;
        error_page 503 /error_html/503.html;
        error_page 504 /error_html/504.html;
        error_page 505 /error_html/505.html;
        error_page 506 /error_html/506.html;
        error_page 507 /error_html/507.html;
        error_page 508 /error_html/508.html;
        error_page 510 /error_html/510.html;
        error_page 511 /error_html/511.html;

    }

    # ========== ANIMESHORTS ===================
    rewrite ^/animeshorts$ /animeshorts/ permanent;
    location /animeshorts {
        # capture entire URL, if it ends with .html
        if ($request_uri ~ ^/(.*)\.html$) {
            # return the first capture group
            return 302 /$1;
        }
        try_files $uri $uri.html $uri/ @phoenix;
    }

    # ============ CLIPBOARD ==================
    location /clipboard/ {
        add_header "Access-Control-Allow-Origin"  *;
        proxy_pass http://127.0.0.1:5025/;
    }

    # ========== CURRENTLY LISTENING ===========
    location /currently_listening/ {
        add_header "Access-Control-Allow-Origin"  *;
        proxy_http_version 1.1;
        proxy_set_header X-Cluster-Client-Ip $remote_addr;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_pass http://127.0.0.1:3030/;
    }

    # =============== DBSENTINEL ================
    rewrite ^/dbsentinel$ /dbsentinel/ permanent;
    # uses elixir/phoenix
    location /dbsentinel/ {
        include /etc/nginx/pheonix_params;
        proxy_pass http://127.0.0.1:4600/dbsentinel/;
    }

    # ============= DOTFILES =============
    # don't include fallback here, 404 means something here
    location /d/ {
        proxy_pass http://127.0.0.1:8050/;
    }

    # ============== DVD =================
    rewrite ^/dvd$ /dvd/ permanent;
    location /dvd/ {
        try_files $uri $uri/ @phoenix;
    }

    # =========== FEED ===================
    rewrite ^/feed$ /feed/ permanent;
    location /feed/ {
        proxy_pass http://127.0.0.1:4500/feed;
    }
    location /feed/_next/ {
        # required since the above proxy pass doesn't end with '/'
        proxy_pass http://127.0.0.1:4500/feed/_next/;
    }
    location /feed_api/ {
        proxy_pass http://127.0.0.1:5100/;
    }

    # =========== GEOCITIES ================
    rewrite ^/geocities$ /geocities/ permanent;
    location /geocities/ {
        try_files $uri $uri/ @phoenix;
    }

    # ============== MAL UNAPPROVED =============
    location /mal_unapproved/ {
        include /etc/nginx/pheonix_params;
        proxy_pass http://127.0.0.1:4001/mal_unapproved/;
    }
    location /mal_unapproved/api/ {
        include /etc/nginx/pheonix_params;
        add_header "Access-Control-Allow-Origin"  *;
        proxy_pass http://localhost:4001/mal_unapproved/api/;
    }

    # =========== PROJECTS =====================
    rewrite ^/projects$ /projects/ permanent;
    location /projects/ {
        proxy_pass http://127.0.0.1:3000/projects;
    }
    location /projects/_next/ {
        # required since the above proxy pass doesn't end with '/'
        proxy_pass http://127.0.0.1:3000/projects/_next/;
    }

    # =========== PUBLIC REMSYNC ===========
    rewrite ^/p$ /p/ permanent;
    location /p/ {
        alias /home/user/p/;
        try_files $uri $uri/ @phoenix;
        autoindex on;
        autoindex_exact_size off;
        autoindex_localtime on;
        add_header "Access-Control-Allow-Origin"  *;
        expires 1h;
        add_header Cache-Control "public";
    }

    # ======= PRIVATE REMSYNC =========
    rewrite ^/f$ /f/ permanent;
    location /f/ {
      alias /home/user/f/;

      # dont serve directories
      try_files $uri @phoenix;
      autoindex off;

      # make sure files are downloaded instead of viewed
      expires -1;
      default_type application/octet-stream;
    }

    # ============== CONFIG/UTILS =================
    location /c/ {
        proxy_pass http://127.0.0.1:8051/;
    }

    # ============== DASHBOARD ====================
    location /dashboard/ {
        include /etc/nginx/pheonix_params;
        proxy_pass http://127.0.0.1:8082/dashboard/;
        auth_basic "for glue dashboard!";
        auth_basic_user_file /etc/nginx/.htpasswd;
    }

    # ============ SHORTURL =======================
    location /s/ {
        proxy_pass http://127.0.0.1:8040/;
    }

    # ============= EXOBRAIN/RSS ===================
    rewrite ^/x$ /x/ permanent;
    rewrite ^/rss$ /x/rss.xml permanent;
    rewrite ^/rss.xml$ /x/rss.xml permanent;
    rewrite ^/sitemap.xml$ /x/sitemap-index.xml permanent;
    rewrite ^/blog /x/blog/ permanent;

    location /x {
        try_files $uri $uri.html $uri/ =404;
        error_page 404 /x/404.html;
        index index.html;
    }

    location /x/notes/personal {
        try_files $uri $uri.html $uri/ =404;
        error_page 404 /x/404.html;
        index index.html;

        auth_basic "personal notes";
        auth_basic_user_file /etc/nginx/.htpasswd;
    }

    # ============= XKCD ===============
    rewrite ^/xkcd$ /xkcd/ permanent;
    location /xkcd/ {
      try_files $uri $uri/ @phoenix;
    }
}
```

</details>

<details>
<summary>caddy config</summary>

```caddy
www.purarue.xyz {
	redir https://purarue.xyz{uri}
}

purarue.xyz {
	encode # default gzip/zstd encoding

	log {
		output file /var/log/caddy/access.log
	}

	# ========== ANIMESHORTS ==========
	redir /animeshorts /animeshorts/ permanent
	handle_path /animeshorts* {
		root /home/user/static_files/animeshorts/
		try_files {path} {path}.html {path}/ =404
	}

	# ========== CLIPBOARD ==========
	handle_path /clipboard/* {
		header Access-Control-Allow-Origin "*"
		reverse_proxy http://127.0.0.1:5025
	}

	# ========== CURRENTLY LISTENING ==========
	handle_path /currently_listening/* {
		header Access-Control-Allow-Origin "*"
		reverse_proxy http://127.0.0.1:3030
	}

	# ========== DBSENTINEL ==========
	redir /dbsentinel /dbsentinel/ permanent
	handle_path /dbsentinel/* {
		rewrite * /dbsentinel{path}
		reverse_proxy http://127.0.0.1:4600
	}

	# ========== DOTFILES ==========
	redir /d /d/ permanent
	handle_path /d/* {
		reverse_proxy http://127.0.0.1:8050
	}

	# ========== DVD ==========
	redir /dvd /dvd/ permanent
	handle_path /dvd* {
		root /home/user/static_files/dvd/
		try_files {path} {path}/ =404
	}

	# ========== FEED ==========
	redir /feed /feed/ permanent
	handle_path /feed/* {
		rewrite * /feed{path}
		reverse_proxy http://127.0.0.1:4500
	}
	handle_path /feed_api/* {
		reverse_proxy http://127.0.0.1:5100
	}

	# ========== GEOCITIES ==========
	redir /geocities /geocities/ permanent
	handle_path /geocities* {
		root /home/user/static_files/geocities
		try_files {path} {path}/ =404
	}

	# ========== MAL UNAPPROVED ==========
	handle_path /mal_unapproved/* {
		rewrite /mal_unapproved{path}
		reverse_proxy http://127.0.0.1:4001
	}
	handle_path /mal_unapproved/api/* {
		rewrite /mal_unapproved/api{path}
		header Access-Control-Allow-Origin "*"
		reverse_proxy http://localhost:4001
	}

	# ========== PROJECTS ==========
	redir /projects /projects/ permanent
	handle_path /projects/* {
		rewrite /projects{path}
		reverse_proxy http://127.0.0.1:3000
	}

	# ========== PUBLIC REMSYNC ==========
	redir /p /p/ permanent
	handle_path /p/* {
		root /home/user/p/
		header Access-Control-Allow-Origin "*"
		header Cache-Control max-age=3600
		file_server browse
	}

	# ========== PRIVATE REMSYNC ================
	handle_path /f/* {
		root /home/user/f/
		try_files {path} =404
	}

	# ========== CONFIG/UTILS ==========
	handle_path /c/* {
		reverse_proxy http://127.0.0.1:8051
	}

	# ========== DASHBOARD ==========
	handle_path /dashboard/* {
		rewrite /dashboard{path}
		reverse_proxy http://127.0.0.1:8082
		basicauth {
			user $<redacted_password_hash>
		}
	}

	# ========== SHORTURL ==========
	handle_path /s/* {
		reverse_proxy http://127.0.0.1:8040
	}

	# ========== EXOBRAIN/RSS ==========
	redir /x /x/ permanent
	redir /rss /x/rss.xml permanent
	redir /rss.xml /x/rss.xml permanent
	redir /sitemap.xml /x/sitemap-index.xml permanent
	redir /blog /x/blog/ permanent
	handle_path /x* {
		root /home/user/static_files/x/
		try_files {path} {path}.html {path}/ 404.html
	}
	handle_path /x/notes/personal* {
		root /home/user/static_files/x/notes/personal/
		try_files {path} {path}.html {path}/ 404.html
		basicauth {
			notes $<redacted_password_hash>
		}
	}

	# ========== XKCD ==========
	redir /xkcd /xkcd/ permanent
	handle_path /xkcd* {
		root /home/user/static_files/xkcd/
		try_files {path} {path}.html {path}/ =404
		file_server
	}

	@blockLogin path /remote/logincheck* /wp-login.php*
	respond @blockLogin 404

	handle_errors {
		root /home/user/static_files/error_html/
		@custom_err file /{err.status_code}.html
		handle @custom_err {
			rewrite * {file_match.relative}
			file_server
		}

		# fallback
		rewrite * 500.html
		file_server
	}

	# ========== FALLBACK STATIC ========
	root /home/user/static_files/
	file_server

	# ========== GLUE FALLBACK ==========
	handle {
		reverse_proxy http://localhost:8082
	}
}

# Refer to the Caddy docs for more information:
# https://caddyserver.com/docs/caddyfile
```

</details>

I run something like 15 different servers/static websites on here, some of them are just APIs, some are full webapps that are deployed under a different URL, some are just static files.

### APIs

For an API, which doesn't have to care about things like relative links/asset paths, it was pretty easy:

`nginx`:

```nginx
# ============ CLIPBOARD ==================
location /clipboard/ {
    add_header "Access-Control-Allow-Origin" *;
    proxy_pass http://127.0.0.1:5025/;
}
```

`caddy`:

```nginx
handle_path /clipboard/* {
	header Access-Control-Allow-Origin "*"
	reverse_proxy http://127.0.0.1:5025
}
```

## Basic Static Website

pretty straightforward as well:

`nginx`:

```nginx
rewrite ^/animeshorts$ /animeshorts/ permanent;
location /animeshorts {
    # capture entire URL, if it ends with .html
    if ($request_uri ~ ^/(.*)\.html$) {
        # return the first capture group
        return 302 /$1;
    }
    try_files $uri $uri.html $uri/ @phoenix;
}
```

`caddy`:

```nginx
redir /animeshorts /animeshorts/ permanent
handle_path /animeshorts* {
	root /home/user/static_files/animeshorts/;
	try_files {path} {path}.html {path}/ =404
}
```

<span style="font-size: 1rem">[semicolons aren't required in caddy, I just included them to trick the highlighting engine into giving it some nicer colors]</span>

### Websites

For websites which have both frontend/backend pages, and CSS/JS, I deploy those at a subpath, like:

- <https://purarue.xyz/dbsentinel/>
- <https://purarue.xyz/dbsentinel/search>

When I wrote webapps like those, [I added a bit of config](https://github.com/purarue/dbsentinel/blob/2f56a2c75922c8cbfaa62fdccfa2aee6374117fa/frontend/config/config.exs#L13) to the webserver itself, to prefix all the URLs with `/dbsentinel` so CSS/URLs can all use absolute URLs (e.g. `/dbsentinel/search/...`) instead of relative ones (`../search/`), they were never meant to be deployed at the base of the domain.

`nginx`:

```nginx
rewrite ^/dbsentinel$ /dbsentinel/ permanent;
location /dbsentinel/ {
    proxy_pass http://127.0.0.1:4600/dbsentinel/;
}
```

`caddy`:

```nginx
redir /dbsentinel /dbsentinel/ permanent;
handle_path /dbsentinel/* {
	rewrite * /dbsentinel{path};
	reverse_proxy http://127.0.0.1:4600;
}
```

The important bit here is the `rewrite * /dbsentinel{path}`, as `caddy` does not allow the `reverse_proxy` to have any trailing paths like `nginx`'s `proxy_pass` does.

### Static Files/Errors

The most involved rewrite was my [blog/notes](https://github.com/purarue/exobrain) site, which deploys as a static site at [purarue.xyz/x](https://purarue.xyz/x).

`nginx`:

```nginx
location /x {
    try_files $uri $uri.html $uri/ =404;
    error_page 404 /x/404.html;  # custom error page
    index index.html;
}

# personal notes, password protected
location /x/notes/personal {
    try_files $uri $uri.html $uri/ =404;
    error_page 404 /x/404.html;
    index index.html;

    # password protected using HTTP Basic Authentication
    auth_basic "personal notes";
    auth_basic_user_file /etc/nginx/.htpasswd;
}

# manually defined custom error pages, generated using https://github.com/purarue/darker_errors
error_page 400 /error_html/400.html;
error_page 401 /error_html/401.html;
error_page 402 /error_html/402.html;
error_page 403 /error_html/403.html;
...
```

`caddy` handles errors slightly differently than `nginx`. There is the option to use the [`handle_errors`](https://caddyserver.com/docs/caddyfile/directives/handle_errors) block to globally handle things (which I did attempt with some custom expressions matchers to filter like `@is_x expression {http.request.uri.path}.startsWith('/x') && {err.status_code} == 404`, but after hours of debugging why the request context wasn't working how I expected, I realized I could just set `404.html` as the last argument to `try_files` instead of `=404`, which then doesn't forward it to the `handle_errors` block:

`caddy`:

```nginx
handle_path /x* {
    root /home/user/static_files/x/;
    # note: this does mean that it doesn't return an actual 404 status
    # code, but I'm okay with this as a hack for now
    try_files {path} {path}.html {path}/ 404.html;
}

# personal notes, password protected
handle_path /x/notes/personal* {
    root /home/user/static_files/x/notes/personal/;
    basicauth {
        user $<redacted_password_hash>;
    }
    # since this has a different root, I did add a to my site build:
    # 'cp dist/404.html dist/notes/personal/404.html'
    try_files {path} {path}.html {path}/ 404.html;
}

handle_errors {
    root /home/user/static_files/error_html/;
    # dynamically map the err.status_code to the corresponding file (if it exists)
    @custom_err file /{err.status_code}.html;
    handle @custom_err {
        rewrite * {file_match.relative};
        file_server;
    }

    # fallback in-case it couldn't find a matching error file
    rewrite * 500.html;
    file_server;
}
```

This is all so that if you're viewing a 404 like [purarue.xyz/x/doesnt_exist](https://purarue.xyz/x/doesnt_exist), it uses the custom 404 instead of looking like [this](https://purarue.xyz/doesnt_exist).

---

.. and that's it! Caddy does seem pretty cool, and I'm glad I don't have to mess with `SSL` certificates or set a bunch of things which feel like they should be defaults in the modern web. The [file browser](https://purarue.xyz/p/) is a big upgrade from the `nginx` `autoindex` module as well :)
