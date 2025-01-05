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


# Helper function to interact with OpenAI



def call_openai_for_task(transcription: str, key: str) -> dict:
    """
    Calls OpenAI API to generate structured task details from transcription.
    Returns a JSON object or an error message.
    """
    from openai import OpenAI
    import json

    client = OpenAI(api_key=key)

    role_prompt = """
    You are an assistant for generating structured task details for the Todoist API from user transcriptions.

    Your goal:
    - Parse user transcription into a JSON payload.
    - If transcription is not related to a task, set `content` to -1.

    JSON schema:
    {
        "content": str,
        "description": Optional[str],
        "project_id": Optional[str],
        "section_id": Optional[str],
        "parent_id": Optional[str],
        "order": Optional[int],
        "labels": Optional[List[str]],
        "priority": Optional[int],
        "due_string": Optional[str],
        "due_date": Optional[str],
        "due_lang": Optional[str],
        "assignee_id": Optional[int],
        "duration": Optional[float],
        "duration_unit": Optional[str]
    }

    Be concise and accurate. Avoid adding extra text.
    """

    prompt = (
        f"Transcription: {transcription}\n\n"
        "Generate a JSON payload strictly following the above schema. "
        "If the transcription is invalid, return {'content': -1}."
    )

    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": role_prompt},
                {"role": "user", "content": prompt},
            ],
        )

        # Extract the JSON content directly
        message_content = response.choices[0].message.content.strip()
        payload = json.loads(message_content)  # Parse JSON string into a Python dict

        print(f"Extracted payload successfully:\n{json.dumps(payload, indent=4)}")
        return payload

    except json.JSONDecodeError as e:
        return {"error": f"Failed to parse JSON: {str(e)}"}
    except Exception as e:
        return {"error": f"Error during API call: {str(e)}"}





