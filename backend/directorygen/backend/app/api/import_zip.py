from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse

from dirgen_core.zip_utils import extract_structure_from_zip
from app.config import settings

router = APIRouter(prefix="/import-zip", tags=["Import"])


@router.post("")
@limiter.limit("5/minute")
async def import_zip(file: UploadFile = File(...)):
    if not file.filename.endswith(".zip"):
        raise HTTPException(status_code=400, detail="Only ZIP files are allowed")

    content = await file.read()

    size_mb = len(content) / (1024 * 1024)
    if size_mb > settings.MAX_ZIP_SIZE_MB:
        raise HTTPException(
            status_code=413,
            detail=f"ZIP exceeds max size of {settings.MAX_ZIP_SIZE_MB} MB",
        )

    try:
        structure_text = extract_structure_from_zip(
            content,
            max_nodes=settings.MAX_NODES,
            max_depth=settings.MAX_DEPTH,
        )

        return JSONResponse(
            {
                "structure": structure_text
            }
        )

    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))
