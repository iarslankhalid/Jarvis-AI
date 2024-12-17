# Routes for tasks and voice notes
from fastapi import APIRouter
from app.schemas.task_schema import Task

router = APIRouter()

tasks = []

@router.post("/add")
def add_task(task: Task):
    tasks.append(task)
    return {"message": f"Task '{task.name}' added", "tasks": tasks}

@router.get("/list")
def list_tasks():
    return {"tasks": tasks}
