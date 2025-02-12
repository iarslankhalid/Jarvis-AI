import uvicorn
import os

if __name__ == "__main__":
    # Check if running in production or development mode
    ENV = os.getenv("ENV", "development")  # Default to "development" if ENV is not set

    if ENV == "production":
        # Production settings (Gunicorn/Uvicorn setup)
        uvicorn.run("app.main:app", host="0.0.0.0", port=8000, workers=4)
    else:
        # Development settings (Auto-reload & Debugging)
        uvicorn.run("app.main:app", host="127.0.0.1", port=5000, reload=True)
