# Jarvis-AI
This is the Personal Assistant that handles Email classification, tasks management, Calendar and many more. 

## API Endpoints

| **Endpoint**                 | **Method** | **Description**                          |
|------------------------------|------------|------------------------------------------|
| `/api/email/categorize`      | `GET`      | Fetch and categorize emails.             |
| `/api/email/draft`           | `POST`     | Draft response email via OpenAI.         |
| `/api/email/send`            | `POST`     | Send emails or save drafts.              |
| `/api/calendar/events`       | `GET`      | Fetch calendar events.                   |
| `/api/calendar/schedule`     | `POST`     | Schedule new meetings.                   |
| `/api/calendar/reminders`    | `GET`      | Get meeting reminders.                   |
| `/api/tasks/add`             | `POST`     | Add new tasks (via voice/manual input).  |
| `/api/tasks/list`            | `GET`      | Get the list of tasks.                   |
| `/api/tasks/priority`        | `POST`     | Update task priority.                    |
| `/api/assistant/query`       | `POST`     | Get OpenAI-generated responses.          |
| `/api/media/search/images`   | `GET`      | Search for images using Google API.      |
| `/api/media/search/videos`   | `GET`      | Search for videos via YouTube API.       |
| `/api/alexa/response`        | `POST`     | Handle Alexa smart queries.              |
| `/api/slack/notify`          | `POST`     | Send task notifications via Slack.       |
| `/api/user/preferences`      | `GET`      | Get user preferences and settings.       |
| `/api/user/preferences`      | `POST`     | Update user preferences.                 |
| `/api/reports/tasks`         | `GET`      | Generate task completion reports.        |
| `/api/speech/transcribe`     | `POST`     | Transcribe voice input to text.          |
| `/api/speech/convert`        | `POST`     | Convert text to speech output.           |


## Project Structure
```
backend/
│
├── app/
│   ├── __init__.py
│   ├── main.py                 # Main FastAPI entry point
│   ├── routes/                 # API route definitions
│   │   ├── email.py            # Email management routes
│   │   ├── calendar.py         # Calendar and meetings routes
│   │   ├── tasks.py            # Task and voice note management
│   │   ├── media.py            # Media search routes
│   │   ├── assistant.py        # AI Assistant interaction routes (OpenAI API)
│   │   ├── user.py             # User settings and preferences
│   │   ├── auth.py             # Authentication (OAuth for APIs)
│   │   └── alexa.py            # Alexa Skills routes
│   │
│   ├── services/               # API Integration Logic
│   │   ├── mail_service.py     # MailAPI logic
│   │   ├── calendar_service.py # Calendar API integration
│   │   ├── task_service.py     # Todoist, Trello task integrations
│   │   ├── media_service.py    # YouTube & Google Search APIs
│   │   ├── speech_service.py   # Google Speech-to-Text/Text-to-Speech
│   │   ├── nlp_service.py      # Cloud Natural Language & OpenAI
│   │   ├── alexa_service.py    # Alexa API integration logic
│   │   ├── slack_service.py    # Slack API integrations
│   │   └── utils.py            # Helper functions and utilities
│   │
│   ├── models/                 # Database models
│   │   ├── user_model.py
│   │   └── task_model.py
│   │
│   ├── schemas/                # Pydantic schemas for data validation
│   │   ├── email_schema.py
│   │   ├── task_schema.py
│   │   ├── calendar_schema.py
│   │   └── user_schema.py
│   │
│   ├── config/                 # Configurations
│   │   ├── settings.py         # API keys, secrets, and app settings
│   │   └── oauth.py            # OAuth configurations for MailAPI, Calendar API, etc.
│   │
│   ├── database/               # Database connection logic
│   │   ├── db.py
│   │   └── models.py
│   │
│   └── tests/                  # Unit and Integration tests
│       ├── test_email.py
│       ├── test_calendar.py
│       └── test_tasks.py
│
├── requirements.txt            # Python dependencies
└── run.py                      # Script to run 

```