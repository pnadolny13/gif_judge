import os

import requests
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class Search(BaseModel):
    searchTerm: str


@router.post("/get_gifs")
async def get_gifs(search: Search):
    api_key = os.environ["GIPHY_API_KEY"]
    resp = requests.get(
        f"https://api.giphy.com/v1/gifs/search?api_key={api_key}&q={search.searchTerm}&limit=20&offset=0&rating=G&lang=en")
    resp.raise_for_status()
    return resp.json()
