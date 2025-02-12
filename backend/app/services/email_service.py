import requests
import base64
import os
from datetime import datetime, timedelta
from collections import defaultdict
from bs4 import BeautifulSoup
from ..services.auth_service import get_access_token
from ..utils.file_handler import load_credentials

GRAPH_API_URL = "https://graph.microsoft.com/v1.0/me/messages"
SEND_MAIL_URL = "https://graph.microsoft.com/v1.0/me/sendMail"
DRAFT_MAIL_URL = "https://graph.microsoft.com/v1.0/me/mailFolders/drafts/messages"
ATTACHMENT_DIR = "attachments"

EMAIL_CACHE = {}
CACHE_EXPIRY = timedelta(minutes=5)
LAST_FETCH_TIME = None

def clean_email_body(html_content):
    """Cleans HTML email body, removes previous replies."""
    soup = BeautifulSoup(html_content, "html.parser")

    for tag in soup.find_all(["hr", "div"], string=lambda x: x and "From:" in x):
        tag.extract()

    for tag in soup.find_all(["style", "script"]):
        tag.decompose()

    return str(soup)

def fetch_paginated_emails(skip: int, limit: int):
    """Fetches paginated emails."""
    headers = {"Authorization": f"Bearer {get_access_token()}"}
    response = requests.get(GRAPH_API_URL, headers=headers)

    # Debugging: Print response status and content
    print(f"Response Status: {response.status_code}")
    print(f"Response Content: {response.text}")

    if response.status_code != 200:
        raise Exception(f"Failed to fetch emails. Error: {response.text}")

    emails = response.json().get("value", [])
    paginated_emails = emails[skip: skip + limit]

    return {"emails": paginated_emails, "total": len(emails)}


def get_threaded_email(email_id: str):
    """Fetches a specific email, returning the entire conversation thread if applicable."""
    headers = {"Authorization": f"Bearer {get_access_token()}"}
    response = requests.get(f"{GRAPH_API_URL}/{email_id}", headers=headers)

    if response.status_code != 200:
        raise Exception("Failed to fetch email.")

    return response.json()

def mark_email_as_read_unread(email_id: str, is_read: bool):
    """Marks an email as read or unread."""
    headers = {"Authorization": f"Bearer {get_access_token()}", "Content-Type": "application/json"}
    response = requests.patch(f"{GRAPH_API_URL}/{email_id}", json={"isRead": is_read}, headers=headers)

    if response.status_code != 200:
        raise Exception("Failed to update email read status.")

    return {"message": f"Email marked as {'read' if is_read else 'unread'}."}

def send_email(to: str, subject: str, body: str, attachment):
    """Sends an email with optional attachments."""
    headers = {"Authorization": f"Bearer {get_access_token()}", "Content-Type": "application/json"}

    email_payload = {"message": {"subject": subject, "body": {"contentType": "HTML", "content": body}, "toRecipients": [{"emailAddress": {"address": to}}]}}

    response = requests.post(SEND_MAIL_URL, json=email_payload, headers=headers)

    if response.status_code != 202:
        raise Exception("Failed to send email.")

    return {"message": "Email sent successfully."}

def reply_to_email(email_id: str, reply_body: str):
    """Replies to an existing email."""
    headers = {"Authorization": f"Bearer {get_access_token()}", "Content-Type": "application/json"}
    email_reply = {"message": {"body": {"contentType": "HTML", "content": reply_body}}, "comment": reply_body}
    
    response = requests.post(f"{GRAPH_API_URL}/{email_id}/reply", json=email_reply, headers=headers)

    if response.status_code != 202:
        raise Exception("Failed to send reply.")

    return {"message": "Reply sent successfully."}

def save_draft_email(to: str, subject: str, body: str, attachment):
    """Saves an email as a draft."""
    headers = {"Authorization": f"Bearer {get_access_token()}", "Content-Type": "application/json"}
    draft_payload = {"subject": subject, "body": {"contentType": "HTML", "content": body}, "toRecipients": [{"emailAddress": {"address": to}}]}

    response = requests.post(DRAFT_MAIL_URL, json=draft_payload, headers=headers)

    if response.status_code != 201:
        raise Exception("Failed to save draft.")

    return {"message": "Draft saved successfully."}

def download_attachment(email_id: str, attachment_id: str):
    """Downloads a specific email attachment and serves it as a file."""
    headers = {"Authorization": f"Bearer {get_access_token()}"}
    response = requests.get(f"{GRAPH_API_URL}/{email_id}/attachments/{attachment_id}", headers=headers)

    if response.status_code != 200:
        raise Exception("Failed to fetch attachment.")

    attachment_data = response.json()
    file_name = attachment_data["name"]
    content_bytes = attachment_data["contentBytes"]

    os.makedirs(ATTACHMENT_DIR, exist_ok=True)
    file_path = os.path.join(ATTACHMENT_DIR, file_name)

    with open(file_path, "wb") as file:
        file.write(base64.b64decode(content_bytes))

    return file_path


def get_email_attachments(email_id: str):
    """Fetches all attachments of a given email."""
    headers = {"Authorization": f"Bearer {get_access_token()}"}
    response = requests.get(f"{GRAPH_API_URL}/{email_id}/attachments", headers=headers)

    if response.status_code != 200:
        raise Exception("Failed to fetch attachments.")

    return response.json().get("value", [])
