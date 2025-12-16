from dataclasses import dataclass
from typing import List, Optional
import re
from .models import Node

TREE_ITEM_RE = re.compile(r"(├──|└──)\s*(.+)$")
VISUAL_ONLY_RE = re.compile(r"^[│\s]+$")


def _compute_depth(prefix: str) -> int:
    depth = 0
    i = 0
    while i + 3 < len(prefix):
        block = prefix[i:i + 4]
        if block in ("│   ", "    "):
            depth += 1
            i += 4
        else:
            break
    return depth


def parse_structure(text: str) -> List[Node]:
    nodes: List[Node] = []

    for raw in text.splitlines():
        raw = raw.split("#", 1)[0].rstrip()
        if not raw.strip():
            continue
        if VISUAL_ONLY_RE.match(raw):
            continue

        if "├──" not in raw and "└──" not in raw:
            name = raw.strip()
            is_dir = name.endswith("/")
            name = name.rstrip("/")
            nodes.append(Node(name=name, is_dir=is_dir, depth=0))
            continue

        match = TREE_ITEM_RE.search(raw)
        if not match:
            continue

        _, name = match.groups()
        prefix = raw[:match.start()]
        depth = _compute_depth(prefix)
        name = name.strip()
        is_dir = name.endswith("/")
        name = name.rstrip("/")
        if not name:
            continue
        nodes.append(Node(name=name, is_dir=is_dir, depth=depth))

    if nodes and nodes[0].is_dir:
        root = nodes[0]
        fixed_nodes = [root]
        for node in nodes[1:]:
            fixed_nodes.append(
                Node(
                    name=node.name,
                    is_dir=node.is_dir,
                    depth=node.depth + 1,
                    content=node.content,
                )
            )
        return fixed_nodes

    return nodes
