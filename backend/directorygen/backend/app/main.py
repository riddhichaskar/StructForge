from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from slowapi.middleware import SlowAPIMiddleware
from slowapi.errors import RateLimitExceeded

from app.config import settings
from app.utils.security import limiter, rate_limit_exceeded_handler

from app.api.health import router as health_router
from app.api.preview import router as preview_router
from app.api.generate import router as generate_router
from app.api.import_zip import router as import_zip_router


def create_app() -> FastAPI:
    app = FastAPI(
        title="DirectoryGen API",
        description="Generate, preview, and import directory structures",
        version="1.0.0",
    )

    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, rate_limit_exceeded_handler)
    app.add_middleware(SlowAPIMiddleware)

    @app.exception_handler(RateLimitExceeded)
    async def rate_limit_handler(request, exc):
        return JSONResponse(
            status_code=429,
            content={"detail": "Too many requests. Please slow down."},
        )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(health_router)
    app.include_router(preview_router)
    app.include_router(generate_router)
    app.include_router(import_zip_router)

    return app


app = create_app()
