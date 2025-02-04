import openai
import os

# Load OpenAI API Key from environment variable
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not OPENAI_API_KEY:
    raise ValueError("OpenAI API Key is missing. Set the 'OPENAI_API_KEY' environment variable.")

openai.api_key = OPENAI_API_KEY

def generate_ai_reply(email_body: str) -> str:
    """
    Uses OpenAI GPT to generate a suggested reply for an email.

    :param email_body: The body of the email to generate a response for.
    :return: A generated AI-powered email reply.
    """
    try:
        response = openai.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful AI email assistant."},
                {"role": "user", "content": f"Reply to this email professionally:\n\n{email_body}"}
            ],
            temperature=0.7,
            max_tokens=200
        )
        return response.choices[0].message.content
    
    except Exception as e:
        return f"Error generating AI reply: {str(e)}"

def extract_task_from_email(subject: str, body: str) -> str:
    """
    Uses OpenAI GPT to extract tasks from an email.

    :param subject: The subject of the email.
    :param body: The body of the email.
    :return: A task extracted from the email, if any.
    """
    try:
        response = openai.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an AI that extracts actionable tasks from emails."},
                {"role": "user", "content": f"Extract any tasks from this email:\n\nSubject: {subject}\n\n{body}"}
            ],
            temperature=0.6,
            max_tokens=150
        )
        return response.choices[0].message.content
    
    except Exception as e:
        return f"Error extracting task: {str(e)}"
