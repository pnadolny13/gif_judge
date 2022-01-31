from db.models import Game
from db.crud.games import read_game
from fastapi import HTTPException, status


async def valid_game_id(
    game_id: str
) -> Game:
    game = await read_game(game_id)
    if game is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Game not found",
        )
    return game
