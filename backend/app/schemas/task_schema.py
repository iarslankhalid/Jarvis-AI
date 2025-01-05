from pydantic import BaseModel, Field
from typing import Optional, List, Literal
from pydantic import ConfigDict


class TaskModel(BaseModel):
    # Explicitly remove any implicit fields
    model_config = ConfigDict(extra='forbid')  # Prevent extra fields

    content: str = Field(description="The main content of the task")
    description: Optional[str] = None
    project_id: Optional[str] = None
    section_id: Optional[str] = None
    parent_id: Optional[str] = None
    order: Optional[int] = None
    labels: Optional[List[str]] = None
    priority: Literal[1, 2, 3, 4] = 1
    due_string: Optional[str] = None
    due_date: Optional[str] = None
    due_datetime: Optional[str] = None
    due_lang: Optional[str] = None
    assignee_id: Optional[str] = None
    duration: Optional[int] = None
    duration_unit: Optional[str] = None
    
class TranscriptionModel(BaseModel):
    transcription: str