import os
from dotenv import load_dotenv
from todoist_api_python.api import TodoistAPI
from fastapi import APIRouter, HTTPException
from ..schemas.task_schema import TaskModel
from ..services.task_service import (
    add_task_to_todoist,
    update_task_in_todoist
)

# Load environment variables
load_dotenv()
TODOIST_API_KEY = os.getenv("TODOIST_API_KEY")
if not TODOIST_API_KEY:
    raise ValueError("TODOIST_API_KEY is missing. Please set it in your .env file.")
api = TodoistAPI(TODOIST_API_KEY)

router = APIRouter()

# --------------------------------- POST FUNCTIONS -------------------------------------
@router.post("/add")
def add_task(request: TaskModel):
    """
    Endpoint to add a new task.
    """
    try:
        created_task = add_task_to_todoist(request)
        return {
            "message": f"Task '{request.content}' added successfully to Todoist.",
            "task": created_task,
        }
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))


# --------------------------------- GET FUNCTIONS -------------------------------------
@router.get("/list")
def list_tasks():
    """
    Endpoint to retrieve all tasks from Todoist.
    """
    try:
        task_list = api.get_tasks()
        print(f"{len(task_list) = }")
        return task_list
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))


# --------------------------------- PUT FUNCTIONS -------------------------------------
@router.put("/{task_id}")
def edit_task(task_id: str, updated_task: TaskModel):
    """
    Endpoint to update an existing task.
    """
    try:
        updated_task_result = update_task_in_todoist(task_id, updated_task)
        return {
            "message": f"Task '{task_id}' updated successfully.",
            "task": updated_task_result,
        }
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))


# --------------------------------- DELETE FUNCTIONS -------------------------------------
@router.delete("/{task_id}")
def delete_task(task_id: str):
    """
    Endpoint to delete an existing task.
    """
    try:
        api.delete_task(task_id)
        return {
            "message": f"Task '{task_id}' deleted successfully."
        }
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))


# --------------------------------- Task Management Functions -------------------------------------
@router.put("/{task_id}/close")
def close_task(task_id: str):
    """
    Endpoint to close an existing task.
    """
    try:
        api.close_task(task_id)
        return {"message": f"Successfully closed task #{task_id}."}
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{task_id}/reopen")
def reopen_task(task_id: str):
    """
    Endpoint to reopen an existing task.
    """
    try:
        api.reopen_task(task_id)
        return {"message": f"Successfully reopened task #{task_id}."}
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
