# Routes for media search
from fastapi import APIRouter

router = APIRouter()

@router.get("/search/images")
def search_images(query: str):
    return {"query": query, "results": ["image1.jpg", "image2.png"]}

@router.get("/search/videos")
def search_videos(query: str):
    return {"query": query, "results": ["video1.mp4", "video2.mp4"]}
