import os

# Define the project structure
project_structure = {
    "backend": {
        "app": {
            "__init__.py": "",
            "main.py": "# FastAPI entry point",
            "routes": {
                "__init__.py": "",
                "email.py": "# Routes for email management",
                "calendar.py": "# Routes for calendar and meetings",
                "tasks.py": "# Routes for tasks and voice notes",
                "media.py": "# Routes for media search",
                "assistant.py": "# Routes for OpenAI assistant",
                "user.py": "# Routes for user preferences",
                "auth.py": "# Routes for authentication",
                "alexa.py": "# Routes for Alexa integration",
            },
            "services": {
                "__init__.py": "",
                "mail_service.py": "# MailAPI integration logic",
                "calendar_service.py": "# Calendar API integration logic",
                "task_service.py": "# Todoist/Trello task integrations",
                "media_service.py": "# Media search integration",
                "speech_service.py": "# Speech-to-text and text-to-speech",
                "nlp_service.py": "# NLP integration with OpenAI",
                "alexa_service.py": "# Alexa integration logic",
                "slack_service.py": "# Slack API integration logic",
                "utils.py": "# Utility functions",
            },
            "models": {
                "__init__.py": "",
                "user_model.py": "# User data model",
                "task_model.py": "# Task data model",
            },
            "schemas": {
                "__init__.py": "",
                "email_schema.py": "# Pydantic schema for emails",
                "task_schema.py": "# Pydantic schema for tasks",
                "calendar_schema.py": "# Pydantic schema for calendar",
                "user_schema.py": "# Pydantic schema for users",
            },
            "config": {
                "__init__.py": "",
                "settings.py": "# App settings and API keys",
                "oauth.py": "# OAuth configurations",
            },
            "database": {
                "__init__.py": "",
                "db.py": "# Database connection logic",
                "models.py": "# Database models",
            },
            "tests": {
                "test_email.py": "# Test cases for email routes",
                "test_calendar.py": "# Test cases for calendar routes",
                "test_tasks.py": "# Test cases for task routes",
            },
        },
        "requirements.txt": "# List of dependencies",
        "run.py": "# Script to run the FastAPI server",
    }
}

# Function to create the project structure
def create_project_structure(base_path, structure):
    for name, content in structure.items():
        path = os.path.join(base_path, name)
        if isinstance(content, dict):
            os.makedirs(path, exist_ok=True)
            create_project_structure(path, content)
        else:
            with open(path, "w") as f:
                f.write(content)

# Main execution
if __name__ == "__main__":
    base_path = os.getcwd()  # Current working directory
    create_project_structure(base_path, project_structure)
    print("✅ Project structure created successfully!")
