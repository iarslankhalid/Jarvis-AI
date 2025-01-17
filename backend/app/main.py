from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import email, calendar, tasks, media, assistant, user, alexa

app = FastAPI(title="Jarvis-AI Backend")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow all origins for now; restrict to specific origins in production
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
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


@app.post("/")
def root():
    return {"message": "Welcome to the AI Assistant Backend post!"}