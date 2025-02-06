import os
import requests
from fastapi import HTTPException
from urllib.parse import urlencode
from dotenv import load_dotenv
from ..utils.file_handler import load_credentials, save_credentials

# Load environment variables
load_dotenv()

# Microsoft OAuth Credentials
CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")
REDIRECT_URI = os.getenv("REDIRECT_URI")

# OAuth Endpoints
AUTHORIZATION_URL = "https://login.microsoftonline.com/common/oauth2/v2.0/authorize"
TOKEN_URL = "https://login.microsoftonline.com/common/oauth2/v2.0/token"


def get_login_url():
    """Generates the Microsoft login URL."""
    print(REDIRECT_URI)
    params = {
        "client_id": CLIENT_ID,
        "response_type": "code",
        "redirect_uri": REDIRECT_URI,
        "response_mode": "query",
        "scope": "offline_access Mail.Read Mail.Send",
        "prompt": "select_account",
    }
    return f"{AUTHORIZATION_URL}?{urlencode(params)}"

def exchange_code_for_token(code: str):
    """Exchanges authorization code for an access token."""
    data = {
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "code": code,
        "redirect_uri": REDIRECT_URI,
        "grant_type": "authorization_code",
    }
    response = requests.post(TOKEN_URL, data=data)
    if response.status_code != 200:
        raise Exception(f"Error fetching token: {response.json()}")
    token_data = response.json()
    save_credentials(token_data)
    return token_data

def refresh_access_token():
    credentials = load_credentials()
    refresh_token = credentials.get("refresh_token")
    
    if not refresh_token:
        raise HTTPException(status_code=400, detail="Refresh token is missing.")

    data = {
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "grant_type": "refresh_token",
        "refresh_token": refresh_token,
        "scope": "https://graph.microsoft.com/.default"
    }

    response = requests.post(TOKEN_URL, data=data)

    print("Refresh Token Response:", response.json())  # Debugging

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=f"Failed to refresh token: {response.json()}")

    token_data = response.json()
    
    # Store the new access token
    credentials["access_token"] = token_data.get("access_token")
    credentials["refresh_token"] = token_data.get("refresh_token", refresh_token)  # Use new refresh token if provided
    save_credentials(credentials)

    return token_data
