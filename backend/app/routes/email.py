from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import StreamingResponse
import base64
from cachetools import TTLCache
import time

from ..services.email_service import (
    fetch_emails,
    fetch_email_by_id,
    mark_email_as_read,
    fetch_attachment,
    send_email,
    refresh_mailbox,
    reply_to_email
)
from ..services.nlp_service import extract_task_from_email, generate_ai_reply
from ..schemas.email_schema import EmailReplyRequest
from .tasks import add_task

router = APIRouter()

# -------------------------------
# 🔹 Fetch Emails
# -------------------------------

# Cache for storing the last 50 emails (expires in 2 minutes)
EMAIL_CACHE = TTLCache(maxsize=1, ttl=300)

@router.get("/inbox")
def get_emails(background_tasks: BackgroundTasks, limit: int = 50):
    """Fetch emails and process new ones asynchronously in the background."""
    refresh_output = refresh_mailbox(background_tasks)

    if refresh_output["new_emails"]:
        emails = fetch_emails(limit)
        EMAIL_CACHE["latest_emails"] = emails
    else:
        emails = EMAIL_CACHE.get("latest_emails", fetch_emails(limit))

    return emails

# -------------------------------
# 🔹 Fetch Email by ID
# -------------------------------

@router.get("/inbox/{email_id}")
def get_email_by_id(background_tasks: BackgroundTasks, email_id: str):
    """Fetches a specific email by ID."""
    email_data = fetch_email_by_id(email_id)

    if not email_data["isRead"]:
        background_tasks.add_task(mark_email_as_read, email_id)

    return email_data


# -------------------------------
# 🔹 Generate AI Reply to Email
# -------------------------------

@router.get("/inbox/{email_id}/generate-reply")
def generate_ai_reply_route(email_id: str):
    """Generates an AI-powered reply for an email."""
    email_data = fetch_email_by_id(email_id)
    ai_reply = generate_ai_reply(email_data)
    return {"email_id": email_id, "generated_reply": ai_reply}


# -------------------------------
# 🔹 Reply to an Email
# -------------------------------

@router.post("/inbox/{email_id}/reply")
def reply_to_email_route(email_id: str, request: EmailReplyRequest):
    """Replies to a specific email."""
    return reply_to_email(email_id, request.reply_body)


# -------------------------------
# 🔹 Stream Email Attachments
# -------------------------------

@router.get("/inbox/{email_id}/attachments/{attachment_id}")
def download_attachment(email_id: str, attachment_id: str):
    """Streams an email attachment."""
    
    attachment_data = fetch_attachment(email_id, attachment_id)
    file_name = attachment_data["name"]
    content_bytes = base64.b64decode(attachment_data["contentBytes"])
    content_type = attachment_data["contentType"]

    return StreamingResponse(
        iter([content_bytes]),
        media_type=content_type,
        headers={"Content-Disposition": f"attachment; filename={file_name}"}
    )


# -------------------------------
# 🔹 Send Emails
# -------------------------------

@router.post("/send")
def send_email_route(to: str, subject: str, body: str):
    """Sends an email via Microsoft Graph API."""
    return send_email(to, subject, body)


# -------------------------------
# 🔹 Refresh Mailbox
# -------------------------------

@router.get("/refresh-mailbox")
def refresh_mailbox_api(background_tasks: BackgroundTasks):
    return refresh_mailbox(background_tasks)


