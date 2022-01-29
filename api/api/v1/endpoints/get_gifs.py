from fastapi import APIRouter

router = APIRouter()


@router.post("/get_gifs")
async def hello():
    return {"hello": "world"}
