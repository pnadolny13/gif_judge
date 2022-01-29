from fastapi import APIRouter
from .endpoints import hello, get_gifs

router = APIRouter()
router.include_router(hello.router, tags=["Hello"])
router.include_router(get_gifs.router)
