export function meamTitle({
  estimated_year,
  name,
}: {
  estimated_year: number;
  name: {
    title: string;
    artist: string;
  };
}) {
  return `${estimated_year} | ${name.title} - ${name.artist}`;
}
