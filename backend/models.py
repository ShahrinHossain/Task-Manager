from enum import Enum
from typing import List, Optional
from pydantic import BaseModel

class TaskStatus(str, Enum):
    due = "due"
    ongoing = "ongoing"
    completed = "completed"

class Task(BaseModel):
    task_id: Optional[int] = None
    name: str
    status: TaskStatus

class Tasks(BaseModel):
    tasks: List[Task]

memory_db = {"tasks": []}