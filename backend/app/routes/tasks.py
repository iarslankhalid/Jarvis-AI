import os
import json

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from todoist_api_python.api import TodoistAPI
from ..schemas.task_schema import TaskModel, TranscriptionModel
from ..services.task_service import add_task_to_todoist, call_openai_for_task, update_task_in_todoist

# Load environment variables
load_dotenv()
TODOIST_API_KEY = os.getenv("TODOIST_API_KEY")
if not TODOIST_API_KEY:
    raise ValueError("TODOIST_API_KEY is missing. Please set it in your .env file.")

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY is missing. Please set it in your .env file.")

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

@router.post("/voice")
def add_audio_task(transcription_data: TranscriptionModel):
    """
    Endpoint to process transcription and add a task.
    """
    try:
        # Extract the transcription
        transcription = transcription_data.transcription

        # Send transcription to OpenAI for task generation
        openai_response = call_openai_for_task(transcription, OPENAI_API_KEY)
        task_payload = TaskModel(**json.loads(openai_response))

        # Add the task to Todoist
        created_task = add_task_to_todoist(task_payload)
        return {
            "message": f"Task '{task_payload.content}' added successfully to Todoist.",
            "task": created_task,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --------------------------------- GET FUNCTIONS -------------------------------------
@router.get("/list")
def list_tasks():
    """
    Endpoint to retrieve all tasks from Todoist.
    """
    try:
        task_list = api.get_tasks()
        return task_list
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/edit/{task_id}")
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
