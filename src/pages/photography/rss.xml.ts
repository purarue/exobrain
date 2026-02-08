import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import urljoin from "../../helpers/join";
import type { AstroUserConfig } from "astro";

export async function GET(context: AstroUserConfig) {
  const photos = await getCollection("photography");
  if (!context.site) {
    throw new Error(
      "The `site` property is not set in your Astro config. This is required to generate the RSS feed.",
    );
  }
  return rss({
    title: "purarue's photography",
    description: "my pictures!",
    site: context.site,
    trailingSlash: false,
    items: photos.map((photo) => ({
      ...photo.data,
      description: photo.data.label ?? undefined,
      link:
        urljoin(import.meta.env.BASE_URL, "photography") +
        `#${photo.data.date.getTime() / 1000}`,
    })),
  });
}
