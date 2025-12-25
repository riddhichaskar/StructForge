import zipfile
import io
from typing import Dict, List
from dirgen_core.models import Node


def parse_zip_to_nodes(zip_bytes: bytes) -> List[Node]:
    tree = {}

    with zipfile.ZipFile(io.BytesIO(zip_bytes)) as zf:
        for path in sorted(zf.namelist()):
            if path.startswith("__MACOSX") or not path.strip():
                continue

            parts = [p for p in path.split("/") if p]
            curr = tree

            for i, part in enumerate(parts):
                is_last = i == len(parts) - 1
                is_dir = path.endswith("/") or not is_last

                if part not in curr:
                    curr[part] = {
                        "__dir": is_dir,
                        "__children": {}
                    }

                curr = curr[part]["__children"]

    nodes: List[Node] = []

    def walk(level: Dict, depth: int):
        for name, meta in level.items():
            nodes.append(Node(name=name, is_dir=meta["__dir"], depth=depth))
            walk(meta["__children"], depth + 1)

    walk(tree, 0)
    return nodes
