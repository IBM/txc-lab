from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from bobverse.api.middlewares import RateLimitingMiddleware
from bobverse.api.router import router as api_router
from bobverse.core.config import get_app_settings
from bobverse.core.exceptions import add_exception_handlers
from bobverse.core.logging import configure_logger


def create_app() -> FastAPI:
    """
    Application factory, used to create application.
    """
    settings = get_app_settings()

    application = FastAPI(**settings.fastapi_kwargs)

    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_hosts,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    application.add_middleware(RateLimitingMiddleware)

    application.include_router(api_router, prefix="/api")

    add_exception_handlers(app=application)

    configure_logger()

    return application


app = create_app()
