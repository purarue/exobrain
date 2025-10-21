import url_for from "../helpers/url";
import { getCollection } from "astro:content";
import path from "node:path";
import fs from "node:fs/promises";
import { journalDate } from "./date";
import TOML from "@ltd/j-toml";
import { meamTitle } from "./meam";

const outputFilePath = path.join(process.cwd(), "./stork_input.toml");

function okayFile(fileId: string) {
  const ok = fileId.endsWith(".md");
  if (!ok) {
    console.log(`Skipping ${fileId}, not markdown`);
  }
  return ok;
}

function collectionFiles<T extends object>({
  url_slug,
  items,
  title,
}: {
  url_slug: string;
  items: { id: string; slug: string; data: T }[];
  title: (item: { id: string; slug: string; data: T }) => string;
}) {
  const files = [];
  for (const item of items) {
    if (!okayFile(item.id)) {
      continue;
    }
    if ("unlisted" in item.data && item.data.unlisted === true) {
      continue;
    }
    const cwd = process.cwd();
    files.push({
      title: title(item),
      url: url_for(`${url_slug}/${item.slug}`),
      path: path.join(cwd, `./src/content/${url_slug}`, item.id),
      filetype: "Markdown",
    });
  }
  return files;
}

async function generateStorkIndex() {
  console.log("Generating Stork index...");

  const tomlString = TOML.stringify(
    {
      input: {
        files: [
          ...collectionFiles({
            items: await getCollection("blog"),
            url_slug: "blog",
            title: (b) => b.data.title,
          }),
          ...collectionFiles({
            items: (await getCollection("notes")).filter(
              (post) => !post.slug.startsWith("personal/"),
            ),
            url_slug: "notes",
            title: (p) => p.data.title,
          }),
          ...collectionFiles({
            items: await getCollection("journal"),
            url_slug: "journal",
            title: (j) => journalDate(j.data.date),
          }),
          ...collectionFiles({
            items: await getCollection("meam"),
            url_slug: "meam",
            title: (m) => meamTitle(m.data),
          }),
        ],
      },
    },
    {
      newline: "\n",
    },
  );
  await fs.writeFile(outputFilePath, tomlString);
}

export default generateStorkIndex;
