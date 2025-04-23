import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Transform string to Date object
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
  }),
});

const notes = defineCollection({
  type: "content",
  // type-check frontmatter using schema
  schema: z.object({
    title: z.string(),
  }),
});

const journal = defineCollection({
  type: "content",
  schema: z.object({
    date: z.number().transform((val) => new Date(val * 1000)),
    unlisted: z.boolean().optional().default(false),
    audio: z.string().nullish(),
  }),
});

const photography = defineCollection({
  type: "content",
  schema: z.object({
    image: z.string(),
    date: z.number().transform((val) => new Date(val * 1000)),
    tags: z.array(z.string()),
    caption: z.string().nullable(),
    thumbnail_width: z.number(),
    thumbnail_height: z.number(),
    full_width: z.number(),
    full_height: z.number(),
  }),
});

const art = defineCollection({
  type: "content",
  schema: z.object({
    image: z.string(),
    date: z.number().transform((val) => new Date(val * 1000)),
    tags: z.array(z.string()),
    caption: z.string().nullable(),
    thumbnail_width: z.number(),
    thumbnail_height: z.number(),
    full_width: z.number(),
    full_height: z.number(),
  }),
});

function toNameObject(name: string): { title: string; artist: string } {
  const [title, artist] = name.split("|");
  if (!title) {
    throw new Error(`Invalid name: ${name}`);
  }
  if (!artist) {
    throw new Error(`Invalid artist: ${name}`);
  }
  return { title, artist };
}

// music evoked autobiographical memory
const meam = defineCollection({
  type: "content",
  schema: z.object({
    // split by | into name/artist
    name: z.string().transform(toNameObject),
    url: z.string(),
    estimated_year: z.number(),
  }),
});

export const collections = { blog, notes, journal, photography, art, meam };
