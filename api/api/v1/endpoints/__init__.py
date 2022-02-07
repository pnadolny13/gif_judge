from db.models import Game, Player
from db.crud.games import read_game
from db.crud.players import read_player
from fastapi import HTTPException, status
from fastapi.param_functions import Depends


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


async def valid_player_id(
    player_id: str,
    game: Game = Depends(valid_game_id)
) -> Player:
    player = await read_player(player_id)
    if player is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Player not found",
        )
    elif player.game_id != game.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Player found but game mismatch",
        )
    return player