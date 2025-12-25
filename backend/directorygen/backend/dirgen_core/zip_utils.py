import io
import zipfile
from pathlib import Path
from typing import Set


def extract_structure_from_zip(
    zip_bytes: bytes,
    max_nodes: int,
    max_depth: int,
) -> str:
    seen: Set[str] = set()
    lines = []

    with zipfile.ZipFile(io.BytesIO(zip_bytes)) as zipf:
        for info in zipf.infolist():
            path = Path(info.filename)

            # Security
            if path.is_absolute() or ".." in path.parts:
                raise ValueError("Unsafe path detected in ZIP")

            depth = len(path.parts) - 1
            if depth > max_depth:
                raise ValueError("ZIP exceeds maximum depth")

            seen.add(info.filename)

            if len(seen) > max_nodes:
                raise ValueError("ZIP exceeds maximum node limit")

        for name in sorted(seen):
            path = Path(name)
            indent = "  " * (len(path.parts) - 1)

            if name.endswith("/"):
                lines.append(f"{indent}{path.name}/")
            else:
                lines.append(f"{indent}{path.name}")

    return "\n".join(lines)
