from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
import os
import requests
import base64
from ..utils.file_handler import load_credentials
from ..services.nlp_service import extract_task_from_email

router = APIRouter()

GRAPH_API_URL = "https://graph.microsoft.com/v1.0/me/messages"
SEND_MAIL_URL = "https://graph.microsoft.com/v1.0/me/sendMail"
ATTACHMENT_DIR = "attachments"


# -------------------------------
# 🔹 Fetch Emails
# -------------------------------

@router.get("/messages")
def get_emails():
    """Fetches the first 50 emails from the user's inbox."""
    credentials = load_credentials()
    access_token = credentials.get("access_token")

    if not access_token:
        raise HTTPException(status_code=400, detail="No linked account found.")

    headers = {"Authorization": f"Bearer {access_token}"}
    response = requests.get(GRAPH_API_URL, headers=headers)

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Failed to fetch emails.")

    emails = response.json().get("value", [])[:50]
    return {"emails": emails}

@router.get("/{email_id}")
def get_email_by_id(email_id: str):
    """Fetches a specific email by ID."""
    credentials = load_credentials()
    access_token = credentials.get("access_token")

    if not access_token:
        raise HTTPException(status_code=400, detail="No linked account found.")

    headers = {"Authorization": f"Bearer {access_token}"}
    email_response = requests.get(f"{GRAPH_API_URL}/{email_id}", headers=headers)

    if email_response.status_code != 200:
        raise HTTPException(status_code=email_response.status_code, detail="Failed to fetch email.")

    return email_response.json()

# -------------------------------
# 🔹 Handling Attachments
# -------------------------------

@router.get("/{email_id}/attachment/{attachment_id}")
def download_attachment(email_id: str, attachment_id: str):
    """Downloads an attachment from an email."""
    credentials = load_credentials()
    access_token = credentials.get("access_token")

    if not access_token:
        raise HTTPException(status_code=400, detail="No linked account found.")

    headers = {"Authorization": f"Bearer {access_token}"}
    attachment_response = requests.get(f"{GRAPH_API_URL}/{email_id}/attachments/{attachment_id}", headers=headers)

    if attachment_response.status_code != 200:
        raise HTTPException(status_code=attachment_response.status_code, detail="Failed to fetch attachment.")

    attachment_data = attachment_response.json()
    file_name = attachment_data["name"]
    content_bytes = attachment_data["contentBytes"]

    os.makedirs(ATTACHMENT_DIR, exist_ok=True)
    file_path = os.path.join(ATTACHMENT_DIR, file_name)

    with open(file_path, "wb") as file:
        file.write(base64.b64decode(content_bytes))

    return FileResponse(file_path, filename=file_name, media_type=attachment_data["contentType"])

# -------------------------------
# 🔹 Task Extraction from Email
# -------------------------------

@router.post("/{email_id}/extract-task")
def extract_task_from_email_api(email_id: str):
    """Extracts tasks from an email using AI."""
    email_data = get_email_by_id(email_id)
    task = extract_task_from_email(email_data["subject"], email_data["body"])
    return {"email_id": email_id, "task": task}

# -------------------------------
# 🔹 Sending Emails
# -------------------------------

@router.post("/send")
def send_email(to: str, subject: str, body: str):
    """Sends an email via Microsoft Graph API."""
    credentials = load_credentials()
    access_token = credentials.get("access_token")

    if not access_token:
        raise HTTPException(status_code=400, detail="No linked account found.")

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    email_payload = {
        "message": {
            "subject": subject,
            "body": {"contentType": "HTML", "content": body},
            "toRecipients": [{"emailAddress": {"address": to}}]
        }
    }

    response = requests.post(SEND_MAIL_URL, json=email_payload, headers=headers)

    if response.status_code != 202:
        raise HTTPException(status_code=response.status_code, detail="Failed to send email.")

    return {"message": "Email sent successfully."}