from db.dynamo import DynamoDB
from db.models import Selection
from uuid import UUID

async def create_game_selection(game_id: UUID) -> Selection:
    return None

async def set_selection_url(game_id: UUID) -> Selection:
    return None

async def read_selection(game_id: UUID) -> Selection:
    return Selection(
        id=game_id,
    )

async def clear_game_selections(game_id: UUID) -> Selection:
    return Selection(
        id=game_id,
    )
