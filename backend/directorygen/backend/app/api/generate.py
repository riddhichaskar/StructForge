from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from dirgen_core.parser import parse_structure
from dirgen_core.validator import validate_nodes
from app.utils.zip_stream import build_zip

import io

router = APIRouter(prefix="/generate", tags=["Generate"])


class GenerateRequest(BaseModel):
    structure: str
    name: str


@router.post("")
@limiter.limit("10/minute")
def generate_zip(payload: GenerateRequest):
    try:
        nodes = parse_structure(payload.structure)
        validate_nodes(nodes)

        zip_bytes = build_zip(nodes, payload.name)

        return StreamingResponse(
            io.BytesIO(zip_bytes),
            media_type="application/zip",
            headers={
                "Content-Disposition": f'attachment; filename="{payload.name}.zip"'
            },
        )

    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))
