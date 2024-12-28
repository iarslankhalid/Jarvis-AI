# FastAPI entry point

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import email, calendar, tasks, media, assistant, user, alexa

app = FastAPI(title="Jarvis-AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500"],  # Adjust the frontend URL as needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(email.router, prefix="/api/email", tags=["Email"])
app.include_router(calendar.router, prefix="/api/calendar", tags=["Calendar"])
app.include_router(tasks.router, prefix="/api/tasks", tags=["Tasks"])
app.include_router(media.router, prefix="/api/media", tags=["Media"])
app.include_router(assistant.router, prefix="/api/assistant", tags=["Assistant"])
app.include_router(user.router, prefix="/api/user", tags=["User"])
app.include_router(alexa.router, prefix="/api/alexa", tags=["Alexa"])

@app.get("/")
def root():
    return {"message": "Welcome to the AI Assistant Backend!"}
