# app/main.py
import openai
import os
from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, List
from uuid import UUID, uuid4

from ..schemas.assistant_schema import QueryRequest, QueryResponse

from dotenv import load_dotenv
load_dotenv()

router = APIRouter()

OPENAI_KEY = os.getenv("OPENAI_KEY")
openai.api_key = OPENAI_KEY

# In-memory storage for session contexts
session_contexts: Dict[UUID, List[Dict[str, str]]] = {}

@router.post("/query", response_model=QueryResponse)
async def query_assistant(request: QueryRequest):
    try:
        # Retrieve or initialize session context
        if request.session_id not in session_contexts:
            session_contexts[request.session_id] = []

        # Append user input to session context
        session_contexts[request.session_id].append({"role": "user", "content": request.prompt})

        # Prepare messages for OpenAI API
        messages = session_contexts[request.session_id]

        # Call OpenAI API
        openai_response = openai.chat.completions.create(
            model="gpt-3.5-turbo",  # Use your preferred chat model
            messages=messages
        )

        # Extract response text
        message_content = openai_response.choices[0].message.content.strip()

        # Append assistant's response to session context
        session_contexts[request.session_id].append({"role": "assistant", "content": message_content})

        return {"response": message_content, "session_id": request.session_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/new-session", response_model=QueryResponse)
async def new_session():
    """Create a new session and return its ID."""
    session_id = uuid4()
    session_contexts[session_id] = []
    return {"response": "New session created.", "session_id": session_id}
