from fastapi import APIRouter, HTTPException, Query, UploadFile, File
from ..services.email_service import (
    fetch_paginated_emails, 
    get_threaded_email, 
    mark_email_as_read_unread,
    send_email, 
    reply_to_email,
    save_draft_email,
    get_email_attachments,
    download_attachment
)

router = APIRouter()

### 📩 FETCH EMAILS ###
@router.get("/messages")
def get_emails(skip: int = Query(0, alias="offset"), limit: int = Query(50, alias="page_size")):
    """Fetches paginated emails."""
    return fetch_paginated_emails(skip, limit)

@router.get("/messages/{email_id}")
def get_email_by_id(email_id: str):
    """Fetches a specific email by ID. If part of a thread, returns all messages in that thread."""
    return get_threaded_email(email_id)

### ✅ MARK EMAIL AS READ/UNREAD ###
@router.patch("/messages/{email_id}/read-status")
def update_read_status(email_id: str, is_read: bool):
    """Marks an email as read or unread."""
    return mark_email_as_read_unread(email_id, is_read)

### ✉️ COMPOSE & SEND EMAIL ###
@router.post("/messages/compose")
def compose_email(to: str, subject: str, body: str, attachment: UploadFile = File(None)):
    """Composes and sends an email, with optional attachments."""
    return send_email(to, subject, body, attachment)

### 🔁 REPLY TO EMAIL ###
@router.post("/messages/reply")
def reply_email(email_id: str, reply_body: str):
    """Replies to an existing email."""
    return reply_to_email(email_id, reply_body)

### 📝 SAVE DRAFT EMAIL ###
@router.post("/messages/draft")
def draft_email(to: str, subject: str, body: str, attachment: UploadFile = File(None)):
    """Saves an email as a draft."""
    return save_draft_email(to, subject, body, attachment)

### 📎 FETCH & DOWNLOAD ATTACHMENTS ###
@router.get("/messages/{email_id}/attachments")
def fetch_attachments(email_id: str):
    """Fetches all attachments of a given email."""
    return get_email_attachments(email_id)

@router.get("/messages/{email_id}/attachments/{attachment_id}")
def fetch_attachment(email_id: str, attachment_id: str):
    """Downloads a specific email attachment."""
    return download_attachment(email_id, attachment_id)
