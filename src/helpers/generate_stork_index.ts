import url_for from "../helpers/url";
import { getCollection } from "astro:content";
import path from "node:path";
import fs from "node:fs/promises";
import { journalDate } from "./date";
import TOML from "@ltd/j-toml";

const outputFilePath = path.join(process.cwd(), "./stork_input.toml");

function okayFile(fileId: string) {
  const ok = fileId.endsWith(".md");
  if (!ok) {
    console.log(`Skipping ${fileId}, not markdown`);
  }
  return ok;
}

async function generateStorkIndex() {
  console.log("Generating Stork index...");

  const blogs = await getCollection("blog");
  const posts = (await getCollection("notes")).filter(
    (post) => !post.slug.startsWith("personal/"),
  );
  const journal = await getCollection("journal");

  const files = [];

  for (const b of blogs) {
    if (!okayFile(b.id)) {
      continue;
    }
    files.push({
      title: b.data.title,
      url: url_for(`blog/${b.slug}/`),
      path: path.join(process.cwd(), "./src/content/blog", b.id),
      filetype: "Markdown",
    });
  }

  for (const p of posts) {
    if (!okayFile(p.id)) {
      continue;
    }
    files.push({
      title: p.data.title,
      url: url_for(`notes/${p.slug}/`),
      path: path.join(process.cwd(), "./src/content/notes", p.id),
      filetype: "Markdown",
    });
  }

  for (const j of journal) {
    if (!okayFile(j.id)) {
      continue;
    }
    files.push({
      title: journalDate(j.data.date),
      url: url_for(`journal/${j.slug}/`),
      path: path.join(process.cwd(), "./src/content/journal", j.id),
      filetype: "Markdown",
    });
  }

  const tomlString = TOML.stringify({ input: { files } });
  await fs.writeFile(outputFilePath, tomlString);
}

export default generateStorkIndex;
