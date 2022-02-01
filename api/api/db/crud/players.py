from db.dynamo import DynamoDB
from db.models import Player, Game
from uuid import UUID, uuid4

async def create_player(game: Game, name: str) -> Player:
    
    player = Player(
        id=str(uuid4()),
        game_id=str(game.id),
        name=name
    )
    DynamoDB().put_item(
        "players",
        player.dict()
    )
    return player

async def set_player_game_score(game_id: UUID) -> Player:
    return None

async def read_player(game_id: UUID) -> Player:
    return Player(
        id=game_id,
    )
