import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
// https://docs.astro.build/en/guides/integrations-guide/sitemap/
import sitemap from "@astrojs/sitemap";
import urljoin from "./src/helpers/join";
import { loadEnv } from "vite";

// load config-specfic env vars
import Compress from "astro-compress";
const env = loadEnv(process.env.NODE_ENV, process.cwd(), "");
const isProd = import.meta.env.PROD;
let base = env.BASE || "/";
let site = env.SITE || "https://purarue.xyz";
let port = env.PORT || "4321";

// force localhost if not prod
if (!isProd) {
  site = `http://localhost:${port}`;
}
const url = urljoin(site, base);
console.log({
  base,
  url,
  isProd,
});

// https://astro.build/config
export default defineConfig({
  site: url,
  prefetch: {
    defaultStrategy: "hover",
    prefetchAll: true, // on hover, pre fetch site links
  },
  base: base,
  trailingSlash: "ignore",
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => {
        if (page.includes("notes/personal")) {
          return false;
        }
        return true;
      },
    }),
    Compress({
      CSS: false,
      HTML: false,
      Image: false,
      JavaScript: true,
      SVG: false,
    }),
  ],
  vite: {
    // ignore d.ts files
    optimizeDeps: {
      exclude: ["*.d.ts"],
    },
  },
});
