# Pydantic schema for calendar

from pydantic import BaseModel

class Event(BaseModel):
    title: str
    time: str
