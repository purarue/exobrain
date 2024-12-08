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
    def verbose_print(msg: str) -> None:
        if verbose:
            click.echo(msg, err=True)

    for mtype in ("photography", "art"):
        for p in (content_dir / mtype).glob("*.md"):
            verbose_print(f"Checking content: {p}")
            img = get_img_from_markdown_file(p)
            verbose_print(f"Image: {img}")
            for subdir in ("full", "thumbs"):
                f = public_dir / mtype / subdir / img
                verbose_print(f"Checking file: {f}")
                if not f.exists():
                    raise RuntimeError(f"Missing {f}, referenced in {p}")


if __name__ == "__main__":
    main()
