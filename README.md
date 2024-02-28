Live at <https://sean.fish/x/>

Any code here is licensed under the MIT license, see [LICENSE](./LICENSE), feel free to steal whatever.

Any notes/blog posts/prose are licensed under the [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) license.

This uses [astro's content collections](https://docs.astro.build/en/tutorials/add-content-collections/), which is how all the markdown/template rendering happens.

Search works using [stork](https://stork-search.net/) - that builds an index at buildtime and using wasm on the frontend to search

Other than that, the [launch_in_editor](./scripts/launch_in_editor.go) client/server code will ping the localhost server running locally on my machine whenever I'm viewing any webpage with content, adding a button so I can quickly edit something if I want to:

<video src="https://github.com/seanbreckenridge/exobrain/assets/7804791/7ab04b7e-8471-48b2-97ca-4779dd0d6e33" width=400></video>

I deploy this to my site at `/x/`, with nginx:

```
rewrite ^/x$ /x/ permanent;
rewrite ^/rss.xml /x/rss.xml permanent;
rewrite ^/sitemap.xml$ /x/sitemap-index.xml permanent;

location /x {
  try_files $uri $uri.html $uri/ =404;
  error_page 404 /x/404.html;
  index index.html;
}
```
