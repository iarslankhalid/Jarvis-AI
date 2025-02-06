from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import email, tasks, assistant

app = FastAPI(title="Jarvis-AI Backend")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow frontend requests from Next.js
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Include routes
app.include_router(email.router, prefix="/api/email", tags=["Email"])
app.include_router(tasks.router, prefix="/api/tasks", tags=["Tasks"])
app.include_router(assistant.router, prefix="/api/assistant", tags=["Assistant"])

@app.get("/")
def root():
    return {"message": "Welcome to the AI Assistant Backend!"}
