
from db.crud.players import create_player, read_players
from db.models import Game
from fastapi import APIRouter, Depends, status
from pydantic import BaseModel
from v1.endpoints import valid_game_id

router = APIRouter()

class PostNewPlayer(BaseModel):
    name: str


@router.post("/game/{game_id}/player")
async def post_player(new_player: PostNewPlayer, game: Game = Depends(valid_game_id)):
    """Returns a new player"""
    return await create_player(game, new_player.name)

@router.get("/game/{game_id}/players")
async def get_player(game: Game = Depends(valid_game_id)):
    """Returns all players"""
    return await read_players(game.id)
