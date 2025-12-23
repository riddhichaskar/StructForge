from pathlib import Path
from typing import Dict, List
from .models import Node, BuildAction
from .validator import validate_nodes
from dirgen_core.models import Node


def build_actions(nodes: List[Node]) -> List[BuildAction]:
    validate_nodes(nodes)
    actions: List[BuildAction] = []
    stack: List[Path] = [Path("")]

    for node in nodes:
        while len(stack) > node.depth + 1:
            stack.pop()

        if len(stack) < node.depth + 1:
            raise ValueError(f"Invalid depth jump at '{node.name}' (depth={node.depth})")

        parent = stack[-1]
        current_path = parent / node.name

        if node.is_dir:
            actions.append(BuildAction(type="dir", path=current_path))
            stack.append(current_path)
        else:
            actions.append(BuildAction(type="file", path=current_path, content=node.content))

    return actions

def build_structure_in_memory(
    nodes: List[Node],
    root_name: str,
) -> Dict[str, str]:
    """
    Builds an in-memory file map for ZIP generation.
    Returns: { "path/to/file": "content" }
    """

    files: Dict[str, str] = {}
    stack: list[str] = []

    for node in nodes:
        stack = stack[: node.depth]

        if node.is_dir:
            stack.append(node.name)
            dir_path = "/".join([root_name] + stack) + "/"
            files[dir_path] = ""
        else:
            file_path = "/".join([root_name] + stack + [node.name])
            files[file_path] = node.content or ""

    return files

def nodes_to_ascii(nodes: List[Node], root_name: str) -> str:
    lines = [f"{root_name}/"]

    stack = []

    for node in nodes:
        while stack and stack[-1] >= node.depth:
            stack.pop()

        prefix = ""
        for i in range(len(stack)):
            prefix += "│   "

        connector = "└── " if not stack or node.depth > stack[-1] else "├── "
        lines.append(prefix + connector + node.name)

        stack.append(node.depth)

    return "\n".join(lines)
