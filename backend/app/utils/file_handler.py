import json
import os

CREDENTIALS_FILE = "credentials.json"

def load_credentials():
    """Load credentials from the JSON file."""
    try:
        if not os.path.exists(CREDENTIALS_FILE):
            return {}
        with open(CREDENTIALS_FILE, "r", encoding="utf-8") as file:
            data = json.load(file)
            return data if data else {}  # Handle empty JSON file
    except json.JSONDecodeError:
        return {}

def save_credentials(data):
    """Save credentials to a JSON file."""
    with open(CREDENTIALS_FILE, "w", encoding="utf-8") as file:
        json.dump(data, file, ensure_ascii=False, indent=4)
