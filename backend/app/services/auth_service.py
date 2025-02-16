import requests
from ..utils.file_handler import load_credentials

GRAPH_API_TOKEN_URL = "https://login.microsoftonline.com/common/oauth2/v2.0/token"

def get_access_token():
    """Retrieves a fresh access token from stored credentials."""
    credentials = load_credentials()
    access_token = credentials.get("access_token")

    if not access_token:
        raise Exception("No linked account found or credentials missing.")

    return access_token

def refresh_token():
    """Refreshes the OAuth token if expired."""
    credentials = load_credentials()
    refresh_token = credentials.get("refresh_token")
    
    if not refresh_token:
        raise Exception("No refresh token found. Please re-authenticate.")

    data = {
        "client_id": credentials["client_id"],
        "client_secret": credentials["client_secret"],
        "refresh_token": refresh_token,
        "grant_type": "refresh_token"
    }
    
    response = requests.post(GRAPH_API_TOKEN_URL, data=data)

    if response.status_code != 200:
        raise Exception("Failed to refresh token")

    new_tokens = response.json()
    return new_tokens
