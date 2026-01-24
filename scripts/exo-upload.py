#!/usr/bin/env python3

"""
This script takes an image, and creates thumbnails and metadata
"""

import os
import sys
import json
import subprocess
import shutil
import tempfile

from pathlib import Path
from typing import (
    Dict,
    NamedTuple,
    Literal,
    Any,
    assert_never,
    get_args,
    Generator,
    Optional,
    List,
    Type,
    Iterator,
    Self,
)
from datetime import datetime
from dataclasses import dataclass
from contextlib import contextmanager

import click
import exifread  # type: ignore[import]
import autotui.namedtuple_prompt
from PIL import Image

from pyfzf import FzfPrompt

fzf = FzfPrompt()

base_dir = Path(__file__).resolve().parent.parent
content_dir = base_dir / "src" / "content"
public_dir = base_dir / "public"


def exiftool(path: Path) -> None:
    click.secho(f"Data for {path}", fg="blue")
    opts = [
        "--FilePermissions",
        "--EncodingProcess",
        "--BitsPerSample",
        "--YCbCr*",
        "--Megapixels",
        "--ImageSize",
        "--ColorComponents",
        "--Directory",
        "--*Version*",
        "--LensID",
    ]
    cmd = ["exiftool"] + opts + [str(path)]
    subprocess.run(cmd)


def shrink_image(input_path, output_dir, target_size_mb=3, shrink_factor=0.95):
    if not input_path.is_file():
        raise FileNotFoundError(f"Input file {input_path} does not exist.")

    target_size_bytes = target_size_mb * 1024 * 1024

    img = Image.open(input_path)
    filename = input_path.name
    name, ext = os.path.splitext(filename)

    output_path = output_dir / filename

    counter = 1
    while output_path.exists():
        output_path = output_dir / f"{name}_{counter}{ext}"
        counter += 1

    img.save(output_path, optimize=True)

    while output_path.stat().st_size > target_size_bytes:
        width, height = img.size
        new_width = int(width * shrink_factor)
        new_height = int(height * shrink_factor)

        if new_width < 1 or new_height < 1:
            raise ValueError(
                f"Image {input_path} became too small before reaching target size."
            )

        img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
        img.save(output_path, optimize=True)

    click.echo(
        f"Saved resized image to {output_path} ({output_path.stat().st_size / (1024 * 1024):.2f} MB)"
    )


@click.group(help=__doc__)
def main() -> None:
    pass


class PublicInfo(NamedTuple):
    full: Path
    thumbs: Path
    raw: Path


@dataclass
class BaseImageMixin:
    source: Path
    _tempfile: Path | None = None

    THUMB_SIZE = 720

    @classmethod
    def content_metadata_dir(cls) -> Path:
        ct = content_dir / cls.__name__.casefold()
        ct.mkdir(exist_ok=True, parents=True)
        return ct

    @classmethod
    def public_dir(cls) -> PublicInfo:
        pb = PublicInfo(
            raw=public_dir / cls.__name__.casefold() / "raw",
            full=public_dir / cls.__name__.casefold() / "full",
            thumbs=public_dir / cls.__name__.casefold() / "thumbs",
        )
        pb.full.mkdir(exist_ok=True, parents=True)
        pb.thumbs.mkdir(exist_ok=True, parents=True)
        return pb

    def taken_at(self) -> datetime:
        # use EXIF tag
        with open(self.source, "rb") as fp:
            tags = exifread.process_file(fp)
            if "EXIF DateTimeOriginal" in tags:
                data = tags["EXIF DateTimeOriginal"].values
                date_obj = datetime.strptime(data, "%Y:%m:%d %H:%M:%S")
                return date_obj.astimezone()

        # use mod time
        return datetime.fromtimestamp(self.source.stat().st_mtime)

    @contextmanager
    def img(self) -> Generator[Image.Image, None, None]:
        with Image.open(self.source) as im:
            yield im

    @property
    def tempfile(self) -> Path:
        if self._tempfile is not None:
            return self._tempfile
        td = Path(tempfile.gettempdir())

        # create application directory
        td_app = td / "exobrain_uploader"
        td_app.mkdir(exist_ok=True, parents=True)
        self._tempfile = td_app / self.source.name
        if self._tempfile.exists():
            click.echo(f"Removing existing temporary file: {self._tempfile}")
            self._tempfile.unlink()
        # copy file
        shutil.copy(self.source, self._tempfile)
        return self._tempfile

    def strip_tempfile_metadata(self) -> None:
        tf = self.tempfile
        # auto-orient in-case, to bake-in
        subprocess.run(["mogrify", "-auto-orient", str(tf)])
        # remove all EXIF data
        subprocess.run(["exiftool", "-all=", str(tf)])

    def create_thumb(self, from_file: Path | None = None) -> Path:
        if from_file is None:
            from_file = self.tempfile
        # figure out which orientation to use as the limiting factor
        # resize so that the largest dimension is 320px, unless
        # its already smaller than that
        with Image.open(from_file) as im:
            width, height = im.size

            thumb_target_dir = self.public_dir().thumbs
            thumb_target = thumb_target_dir / self.source.name
            if thumb_target.exists():
                click.secho(f"Thumb already exists {thumb_target}, aborting", fg="red")
                sys.exit(1)

            if width < self.THUMB_SIZE and height < self.THUMB_SIZE:
                shutil.copy(from_file, thumb_target)
                return thumb_target

            if width < height:
                # height is larger, so we make that be THUMB_SIZE
                target_size = (int(width * self.THUMB_SIZE / height), self.THUMB_SIZE)
            else:
                target_size = (self.THUMB_SIZE, int(height * self.THUMB_SIZE / width))

            im.thumbnail(target_size)
            im.save(thumb_target)

        if shutil.which("rifleman") is not None:
            subprocess.run(["rifleman", "-a", "image", str(thumb_target)])

        return thumb_target

    def create_full(self) -> Path:
        target = self.public_dir().full / self.source.name
        if target.exists():
            click.secho(f"Full already exists {target}, aborting", fg="red")
            sys.exit(1)
        shrink_image(self.tempfile, self.public_dir().full)
        return target

    def save_input(self) -> Path:
        target = self.public_dir().raw / self.source.name
        if target.exists():
            click.secho(f"Raw already exists {target}, aborting", fg="red")
            sys.exit(1)
        shutil.copy(self.tempfile, target)
        return target

    def create_metadata(
        self,
        *,
        img_path: str,
        date: datetime,
        tags: List[str],
        caption: Optional[str],
    ) -> Path:
        # get thumbnail height/width
        tf = self.public_dir().thumbs / self.source.name
        with Image.open(tf) as im:
            thumb_w, thumb_h = im.size

        # get full height/width
        with self.img() as im:
            full_w, full_h = im.size

        # create a markdown file with the name of the image as part of the metadata
        content = f"""---
date: {int(date.timestamp())}
image: {img_path}
tags: {json.dumps(tags)}
caption: {'null' if not caption else f'{json.dumps(caption)}'}
thumbnail_width: {thumb_w}
thumbnail_height: {thumb_h}
full_width: {full_w}
full_height: {full_h}
---
"""
        metadata_file = self.content_metadata_dir() / (
            str(int(datetime.now().timestamp())) + ".md"
        )
        if metadata_file.exists():
            click.secho(f"Metadata already exists {metadata_file}, aborting", fg="red")
            sys.exit(1)

        metadata_file.write_text(content)
        return metadata_file


@dataclass
class Photography(BaseImageMixin):
    pass


@dataclass
class Art(BaseImageMixin):
    pass


IMAGE_TYPES: dict[str, Type[BaseImageMixin]] = {
    "photography": Photography,
    "art": Art,
}

ImageType = Literal[tuple(IMAGE_TYPES.keys())]  # type: ignore[valid-type]


def image_tags() -> List[str]:
    from common import get_field_from_markdown_file

    found = []
    # sort by most recent, so the default is the most recently used tag
    infos = list(iter_image_infos())
    infos.sort(key=lambda i: Path(i.md_path).name, reverse=True)
    for image_info in infos:
        tags_raw = get_field_from_markdown_file(Path(image_info.md_path), "tags")
        assert isinstance(tags_raw, list)
        for t in tags_raw:
            if t in found:
                continue
            found.append(t)
    return found


class Metadata(NamedTuple):
    tags: Optional[List[str]]
    caption: Optional[str]

    @staticmethod
    def attr_use_values() -> Dict[str, Any]:
        def _fzf_prompt() -> List[str]:
            chosen: List[str] = fzf.prompt(image_tags(), "--multi", "--prompt='Tags> '")
            if not chosen:
                if click.confirm("Add new tag?", default=False):
                    return [click.prompt("Tag", type=str, default="")]
            assert isinstance(chosen, list)
            return chosen

        return {"tags": lambda: _fzf_prompt()}


@main.command(short_help="upload an image")
@click.option(
    "-t", "--type", "image_type", type=click.Choice(get_args(ImageType)), required=True
)
@click.argument("PATH", type=click.Path(path_type=Path))
def upload(path: Path, image_type: ImageType) -> None:  # type: ignore
    """
    Upload an image to the public directory

    Removes metadata, generates a thumbnail and prompts for metadata
    """
    path = path.absolute()
    if not path.exists():
        click.secho(f"Missing path: {path}", fg="red")
        sys.exit(1)

    for cmd in ["exiftool", "mogrify", "rifle"]:
        if shutil.which(cmd) is None:
            click.secho(f"Missing required command '{cmd}'", fg="red")
            sys.exit(1)

    assert image_type in IMAGE_TYPES, f"Unknown image type: {image_type}"
    img_cls = IMAGE_TYPES[image_type]
    file = img_cls(path)

    assert '"' not in file.source.name, f"File name contains quotes: {file.source.name}"
    assert " " not in file.source.name, f"File name contains spaces: {file.source.name}"

    # make sure this is a jpg or png
    # I can add more filetypes, I just need to make sure they work with exiftool/PIL to create thumbnails
    # this is just so I dont shoot myself in the foot
    assert file.source.suffix.lower() in (
        ".jpg",
        ".jpeg",
        ".png",
    ), f"File is not a jpg or png: {file.source.name}"

    # exiftool source file
    exiftool(file.source)

    # use rifle to open file
    if click.confirm("Open image?", default=True):
        subprocess.run(["rifle", file.source])

    # prompt to confirm date
    # remove all private metadata
    # optional tags
    # create thumbnail
    # copy full image
    # create markdown file with metadata which astro collection parses

    creation_date: datetime = file.taken_at()
    if not click.confirm(f"Confirm {creation_date}", default=True):
        click.secho("Aborting...")
        sys.exit(1)

    metadata = autotui.namedtuple_prompt.prompt_namedtuple(Metadata)

    file.strip_tempfile_metadata()
    thumb_path = file.create_thumb()
    exiftool(thumb_path)
    full_path = file.create_full()
    exiftool(full_path)
    save_raw = file.save_input()
    exiftool(save_raw)

    created = file.create_metadata(
        img_path=file.source.name,
        date=creation_date,
        tags=metadata.tags or [],
        caption=metadata.caption,
    )
    click.secho("Created:", fg="green")
    click.echo(created)
    click.echo(thumb_path)
    click.echo(full_path)


@main.command(short_help="re-generate missing thumbnails")
def update_thumbnails() -> None:
    """
    If the /full path exists but a /thumbs doesn't, then
    create the thumbnail from the /full image

    I probably updated some configuration for how the
    thumbnails should be generated, and wanted to re-run this
    """
    for mtype in IMAGE_TYPES.values():
        dirs = mtype.public_dir()
        for file in dirs.full.iterdir():
            name = file.name
            thumb_target = dirs.thumbs / name
            if not thumb_target.exists():
                click.secho(f"Creating thumbnail for {name}", err=True, fg="green")
                src = mtype(file)
                mtype.create_thumb(src, from_file=file)


class ImageInfo(NamedTuple):
    md_path: str
    thumb_path: str
    full_path: str

    def pretty_print(self: Self) -> str:
        return f"{click.style(self.md_path, fg='green')} {self.thumb_path} {self.full_path}"


def iter_image_infos() -> Iterator[ImageInfo]:
    from common import get_img_from_markdown_file

    for mname, mtype in IMAGE_TYPES.items():
        mname_content_dir = content_dir / mname
        # assert mname_content_dir.exists(), f"Missing {mname} content directory"
        p_info = mtype.public_dir()
        for file in mname_content_dir.iterdir():
            if file.name.startswith("_"):
                continue
            img = get_img_from_markdown_file(file)
            yield ImageInfo(
                md_path=str(file.absolute()),
                thumb_path=str(p_info.thumbs / img),
                full_path=str(p_info.full / img),
            )


ImageInfoOutput = Literal["json", "text"]


@main.command()
@click.option(
    "-e", "--exists", is_flag=True, default=False, help="Check if each file exists"
)
@click.option(
    "-o",
    "--output",
    type=click.Choice(get_args(ImageInfoOutput)),
    default=get_args(ImageInfoOutput)[0],
    help="output format",
)
def image_info(exists: bool, output: ImageInfoOutput) -> None:
    """
    Output image info
    """
    items: List[ImageInfo] = []
    for info in iter_image_infos():
        if exists:
            if not os.path.exists(info.full_path):
                raise FileNotFoundError(
                    f"{info.full_path} does not exist, referred from {info.md_path}"
                )
            if not os.path.exists(info.thumb_path):
                raise FileNotFoundError(
                    f"{info.thumb_path} does not exist, referred from {info.md_path}"
                )
        items.append(info)
    match output:
        case "json":
            click.echo(json.dumps(items, indent=4))
        case "text":
            click.echo("\n".join([item.pretty_print() for item in items]))
        case _:
            assert_never(output)


if __name__ == "__main__":
    main(prog_name="exo-upload")
