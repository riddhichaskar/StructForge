from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from slowapi.middleware import SlowAPIMiddleware
from slowapi.errors import RateLimitExceeded

from app.config import settings
from app.utils.security import limiter

from app.api.health import router as health_router
from app.api.preview import router as preview_router
from app.api.generate import router as generate_router
from app.api.import_zip import router as import_zip_router


def create_app() -> FastAPI:
    app = FastAPI(
        title="DirectoryGen API",
        description="Generate, preview, import directory structures as ZIP",
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json",
    )

    # -------------------------
    # Rate Limiting
    # -------------------------
    app.state.limiter = limiter
    app.add_middleware(SlowAPIMiddleware)

    @app.exception_handler(RateLimitExceeded)
    async def rate_limit_handler(request, exc):
        return JSONResponse(
            status_code=429,
            content={"detail": "Too many requests. Please slow down."},
        )

    # -------------------------
    # CORS
    # -------------------------
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # -------------------------
    # Routers
    # -------------------------
    app.include_router(health_router, tags=["Health"])
    app.include_router(preview_router, prefix="/preview", tags=["Preview"])
    app.include_router(generate_router, prefix="/generate", tags=["Generate"])
    app.include_router(import_zip_router, prefix="/import-zip", tags=["Import ZIP"])

    return app


app = create_app()
