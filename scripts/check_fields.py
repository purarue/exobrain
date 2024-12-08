#!/usr/bin/env python3

from pathlib import Path

import click

from common import get_img_from_markdown_file

base_dir = Path(__file__).resolve().parent.parent
content_dir = base_dir / "src" / "content"
public_dir = base_dir / "public"


@click.group()
def main() -> None:
    pass


@main.command()
@click.option("-v", "--verbose", is_flag=True, default=False)
def photos(verbose: bool) -> None:
    for mtype in ("photography", "art"):
        for p in (content_dir / mtype).glob("*.md"):
            if verbose:
                click.echo(f"Checking content: {p}", err=True)
            img = get_img_from_markdown_file(p)
            if verbose:
                click.echo(f"Extracted image: {img}", err=True)
            for subdir in ("full", "thumbs"):
                f = public_dir / mtype / subdir / img
                if verbose:
                    click.echo(f"Checking file: {f}", err=True)
                if not f.exists():
                    raise RuntimeError(f"Missing {f}")


if __name__ == "__main__":
    main()
