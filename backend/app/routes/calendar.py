# Routes for calendar and meetings

from fastapi import APIRouter
from app.schemas.calendar_schema import Event

router = APIRouter()

@router.get("/events")
def get_events():
    return [{"title": "Team Meeting", "time": "10 AM"}]

@router.post("/schedule")
def schedule_meeting(event: Event):
    return {"message": f"Meeting '{event.title}' scheduled for {event.time}"}
