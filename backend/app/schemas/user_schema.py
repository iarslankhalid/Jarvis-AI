# Pydantic schema for users

from pydantic import BaseModel

class UserPreferences(BaseModel):
    notifications_enabled: bool
    preferred_time_zone: str
