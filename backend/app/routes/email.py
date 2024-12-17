# Routes for email management

from fastapi import APIRouter
from app.schemas.email_schema import EmailResponse

router = APIRouter()

@router.get("/categorize")
def categorize_emails():
    # Dummy data
    return {"urgent": 3, "normal": 5, "informational": 10}

@router.post("/draft", response_model=EmailResponse)
def draft_email(subject: str, body: str):
    # Placeholder for OpenAI draft logic
    return {"subject": subject, "body": f"Drafted reply: {body}"}
