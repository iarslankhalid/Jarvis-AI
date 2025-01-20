from pydantic import BaseModel
from uuid import UUID, uuid4

# Request model
class QueryRequest(BaseModel):
    session_id: UUID
    prompt: str

# Response model
class QueryResponse(BaseModel):
    response: str
    session_id: UUID

