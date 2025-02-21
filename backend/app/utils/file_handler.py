import json
import os
from datetime import datetime

CREDENTIALS_FILE = "credentials.json"
LAST_SCAN_FILE = "last_scan_time.json"


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


def load_last_scan_time():
    """Load the last scan time from a JSON file."""
    try:
        if not os.path.exists(LAST_SCAN_FILE):
            return None
        with open(LAST_SCAN_FILE, "r", encoding="utf-8") as file:
            data = json.load(file)
            return data.get("last_scan_time")
    except json.JSONDecodeError:
        return None


def save_last_scan_time():
    """Save the current datetime as the last scan time to a JSON file."""
    data = {"last_scan_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
    with open(LAST_SCAN_FILE, "w", encoding="utf-8") as file:
        json.dump(data, file, ensure_ascii=False, indent=4)
