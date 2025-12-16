from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from dirgen_core.parser import parse_structure
from dirgen_core.validator import validate_nodes

router = APIRouter(prefix="/preview", tags=["Preview"])


class PreviewRequest(BaseModel):
    structure: str


@router.post("")
@limiter.limit("30/minute")
def preview_structure(payload: PreviewRequest):
    try:
        nodes = parse_structure(payload.structure)
        validate_nodes(nodes)

        return {
            "nodes": [
                {
                    "name": n.name,
                    "is_dir": n.is_dir,
                    "depth": n.depth,
                }
                for n in nodes
            ]
        }

    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))
