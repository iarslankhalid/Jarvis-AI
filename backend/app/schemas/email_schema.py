# Pydantic schema for emails

from pydantic import BaseModel

class EmailResponse(BaseModel):
    subject: str
    body: str
