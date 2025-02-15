import requests
from fastapi import HTTPException
from datetime import datetime, timezone

from ..utils.file_handler import load_credentials, save_credentials
from .microsoft_auth import refresh_token_auth

GRAPH_API_URL = "https://graph.microsoft.com/v1.0/me/messages"
SEND_MAIL_URL = "https://graph.microsoft.com/v1.0/me/sendMail"


# -------------------------------
# 🔹 Helper Function to Retry on 401
# -------------------------------

def retry_on_401(request_func, url, **kwargs):
    """Retries a request once if a 401 Unauthorized error occurs."""
    credentials = load_credentials()
    access_token = credentials.get("access_token")
    refresh_token = credentials.get("refresh_token")

    # Inject Authorization Header
    if "headers" not in kwargs:
        kwargs["headers"] = {}
    kwargs["headers"]["Authorization"] = f"Bearer {access_token}"

    # First Attempt
    response = request_func(url, **kwargs)

    if response.status_code == 401:  # Token expired
        print("🔄 Refreshing token due to 401 Unauthorized error...")
        new_access_token = refresh_token_auth(refresh_token)

        # Retry with new token
        kwargs["headers"]["Authorization"] = f"Bearer {new_access_token}"
        response = request_func(url, **kwargs)

    return response


# -------------------------------
# 🔹 Fetch Emails
# -------------------------------

def fetch_emails(limit: int = 50):
    """Fetches emails from the inbox with only required fields and includes next page link."""
    params = {"$top": limit, "$orderby": "receivedDateTime DESC"}
    response = retry_on_401(requests.get, GRAPH_API_URL, params=params)

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Failed to fetch emails.")

    email_data = response.json()
    emails = email_data.get("value", [])
    next_page_link = email_data.get("@odata.nextLink", None)

    # ✅ Extract only required fields
    processed_emails = [
        {
            "id": email.get("id"),
            "from": {
                "name": email.get("from", {}).get("emailAddress", {}).get("name", "Unknown Sender"),
                "email": email.get("from", {}).get("emailAddress", {}).get("address", "No Email Address"),
            },
            "subject": email.get("subject", "(No Subject)"),
            "body_preview": email.get("bodyPreview", ""),
            "date": email.get("receivedDateTime", "Unknown Date"),
            "hasAttachments": email.get("hasAttachments", False),
            "isRead": email.get("isRead", False),
            "conversationId": email.get("conversationId", ""),
        }
        for email in emails
    ]

    return {
        "emails": processed_emails,
        "nextPage": next_page_link
    }




def fetch_email_by_id(email_id: str):
    """Fetches a specific email by ID with only required fields and includes attachment details."""
    response = retry_on_401(requests.get, f"{GRAPH_API_URL}/{email_id}")

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Failed to fetch email.")

    email_data = response.json()

    # Extract required email fields
    email_info = {
        "id": email_data.get("id"),
        "subject": email_data.get("subject", "(No Subject)"),
        "body_preview": email_data.get("bodyPreview", ""),
        "date": email_data.get("receivedDateTime", "Unknown Date"),
        "isRead": email_data.get("isRead", False),
        "hasAttachments": email_data.get("hasAttachments", False),
        "conversationId": email_data.get("conversationId", ""),
        "sender": {
            "name": email_data.get("from", {}).get("emailAddress", {}).get("name", "Unknown Sender"),
            "email": email_data.get("from", {}).get("emailAddress", {}).get("address", "No Email Address"),
        },
        "toRecipients": [
            {
                "name": recipient.get("emailAddress", {}).get("name", "Unknown Recipient"),
                "email": recipient.get("emailAddress", {}).get("address", "No Email Address"),
            }
            for recipient in email_data.get("toRecipients", [])
        ],
        "ccRecipients": [
            {
                "name": recipient.get("emailAddress", {}).get("name", "Unknown Recipient"),
                "email": recipient.get("emailAddress", {}).get("address", "No Email Address"),
            }
            for recipient in email_data.get("ccRecipients", [])
        ],
        "webLink": email_data.get("webLink", "#"),
        "body": email_data.get("body", {}).get("content", ""),
        "attachments": []
    }

    # ✅ If email has attachments, fetch and include their details
    if email_data.get("hasAttachments", False):
        attachment_response = retry_on_401(requests.get, f"{GRAPH_API_URL}/{email_id}/attachments")

        if attachment_response.status_code == 200:
            attachments_data = attachment_response.json().get("value", [])

            email_info["attachments"] = [
                {
                    "id": attachment.get("id"),
                    "name": attachment.get("name"),
                    "size": attachment.get("size"),
                    "contentType": attachment.get("contentType"),
                    "isInline": attachment.get("isInline", False),
                }
                for attachment in attachments_data
            ]

    return email_info



# -------------------------------
# 🔹 Mark Email as Read/Unread
# -------------------------------

def mark_email_as_read(email_id: str):
    """Marks an email as read or unread."""
    credentials = load_credentials()
    access_token = credentials.get("access_token")

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    response = requests.patch(f"{GRAPH_API_URL}/{email_id}", json={"isRead": True}, headers=headers)

    if response.status_code not in [200, 204]:
        raise HTTPException(status_code=response.status_code, detail="Failed to update email read status.")


# -------------------------------
# 🔹 Fetch Attachments
# -------------------------------

def fetch_attachment(email_id: str, attachment_id: str):
    """Fetches an email attachment."""
    response = retry_on_401(requests.get, f"{GRAPH_API_URL}/{email_id}/attachments/{attachment_id}")

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Failed to fetch attachment.")

    return response.json()


# -------------------------------
# 🔹 Send Email
# -------------------------------

def send_email(to: str, subject: str, body: str):
    """Sends an email via Microsoft Graph API."""
    email_payload = {
        "message": {
            "subject": subject,
            "body": {"contentType": "HTML", "content": body},
            "toRecipients": [{"emailAddress": {"address": to}}]
        }
    }

    response = retry_on_401(requests.post, SEND_MAIL_URL, json=email_payload)

    if response.status_code != 202:
        raise HTTPException(status_code=response.status_code, detail="Failed to send email.")

    return {"message": "✅ Email sent successfully."}


# -------------------------------
# 🔹 Refresh Mailbox
# -------------------------------

def refresh_mailbox(last_scan: str):
    """Checks for new emails since the last scan."""
    credentials = load_credentials()
    access_token = credentials.get("access_token")

    headers = {"Authorization": f"Bearer {access_token}"}
    current_time = datetime.now(timezone.utc).isoformat()

    params = {"$filter": f"receivedDateTime gt {last_scan}", "$orderby": "receivedDateTime DESC"} if last_scan else {"$top": 1, "$orderby": "receivedDateTime DESC"}

    response = retry_on_401(requests.get, GRAPH_API_URL, headers=headers, params=params)

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Failed to fetch emails.")

    emails = response.json().get("value", [])

    return {
        "last_scan": current_time,
        "new_emails": bool(emails),
        "count": len(emails),
    }
    
    

# -------------------------------
# 🔹 Reply to an Email
# -------------------------------

def reply_to_email(email_id: str, reply_body: str):
    """Replies to an existing email using Microsoft Graph API."""
    credentials = load_credentials()
    access_token = credentials.get("access_token")

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    # # ✅ Ensure reply body is properly formatted as HTML
    # formatted_reply = reply_body.replace("\n", "<br>") if "\n" in reply_body else reply_body

    email_reply_payload = {
        "message": {
            "body": {
                "contentType": "HTML",  # Ensures proper formatting
                "content": reply_body
            }
        }
    }

    response = requests.post(f"{GRAPH_API_URL}/{email_id}/reply", json=email_reply_payload, headers=headers)

    if response.status_code != 202:
        raise HTTPException(status_code=response.status_code, detail="Failed to send reply.")

    return {"message": "✅ Reply sent successfully."}