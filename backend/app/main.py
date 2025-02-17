from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.routing import APIRoute
from app.routes import email, tasks, assistant, auth

app = FastAPI(title="Jarvis-AI Backend")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(email.router, prefix="/api/email", tags=["Email"])
app.include_router(tasks.router, prefix="/api/tasks", tags=["Tasks"])
app.include_router(assistant.router, prefix="/api/assistant", tags=["Assistant"])
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])


# Debug print all routes after registration
@app.get("/debug/routes")
async def debug_routes():
    return {"routes": [
        {"path": route.path, "name": route.name, "methods": route.methods}
        for route in app.routes
    ]}