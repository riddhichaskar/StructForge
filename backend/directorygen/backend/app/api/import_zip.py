from fastapi import APIRouter, UploadFile, File, HTTPException, Request
from fastapi.responses import JSONResponse

from app.utils.security import limiter
from app.config import settings

from dirgen_core.zip_parser import parse_zip_to_nodes
from dirgen_core.report import ParseReport
from dirgen_core.builder import nodes_to_ascii

router = APIRouter(prefix="/import-zip", tags=["Import ZIP"])


@router.post("")
@limiter.limit("5/minute")
async def import_zip(request: Request, file: UploadFile = File(...)):
    if not file.filename.endswith(".zip"):
        raise HTTPException(status_code=400, detail="Only ZIP files allowed")

    content = await file.read()
    size_mb = len(content) / (1024 * 1024)

    if size_mb > settings.MAX_ZIP_SIZE_MB:
        raise HTTPException(
            status_code=413,
            detail="ZIP too large"
        )

    try:
        report = ParseReport()
        nodes = parse_zip_to_nodes(content)

        ascii_tree = nodes_to_ascii(nodes, root_name=file.filename)

        report.add_fix("Parsed ZIP structure on backend")

        return JSONResponse({
            "nodes": [
                {
                    "name": n.name,
                    "is_dir": n.is_dir,
                    "depth": n.depth
                } for n in nodes
            ],
            "text": ascii_tree,
            "summary": report.to_dict()
        })

    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))
