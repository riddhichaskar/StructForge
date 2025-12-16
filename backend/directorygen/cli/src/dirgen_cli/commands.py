from pathlib import Path
import json

from dirgen_core.parser import parse_structure
from dirgen_core.validator import validate_nodes
from dirgen_core.builder import build_actions
from dirgen_core.zip_utils import create_zip
from dirgen_core.previewer import generate_preview


def preview_structure(structure_text: str) -> str:
    nodes = parse_structure(structure_text)
    validate_nodes(nodes)
    return generate_preview(nodes)


def create_structure(
    structure_text: str,
    destination: Path,
    project_name: str,
):
    nodes = parse_structure(structure_text)
    validate_nodes(nodes)

    actions = build_actions(nodes)
    zip_buffer = create_zip(actions, base_path=Path(project_name))

    destination.mkdir(parents=True, exist_ok=True)
    zip_path = destination / f"{project_name}.zip"

    with open(zip_path, "wb") as f:
        f.write(zip_buffer.getbuffer())

    manifest = {
        "project": project_name,
        "destination": str(destination.resolve()),
        "entries": [str(a.path) for a in actions],
    }

    with open(destination / ".dirgen_manifest.json", "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)

    return zip_path


def undo_last_creation(destination: Path) -> bool:
    manifest_path = destination / ".dirgen_manifest.json"
    if not manifest_path.exists():
        return False

    with open(manifest_path, "r", encoding="utf-8") as f:
        manifest = json.load(f)

    for entry in reversed(manifest["entries"]):
        path = Path(entry)
        if path.is_file():
            path.unlink(missing_ok=True)
        elif path.is_dir():
            try:
                path.rmdir()
            except OSError:
                pass

    manifest_path.unlink(missing_ok=True)
    return True
