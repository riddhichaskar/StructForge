import io
import zipfile
from typing import List

from dirgen_core.models import Node
from dirgen_core.builder import build_structure_in_memory


def build_zip(nodes: List[Node], root_name: str) -> bytes:
    buffer = io.BytesIO()

    with zipfile.ZipFile(buffer, "w", zipfile.ZIP_DEFLATED) as zipf:
        files = build_structure_in_memory(nodes, root_name)

        for path, content in files.items():
            zipf.writestr(path, content or "")

    buffer.seek(0)
    return buffer.read()
