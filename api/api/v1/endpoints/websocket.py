import time
from typing import List

from db.crud.games import read_game
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter()


class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)


manager = ConnectionManager()


@router.websocket("/ws/{game_id}")
async def websocket_endpoint(websocket: WebSocket, game_id: str):
    await manager.connect(websocket)
    # 2 mins Timeout
    count = 0
    timeout = 200
    try:
        data_cache = None
        while True:
            if data_cache:
                potentially_new_data = await read_game(game_id)
                if data_cache != potentially_new_data:
                    data_cache = potentially_new_data
                    await manager.broadcast(data_cache.json())
            else:
                data_cache = await read_game(game_id)
                await manager.broadcast(data_cache.json())
            if count >= timeout:
                raise WebSocketDisconnect("Timed out.")
            count += 1
            time.sleep(1)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    finally:
        manager.disconnect(websocket)
