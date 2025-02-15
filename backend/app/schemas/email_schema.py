# Pydantic schema for emails

from pydantic import BaseModel

class EmailReplyRequest(BaseModel):
    reply_body: str
