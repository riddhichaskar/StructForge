from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import io

from app.utils.security import limiter
from dirgen_core.parser import parse_structure
from dirgen_core.validator import validate_nodes
from app.utils.zip_stream import build_zip

router = APIRouter(prefix="/generate", tags=["Generate"])


class GenerateRequest(BaseModel):
    structure: str
    name: str


@router.post("")
@limiter.limit("10/minute")
def generate_zip(request: Request, payload: GenerateRequest):
    try:
        nodes, report = parse_structure(payload.structure)
        validate_nodes(nodes)

        zip_bytes = build_zip(nodes, payload.name)

        response = StreamingResponse(
            io.BytesIO(zip_bytes),
            media_type="application/zip",
            headers={
                "Content-Disposition": f'attachment; filename="{payload.name}.zip"',
                "X-Structure-Valid": str(report["valid"]),
            },
        )

        response.headers["X-Structure-Fixes"] = "; ".join(report["fixes"])
        return response

    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))
