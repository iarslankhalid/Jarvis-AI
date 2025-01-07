import os
from openai import OpenAI
import requests
from dotenv import load_dotenv
from ..schemas.task_schema import TaskModel

from todoist_api_python.api import TodoistAPI

import json

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


def update_task_in_todoist(task_id: str, task: TaskModel):
    """
    Updates an existing task in Todoist.
    """
    try:
        # Prepare the payload dynamically based on non-empty fields
        payload = {
            "content": task.content,  # Task content (optional but recommended)
            "description": task.description,  # Task description
            "labels": task.labels,  # Task labels
            "priority": task.priority,  # Priority level
            "due_string": task.due_string if not task.due_date and not task.due_datetime else None,
            "due_date": task.due_date if not task.due_string and not task.due_datetime else None,
            "due_datetime": task.due_datetime if not task.due_date and not task.due_string else None,
            "due_lang": task.due_lang,  # Language code for due_string
            "assignee_id": task.assignee_id,  # Assignee ID
            "duration": task.duration if task.duration_unit else None,
            "duration_unit": task.duration_unit if task.duration else None,
        }

        # Filter out None values to avoid sending invalid parameters
        payload = {key: value for key, value in payload.items() if value is not None}

        # Call the API with the prepared payload
        updated_task = api.update_task(task_id=task_id, **payload)

        return updated_task

    except requests.exceptions.RequestException as error:
        return {"error": f"Failed to update task: {error}"}
    





# Helper function to interact with OpenAI
def call_openai_for_task(transcription: str, key: str) -> str:
    """
    Calls OpenAI API to generate structured task details from transcription.
    Returns a JSON string conforming to the TaskModel schema or an error message.
    """
    
    from openai import OpenAI
    import json
    # Initialize OpenAI client
    client = OpenAI(api_key=key)

    task_model_schema = TaskModel.model_json_schema()
    schema_string = json.dumps(task_model_schema, indent=4)

    role_prompt = f"""
    You are an assistant for generating structured task details for the Todoist API.

    Your goal:
    - Parse user transcription into a JSON payload.
    - If transcription is not related to a task, set `content` to "-1".

    JSON schema for the task model:
    {schema_string}

    Be concise and ensure the payload strictly adheres to the schema. 
    For fields not provided in the transcription, set them to `null` or use appropriate defaults (e.g., "priority": 1).
    """

    prompt = (
        f"Transcription: {transcription}\n\n"
        "Generate a JSON payload strictly following the above schema. "
        "If the transcription is invalid, return {'content': '-1'}."
    )

    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": role_prompt},
                {"role": "user", "content": prompt},
            ],
        )
        message_content = response.choices[0].message.content.strip()

        # Parse JSON string into a Python dict
        payload = json.loads(message_content)

        # Validate the payload conforms to TaskModel
        if "content" not in payload or payload["content"] == "-1":
            return json.dumps({"error": "Invalid or unrelated transcription."})

        return json.dumps(payload)

    except json.JSONDecodeError as e:
        return json.dumps({"error": f"Failed to parse JSON: {str(e)}"})
    except Exception as e:
        return json.dumps({"error": f"Error during API call: {str(e)}"})