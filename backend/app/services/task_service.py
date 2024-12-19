import os
import requests
from dotenv import load_dotenv
from ..schemas.task_schema import TaskModel

from todoist_api_python.api import TodoistAPI

# Load environment variables
load_dotenv()

# Constants
TODOIST_API_KEY = os.getenv("TODOIST_API_KEY")
api = TodoistAPI(TODOIST_API_KEY)


# Check if API Key is loaded
if not TODOIST_API_KEY:
    raise ValueError("API Key is missing. Check your .env file or environment variables.")

def add_task_to_todoist(task: TaskModel):
    """
    Adds a task to Todoist using the REST API.
    """
    try:
        task = api.add_task(
            content=task.content,
            description=task.description,
            project_id=task.project_id,
            section_id=task.section_id,
            parent_id=task.parent_id,
            order=task.order,
            labels=task.labels,
            priority=task.priority,
            due_string=task.due_string,
            due_date=task.due_date,
            due_lang=task.due_lang,
            assignee_id=task.assignee_id,
            duration=task.duration,
            duration_unit=task.duration_unit)
        return task
    
    except requests.exceptions.RequestException as error:
        return {"error": f"Failed to add task: {error}"}


def update_task_in_todoist(task_id:str, task: TaskModel):
    """
    updated the exsisting task
    """

    try:
        task = api.add_task(
            task_id=task_id,
            content=task.content,
            description=task.description,
            project_id=task.project_id,
            section_id=task.section_id,
            parent_id=task.parent_id,
            order=task.order,
            labels=task.labels,
            priority=task.priority,
            due_string=task.due_string,
            due_date=task.due_date,
            due_lang=task.due_lang,
            assignee_id=task.assignee_id,
            duration=task.duration,
            duration_unit=task.duration_unit)
        return task

    except requests.exceptions.RequestException as error:
        return {"error": f"Failed to add task: {error}"}
