from fastapi import APIRouter, HTTPException
import requests
from ..utils.file_handler import load_credentials
from ..services.microsoft_auth import get_login_url, exchange_code_for_token, refresh_access_token

router = APIRouter()

GRAPH_API_URL = "https://graph.microsoft.com/v1.0/me/messages?$top=50"

@router.get("/login")  # No need for "/email/login"
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

@router.get("/messages")  # Just "/messages", not "/email/messages"
def get_emails():
    """Fetches the first 50 emails from the user's inbox."""
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
        }
        for email in emails
    ]

    return {
        "emails": processed_emails,
        "nextPage": next_link
    }

@router.get("/refresh-token")
def refresh_token():
    """Refreshes the OAuth access token."""
    try:
        new_token_data = refresh_access_token()
        return {"message": "Token refreshed", "token": new_token_data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
