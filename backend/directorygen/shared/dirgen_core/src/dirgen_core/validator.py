from typing import List
from .models import Node
from pathlib import Path

WINDOWS_RESERVED = {"CON", "PRN", "AUX", "NUL"}

def validate_nodes(nodes: List[Node]) -> None:
    paths = set()
    for node in nodes:
        if any(c in node.name for c in ("│", "├", "└")):
            raise ValueError(f"Invalid character in node name: {node.name}")

        base = node.name.split(".")[0].upper()
        if base in WINDOWS_RESERVED:
            raise ValueError(f"Reserved Windows filename: {node.name}")

        full_path = Path("/".join([("dummy" if node.depth == 0 else "")] * node.depth + [node.name]))
        if full_path in paths:
            raise ValueError(f"Duplicate path detected: {full_path}")
        paths.add(full_path)
