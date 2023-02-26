from fastapi import APIRouter
from .endpoints import gifs, games, players, websocket

router = APIRouter()
router.include_router(gifs.router)
router.include_router(games.router)
router.include_router(players.router)
router.include_router(websocket.router)
