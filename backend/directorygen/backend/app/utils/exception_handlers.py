from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from app.utils.errors import ErrorResponse


async def validation_exception_handler(
    request: Request,
    exc: RequestValidationError,
):
    return JSONResponse(
        status_code=422,
        content=ErrorResponse(
            error="validation_error",
            message="Invalid request payload",
            details=str(exc),
        ).dict(),
    )


async def generic_exception_handler(
    request: Request,
    exc: Exception,
):
    return JSONResponse(
        status_code=400,
        content=ErrorResponse(
            error="processing_error",
            message="Failed to process request",
            details=str(exc),
        ).dict(),
    )
