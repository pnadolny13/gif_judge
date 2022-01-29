import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum

from v1.routers import router

app = FastAPI()
app.include_router(router, prefix="/v1")

origins = [
    "http://localhost:3000",
    "https://pnadolny13.github.io"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# to make it work with Amazon Lambda, we create a handler object
handler = Mangum(app=app)
