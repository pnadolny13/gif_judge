from db.dynamo import DynamoDB
from db.models import Player
from uuid import UUID

async def create_player(game_id: UUID) -> Player:
    return None

async def set_player_game_score(game_id: UUID) -> Player:
    return None

async def read_player(game_id: UUID) -> Player:
    return Player(
        id=game_id,
    )
