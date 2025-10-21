import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { loadEnv } from "vite";

// load config-specfic env vars
import Compress from "astro-compress";
const env = loadEnv(process.env.NODE_ENV, process.cwd(), "");
const isProd = import.meta.env.PROD;
let fullUrl = env.BASE || "https://purarue.xyz/x";
let port = env.PORT || "4321";

// is probably '/x'
const base = new URL(fullUrl).pathname;

// force localhost if not prod
if (!isProd) {
  fullUrl = `http://localhost:${port}${base}`;
}
console.log({
  site: fullUrl,
  isProd,
});

// https://astro.build/config
export default defineConfig({
  site: fullUrl,
  prefetch: {
    defaultStrategy: "hover",
    prefetchAll: true, // on hover, pre fetch site links
  },
  // this gets exposed as import.meta.env.BASE_URL
  base: base,
  trailingSlash: "ignore",
  integrations: [
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
