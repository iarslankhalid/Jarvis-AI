from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
import os
from ..services.microsoft_auth import get_login_url, exchange_code_for_token, refresh_token_auth
from ..utils.file_handler import load_credentials

router = APIRouter()

@router.get("/login")
def login():
    """Redirect user to Microsoft's login page."""
    return {"redirect_url": get_login_url()}

@router.get("/callback")
def callback(code: str):
    """Handles OAuth callback, exchanges code for a token, and stores it."""
    try:
        token_data = exchange_code_for_token(code)
        success_page_path = os.path.join("static", 'success.html')
        return FileResponse(success_page_path)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/refresh")
def refresh_token_api():
    """Refreshes the access token using the stored refresh token."""
    try:
        credentials = load_credentials()
        if not credentials:
            raise HTTPException(status_code=400, detail="No credentials found.")

        refresh_token = credentials.get("refresh_token")
        if not refresh_token:
            raise HTTPException(status_code=400, detail="No refresh token found.")

        new_token_data = refresh_token_auth(refresh_token)
        if not new_token_data:
            raise HTTPException(status_code=400, detail="Failed to refresh token.")

        return new_token_data

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
