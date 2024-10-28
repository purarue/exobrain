import join from "./join";

export default function url_for(path: string): string {
  // remove leading . and /
  if (path.startsWith(".")) {
    path = path.slice(1);
  }
  if (path.startsWith("/")) {
    path = path.slice(1);
  }
  return join(import.meta.env.BASE_URL, path);
}

export function journal_url(slug: string | undefined): string | undefined {
  if (slug !== undefined) {
    return url_for(`journal/${slug}/`);
  } else {
    return undefined;
  }
}
