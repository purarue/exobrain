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

function collectionTOMLEntries<T extends object>({
  url_slug,
  items,
  title,
}: {
  url_slug: string;
  items: { id: string; slug: string; data: T }[];
  title: (data: T) => string;
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
      title: title(item.data),
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
          ...collectionTOMLEntries({
            items: await getCollection("blog"),
            url_slug: "blog",
            title: (bd) => bd.title,
          }),
          ...collectionTOMLEntries({
            items: (await getCollection("notes")).filter(
              (post) => !post.slug.startsWith("personal/"),
            ),
            url_slug: "notes",
            title: (pd) => pd.title,
          }),
          ...collectionTOMLEntries({
            items: await getCollection("journal"),
            url_slug: "journal",
            title: (jd) => journalDate(jd.date),
          }),
          ...collectionTOMLEntries({
            items: await getCollection("meam"),
            url_slug: "meam",
            title: (md) => meamTitle(md),
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
