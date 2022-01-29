from fastapi import APIRouter
from .endpoints import hello, settings

router = APIRouter()
router.include_router(hello.router, tags=["Hello"])
router.include_router(settings.router)
