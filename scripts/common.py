from pathlib import Path


def unstring(s: str) -> str:
    for seps in ("'", '"'):
        if s.startswith(seps) and s.endswith(seps):
            return s[1:-1]
    return s


def get_field_from_markdown_file(file: Path, field: str) -> str:
    for line in file.open("r"):
        if line.startswith(field):
            return unstring(line.split(":", maxsplit=1)[1].strip())
    else:
        raise RuntimeError(f"No {field} in {file}")


def get_img_from_markdown_file(file: Path) -> str:
    return get_field_from_markdown_file(file, "image")
