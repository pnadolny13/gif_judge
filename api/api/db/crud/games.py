from db.dynamo import DynamoDB
from db.models import Game
from uuid import UUID, uuid4
from datetime import datetime, timedelta

async def create_game(name: str) -> Game:
    game = Game(
        id=str(uuid4()),
        name=name
    )
    DynamoDB().put_item(
        "games",
        game.dict()
    )
    return game

async def set_game_round(game_id: UUID) -> Game:
    return None

async def set_judge(game_id: UUID) -> Game:
    return None

async def set_game_phrase(game_id: str, phrase: str) -> Game:
    now = datetime.utcnow()
    start = now + timedelta(seconds=20)
    end = now + timedelta(seconds=80)

    resp = DynamoDB().update_item(
        "games",
        {
            "id": game_id
        },
        "set phrase=:p, round_start_ts=:s, round_end_ts=:e",
        {
            ":p": phrase,
            ":s": str(start.isoformat()) + 'Z',
            ":e": str(end.isoformat()) + 'Z',
        }
    )
    if resp:
        return Game(**resp.get("Attributes"))
    return None

async def read_game(game_id: str) -> Game:
    resp = DynamoDB().get_item(
        "games",
        {"id": game_id}
    )
    if resp:
        return Game(**resp)
    return None
