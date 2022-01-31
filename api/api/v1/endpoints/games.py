
from db.crud.games import create_game, set_game_phrase
from db.models import Game
from fastapi import APIRouter, Depends, status
from pydantic import BaseModel
from v1.endpoints import valid_game_id

router = APIRouter()

class PostNewGame(BaseModel):
    name: str


@router.post("/game/")
async def post_game(new_game: PostNewGame):
    """Returns a new game"""
    return await create_game(new_game.name)


@router.get(
    "/game/{game_id}",
    response_model=Game,
    status_code=status.HTTP_200_OK,
)
async def get_game(game: Game = Depends(valid_game_id)):
    """Returns existing game details"""
    return game


class PostGamePhrase(BaseModel):
   phrase: str


@router.post(
    "/game/{game_id}",
    response_model=Game,
    status_code=status.HTTP_200_OK
)
async def update_phrase(phrase: PostGamePhrase, game: Game = Depends(valid_game_id)):
    return await set_game_phrase(game.id, phrase.phrase)
