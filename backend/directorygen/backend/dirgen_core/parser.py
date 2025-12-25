import re
import unicodedata
from typing import List, Tuple, Dict, Any, Set

from dirgen_core.models import Node
from dirgen_core.report import ParseReport

# --- CONFIGURATION & REGEX ---
TREE_REPLACE = {
    "|--": "├──", "+--": "├──", "└--": "└──",
    "├─": "├──", "└─": "└──", "|": "│",
}
VISUAL_ONLY_RE = re.compile(r"^[│\s]+$")
WIN_PATH_RE = re.compile(r"[A-Za-z]:\\")
TRAILING_GARBAGE_RE = re.compile(r"(\s*(<<<|>>>|EOF|###|\?\?\?).*)$")
NAME_CLEAN_RE = re.compile(r"^[│├└─\s]+")

# [EXTENSION] Regex for the specific Unicode Replacement Character ()
UNICODE_CORRUPTION_RE = re.compile(r"\ufffd")


# --- HELPERS ---

def _normalize_line(line: str, report: ParseReport) -> str:
    """Cleans garbage, normalizes symbols, and fixes path styles."""
    if TRAILING_GARBAGE_RE.search(line):
        line = TRAILING_GARBAGE_RE.sub("", line)
        report.add_fix("Removed trailing garbage/metadata")

    if WIN_PATH_RE.search(line):
        line = line.split("\\")[-1]
        report.add_fix("Converted Windows-style paths")

    # [EXTENSION] Fix Unicode Corruption BEFORE normalization
    # This turns "├──" into "├──" (since  is removed, leaving two dashes)
    if UNICODE_CORRUPTION_RE.search(line):
        line = UNICODE_CORRUPTION_RE.sub("", line)
        report.add_fix("Removed broken Unicode characters")

    line = unicodedata.normalize("NFKC", line).expandtabs(4).rstrip()
    
    replaced = False
    for k, v in TREE_REPLACE.items():
        if k in line:
            line = line.replace(k, v)
            replaced = True
            
    if replaced:
        report.add_fix("Replaced non-standard tree symbols")
    
    return line

def _compute_depth(raw_line: str) -> int:
    """Calculates depth based on indentation or tree markers."""
    match = re.match(r"^([│\s]*)(├──|└──)?", raw_line)
    if not match:
        return 0
    prefix = match.group(1)
    if "│" in prefix:
        return prefix.count("│") + prefix.count("    ")
    else:
        return len(prefix) // 4


# --- MAIN PARSER ---

def parse_structure(text: str) -> Tuple[List[Node], dict]:
    # Use a set to prevent duplicate messages (Fixes the spam issue)
    unique_fixes: Set[str] = set()
    
    # Internal helper to handle the Set logic while keeping Report interface
    class DedupeReport(ParseReport):
        def add_fix(self, message: str):
            if message not in unique_fixes:
                unique_fixes.add(message)
                super().add_fix(message)

    report = DedupeReport()
    lines = text.splitlines()
    if not lines:
        report.add_warning("Empty structure provided")
        return [], report.to_dict()

    # PHASE 1: Raw Parsing
    parsed_items = []
    min_depth = 9999

    for raw in lines:
        raw = raw.split("#", 1)[0]
        
        # Check if line HAD tree markers before normalization
        # [EXTENSION] Logic to detect broken glyphs as tree items
        has_tree_markers = any(x in raw for x in ["|--", "+--", "├──", "└", "|  ", "│"])
        
        # If standard check failed, check for corruption artifacts (like '├' without '──')
        if not has_tree_markers and ("├" in raw or "\ufffd" in raw):
             has_tree_markers = True

        raw = _normalize_line(raw, report)

        if not raw.strip() or VISUAL_ONLY_RE.match(raw):
            continue

        clean_name = NAME_CLEAN_RE.sub("", raw).strip()
        if not clean_name:
            continue

        depth = _compute_depth(raw)
        is_dir = clean_name.endswith("/") or "." not in clean_name
        clean_name = clean_name.rstrip("/")

        parsed_items.append({
            "depth": depth, 
            "name": clean_name, 
            "is_dir": is_dir,
            "is_tree_item": has_tree_markers 
        })
        
        if depth < min_depth:
            min_depth = depth

    if not parsed_items:
        report.add_warning("No valid files detected")
        return [], report.to_dict()

    # PHASE 2: Intelligence & Anchoring
    
    # 1. Normalize Min Depth (Left Shift)
    if min_depth > 0:
        for item in parsed_items:
            item["depth"] -= min_depth
        pass

    # 2. ROOT HEURISTIC
    # If Item[0] is depth 0, and Item[1] is ALSO depth 0 but looks like a branch,
    # Then Item[0] is the PARENT, and everything else is a CHILD.
    if len(parsed_items) > 1:
        root = parsed_items[0]
        second = parsed_items[1]
        
        if (root["depth"] == 0 and second["depth"] == 0 and 
            not root["is_tree_item"] and second["is_tree_item"]):
            
            # Detected "Folder Name + Tree List" pattern
            # Shift everything except the first item down by 1
            for i in range(1, len(parsed_items)):
                parsed_items[i]["depth"] += 1
            
            # Ensure root is marked as dir
            parsed_items[0]["is_dir"] = True

    # PHASE 3: Smart Tree Construction (Dictionary Stack)
    root_container = { "children": {} }
    stack: Dict[int, Any] = { -1: root_container }

    for item in parsed_items:
        current_depth = item["depth"]
        
        # Find valid parent
        parent_depth = current_depth - 1
        while parent_depth not in stack and parent_depth >= -1:
            parent_depth -= 1
        
        parent_container = stack[parent_depth]
        name = item["name"]
        
        # Merge Logic
        if name in parent_container["children"]:
            existing = parent_container["children"][name]
            if item["is_dir"] and not existing["node"].is_dir:
                existing["node"].is_dir = True
            
            if item["is_dir"]:
                report.add_fix(f"Merged duplicate folder '{name}'")
                stack[current_depth] = existing
        else:
            new_node = Node(name=name, is_dir=item["is_dir"], depth=current_depth)
            new_container = { "node": new_node, "children": {} }
            parent_container["children"][name] = new_container
            
            if item["is_dir"]:
                stack[current_depth] = new_container
            
            # Clear deeper stack
            keys_to_remove = [k for k in stack if k > current_depth]
            for k in keys_to_remove:
                del stack[k]

    # PHASE 4: Flatten
    final_nodes: List[Node] = []

    def flatten(container, depth_override=None):
        node = container.get("node")
        d = depth_override if depth_override is not None else (node.depth if node else 0)

        if node:
            final_nodes.append(Node(name=node.name, is_dir=node.is_dir, depth=d))
        
        for child in container["children"].values():
            flatten(child, d + 1 if node else 0)

    # Handle multiple roots logic preserved
    if len(root_container["children"]) > 1:
        pass
        
    for child in root_container["children"].values():
        flatten(child, 0)

    return final_nodes, report.to_dict()