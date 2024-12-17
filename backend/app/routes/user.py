# Routes for user preferences
from fastapi import APIRouter
from app.schemas.user_schema import UserPreferences

router = APIRouter()

preferences = {}

@router.get("/preferences")
def get_preferences():
    return preferences

@router.post("/preferences")
def update_preferences(prefs: UserPreferences):
    global preferences
    preferences = prefs.dict()
    return {"message": "Preferences updated", "preferences": preferences}
