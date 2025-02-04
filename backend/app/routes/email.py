from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
import os
import requests
import base64
from ..utils.file_handler import load_credentials
from ..services.microsoft_auth import get_login_url, exchange_code_for_token, refresh_access_token
from ..services.nlp_service import generate_ai_reply, extract_task_from_email

router = APIRouter()

GRAPH_API_URL = "https://graph.microsoft.com/v1.0/me/messages"
SEND_MAIL_URL = "https://graph.microsoft.com/v1.0/me/sendMail"

ATTACHMENT_DIR = "attachments"

# GET Requests
@router.get("/login")
def login():
    """Redirect user to Microsoft's login page."""
    return {"redirect_url": get_login_url()}

@router.get("/callback")
def callback(code: str):
    """Handles the OAuth callback, exchanges code for a token, and stores it."""
    try:
        token_data = exchange_code_for_token(code)
        return {"message": "Email linked successfully!", "token": token_data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/messages")
def get_emails():
    """Fetches the first 50 emails from the user's inbox and includes hasAttachments flag."""
    credentials = load_credentials()
    access_token = credentials.get("access_token")

    if not access_token:
        raise HTTPException(status_code=400, detail="No linked account found or credentials missing.")

    headers = {"Authorization": f"Bearer {access_token}"}
    response = requests.get(GRAPH_API_URL, headers=headers)

    if response.status_code != 200:
        error_data = response.json()
        raise HTTPException(status_code=response.status_code, detail="Failed to fetch emails", headers={"Error-Details": str(error_data)})

    email_data = response.json()
    emails = email_data.get("value", [])[:50]
    next_link = email_data.get("@odata.nextLink", None)

    processed_emails = [
        {
            "id": email["id"],
            "subject": email.get("subject", "(No Subject)"),
            "sender": email.get("from", {}).get("emailAddress", {}).get("name", "Unknown Sender"),
            "sender_email": email.get("from", {}).get("emailAddress", {}).get("address", "No Email Address"),
            "receivedDateTime": email.get("receivedDateTime", "Unknown Date"),
            "preview": email.get("bodyPreview", ""),
            "webLink": email.get("webLink", "#"),
            "hasAttachments": email.get("hasAttachments", False)  # Include attachment flag
        }
        for email in emails
    ]

    return {"emails": processed_emails, "nextPage": next_link}

@router.get("/{email_id}")
def get_email_by_id(email_id: str):
    """Fetches a specific email by ID including body, attachments, and metadata."""
    credentials = load_credentials()
    access_token = credentials.get("access_token")
    
    if not access_token:
        raise HTTPException(status_code=400, detail="No linked account found or credentials missing.")
    
    headers = {"Authorization": f"Bearer {access_token}"}

    # Fetch the email data
    email_response = requests.get(f"{GRAPH_API_URL}/{email_id}", headers=headers)
    if email_response.status_code != 200:
        raise HTTPException(status_code=email_response.status_code, detail="Failed to fetch email.")

    email_data = email_response.json()

    # Check if email has attachments
    attachments = []
    if email_data.get("hasAttachments", False):
        attachments_response = requests.get(f"{GRAPH_API_URL}/{email_id}/attachments", headers=headers)
        
        if attachments_response.status_code == 200:
            attachments_data = attachments_response.json().get("value", [])
            
            # Extract attachment details
            for attachment in attachments_data:
                attachment_info = {
                    "id": attachment.get("id"),
                    "name": attachment.get("name"),
                    "contentType": attachment.get("contentType"),
                    "size": attachment.get("size"),
                    "isInline": attachment.get("isInline"),
                }

                # If it's a file attachment (not an inline image)
                if attachment.get("@odata.type") == "#microsoft.graph.fileAttachment":
                    attachment_info["contentBytes"] = attachment.get("contentBytes")  # Base64 encoded data
                
                attachments.append(attachment_info)

    # Construct response
    return {
        "id": email_data["id"],
        "subject": email_data.get("subject", "(No Subject)"),
        "sender": email_data.get("from", {}).get("emailAddress", {}).get("name", "Unknown Sender"),
        "sender_email": email_data.get("from", {}).get("emailAddress", {}).get("address", "No Email Address"),
        "receivedDateTime": email_data.get("receivedDateTime", "Unknown Date"),
        "body": email_data.get("body", {}).get("content", ""),
        "webLink": email_data.get("webLink", "#"),
        "hasAttachments": email_data.get("hasAttachments", False),
        "attachments": attachments  # List of attachments
    }
    
    
@router.get("/{email_id}/attachment/{attachment_id}")
def download_attachment(email_id: str, attachment_id: str):
    """Fetches, decodes, and serves an attachment as a downloadable file."""
    credentials = load_credentials()
    access_token = credentials.get("access_token")

    if not access_token:
        raise HTTPException(status_code=400, detail="No linked account found or credentials missing.")

    headers = {"Authorization": f"Bearer {access_token}"}
    attachment_response = requests.get(f"{GRAPH_API_URL}/{email_id}/attachments/{attachment_id}", headers=headers)

    if attachment_response.status_code != 200:
        raise HTTPException(status_code=attachment_response.status_code, detail="Failed to fetch attachment.")

    attachment_data = attachment_response.json()
    file_name = attachment_data["name"]
    content_bytes = attachment_data["contentBytes"]

    # Decode Base64 and save to a temporary directory
    os.makedirs(ATTACHMENT_DIR, exist_ok=True)
    file_path = os.path.join(ATTACHMENT_DIR, file_name)

    with open(file_path, "wb") as file:
        file.write(base64.b64decode(content_bytes))

    # Return the file for download
    return FileResponse(file_path, filename=file_name, media_type=attachment_data["contentType"])


@router.get("/refresh-token")
def refresh_token():
    """Refreshes the OAuth access token."""
    try:
        new_token_data = refresh_access_token()
        return {"message": "Token refreshed", "token": new_token_data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# POST Requests
@router.post("/{email_id}/generate-reply")
def generate_ai_reply_for_email(email_id: str):
    """Generates an AI-powered reply suggestion for a given email."""
    email_data = get_email_by_id(email_id)
    reply_text = generate_ai_reply(email_data["body"])  # Assuming generate_ai_reply uses OpenAI
    return {"email_id": email_id, "suggested_reply": reply_text}

@router.post("/{email_id}/extract-task")
def extract_task_from_email_api(email_id: str):
    """Extracts tasks from an email using AI."""
    email_data = get_email_by_id(email_id)
    task = extract_task_from_email(email_data["subject"], email_data["body"])
    return {"email_id": email_id, "task": task}

@router.post("/send")
def send_email(to: str, subject: str, body: str):
    """Sends an email via Microsoft Graph API."""
    credentials = load_credentials()
    access_token = credentials.get("access_token")
    
    if not access_token:
        raise HTTPException(status_code=400, detail="No linked account found or credentials missing.")
    
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
