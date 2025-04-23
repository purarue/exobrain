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

export function meam_url(slug: string | undefined): string | undefined {
  if (slug !== undefined) {
    return url_for(`meam/${slug}/`);
  } else {
    return undefined;
  }
}

export function transform_youtube_url(url: string): string {
  // convert youtube.com/watch?v=... to embed URL, using
  // the origin from import.meta.env.BASE_URL as the origin query param
  // https://developers.google.com/youtube/player_parameters
  //
  "https://www.youtube.com/embed/M7lc1UVf-VE?autoplay=1&origin=http://example.com";
  // extract from v=
  const v = new URL(url).searchParams.get("v");
  const base = new URL(url).origin;
  if (v !== null) {
    return `https://www.youtube.com/embed/${v}?&origin=${base}`;
  } else {
    throw Error(`No video id in url ${url}`);
  }
}
