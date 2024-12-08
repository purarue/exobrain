from pathlib import Path
from typing import Any

from frontmatter import parse  # type: ignore[import]


def parse_frontmatter(file: Path) -> dict[str, Any]:
    data, _ = parse(file.read_text())
    assert isinstance(data, dict)
    return data


def get_field_from_markdown_file(file: Path, field: str) -> Any:
    return parse_frontmatter(file)[field]


def get_img_from_markdown_file(file: Path) -> str:
    field = get_field_from_markdown_file(file, "image")
    if not isinstance(field, str):
        raise RuntimeError(f"Invalid image in {file}")
    return field
