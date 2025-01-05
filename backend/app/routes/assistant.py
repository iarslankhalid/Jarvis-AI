# Routes for OpenAI assistant
from fastapi import APIRouter
from app.services.nlp_service import generate_response

router = APIRouter()

@router.post("/query")
def query_assistant(prompt: str):
    response = generate_response(prompt)
    return {"response": response}
