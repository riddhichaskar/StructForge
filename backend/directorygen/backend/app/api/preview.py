from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel

from app.utils.security import limiter
from dirgen_core.parser import parse_structure
from dirgen_core.validator import validate_nodes

router = APIRouter(prefix="/preview", tags=["Preview"])

class PreviewRequest(BaseModel):
    structure: str

@router.post("")
@limiter.limit("30/minute")
def preview_structure(request: Request, payload: PreviewRequest):
    try:
        # FIX: Unpack the tuple (nodes, summary)
        # Previous code was: nodes = parse_structure(...) which caused the bug
        nodes, summary = parse_structure(payload.structure)
        
        # Validate only the nodes list
        validate_nodes(nodes)

        return {
            "nodes": [
                {
                    "name": n.name,
                    "is_dir": n.is_dir,
                    "depth": n.depth,
                }
                for n in nodes
            ],
            # Pass the summary dictionary through to the frontend
            "summary": summary 
        }
    except Exception as e:
        # This catches the AttributeError and sends it to frontend as 422
        raise HTTPException(status_code=422, detail=str(e))