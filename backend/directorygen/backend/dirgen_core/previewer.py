from typing import List
from .models import Node

def generate_preview(nodes: List[Node], indent: str = "  ") -> str:
    """
    Returns a string representation of the structure for preview.
    Each level is indented with `indent`.
    """

    lines: List[str] = []

    def _render(node: Node):
        lines.append(f"{indent * node.depth}{node.name}{'/' if node.is_dir else ''}")

    for node in nodes:
        _render(node)

    return "\n".join(lines)
