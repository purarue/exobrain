import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE_DESCRIPTION } from "../consts";
import urljoin from "../helpers/join";
import type { AstroUserConfig } from "astro";

export async function GET(context: AstroUserConfig) {
  const posts = await getCollection("blog");
  if (!context.site) {
    throw new Error(
      "The `site` property is not set in your Astro config. This is required to generate the RSS feed.",
    );
  }
  return rss({
    title: "purarue's notes",
    description: SITE_DESCRIPTION,
    site: context.site,
    items: posts.map((post) => ({
      ...post.data,
      link: urljoin(import.meta.env.BASE_URL, "blog", `${post.slug}/`),
    })),
  });
}
