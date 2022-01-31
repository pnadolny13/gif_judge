from fastapi import APIRouter
from .endpoints import gifs, games

router = APIRouter()
router.include_router(gifs.router)
router.include_router(games.router)
