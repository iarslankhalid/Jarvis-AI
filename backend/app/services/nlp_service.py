import openai
import os
from dotenv import load_dotenv
import json
from openai import OpenAI
from ..schemas.task_schema import TaskModel

load_dotenv()

# Load OpenAI API Key from environment variable
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not OPENAI_API_KEY:
    raise ValueError("OpenAI API Key is missing. Set the 'OPENAI_API_KEY' environment variable.")

openai.api_key = OPENAI_API_KEY


def generate_ai_reply(email_details: dict) -> str:
    """
    Uses OpenAI GPT to generate a suggested HTML-formatted reply for an email.

    :param email_body: The body of the email to generate a response for.
    :return: A generated AI-powered email reply in proper HTML format.
    """
    try:
        response = openai.chat.completions.create(
            model="gpt-4",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a professional AI email assistant. Generate a well-formatted HTML email response. "
                        "Use <p> for paragraphs, <br> for line breaks, and <strong> for emphasis. "
                        "Ensure proper email formatting without including raw \\n characters."
                    )
                },
                {
                    "role": "user",
                    "content": f"Reply to this email in a professional manner, formatted as valid HTML, Use necessary information from this email details:\n\n{email_details}"
                }
            ],
        )

        ai_reply = response.choices[0].message.content.strip()

        # 🔹 Convert newlines to <br> tags if GPT still returns them
        ai_reply = ai_reply.replace("\n", "")

        # 🔹 Ensure response is wrapped in <p> tags if not already formatted
        # if not ai_reply.startswith("<p>"):
        #     ai_reply = f"<p>{ai_reply}</p>"

        return ai_reply

    except Exception as e:
        return f"<p><strong>Error:</strong> Could not generate AI reply. {str(e)}</p>"


def extract_task_from_email(email_subject: str, email_body: str, key: str = OPENAI_API_KEY) -> str:
    """
    Calls OpenAI API to extract structured task details from an email.
    Returns a JSON string conforming to the TaskModel schema or an error message.
    """
    
    # Initialize OpenAI client
    client = OpenAI(api_key=key)

    # Get TaskModel schema (assuming TaskModel is a Pydantic model)
    task_model_schema = TaskModel.model_json_schema()
    schema_string = json.dumps(task_model_schema, indent=4)

    # Define AI Role Prompt
    role_prompt = f"""
    You are an AI assistant that extracts structured tasks from emails.
    
    Your goal:
    - Identify task-related information in emails.
    - Generate a structured JSON task payload.
    - If no task is found, set `"content": "-1"`.
    - The `label` field should always be `"Email"`.

    JSON schema for the task model:
    {schema_string}

    Ensure the output strictly follows this schema.
    """

    # Combine email subject and body for context
    prompt = (
        f"Email Subject: {email_subject}\n\n"
        f"Email Body: {email_body}\n\n"
        "Generate a structured JSON payload strictly following the schema. "
        "If no task is found, return {'content': '-1'}."
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

        # Parse JSON response from OpenAI
        payload = json.loads(message_content)

        # Ensure the `label` field is always set to "Email"
        payload["label"] = "Email"

        # Validate if task extraction was successful
        if "content" not in payload or payload["content"] == "-1":
            return json.dumps({"error": "No task found in the email."})

        return json.dumps(payload)

    except json.JSONDecodeError as e:
        return json.dumps({"error": f"Failed to parse JSON: {str(e)}"})
    except Exception as e:
        return json.dumps({"error": f"Error during API call: {str(e)}"})
