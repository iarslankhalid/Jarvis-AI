# Routes for Alexa integration
from fastapi import APIRouter

router = APIRouter()

@router.post("/response")
def alexa_query(query: str):
    return {"query": query, "response": f"Alexa says: {query}"}
