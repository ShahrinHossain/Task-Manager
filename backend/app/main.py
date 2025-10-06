from http.client import HTTPException
from pathlib import Path
from fastapi import FastAPI, Body, Response, status, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pyexpat.errors import messages

from app.utils import *


# app related setups
app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://localhost:8000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ['*'],
    allow_headers = ['*'],
)


### moved  this part to separate file models.py

# # task structure related
# class TaskStatus(str, Enum):
#     due = "due"
#     ongoing = "ongoing"
#     completed = "completed"
#
# class Task(BaseModel):
#     task_id : Optional[int] = None
#     name : str
#     status : TaskStatus
#
# class Tasks(BaseModel):
#     tasks : List[Task]

#
# # database related
# memory_db = {"tasks": []}

# all apis
@app.get("/", status_code= status.HTTP_200_OK)
def root():
    return {"message": "Hello World"}

@app.get("/tasks", status_code= status.HTTP_200_OK)
def get_tasks():
    hf_print_tasks(memory_db['tasks'])
    return Tasks(tasks = memory_db["tasks"])

@app.get("/task/{task_id}", status_code= status.HTTP_200_OK)
def get_task(task_id: int):
    task_info = hf_organize_task(task_id)
    if task_info == {"message": "No task found"}:
        raise HTTPException(status_code= status.HTTP_404_NOT_FOUND,
                            detail= task_info)
    return task_info

@app.post("/add_tasks", status_code= status.HTTP_201_CREATED)
def add_tasks(new_tasks: Tasks = Body(...)):
    message = hf_add_task(new_tasks.tasks)
    if message == {"message": "An Error Occurred"}:
        raise HTTPException(status_code= status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail= message)
    return message

@app.patch("/update_task_status/{task_id}", status_code= status.HTTP_202_ACCEPTED)
def update_task_status(task_id: int, task_status: StatusUpdate = Body(...)):
    message = hf_update_task_status(task_id, task_status.status)
    if message == {"message": "No task found"}:
        raise HTTPException(status_code= status.HTTP_404_NOT_FOUND,
                            detail= message)
    return message

@app.put("/update_task/{task_id}", status_code= status.HTTP_202_ACCEPTED)
def update_task(task_id: int, updated_task: Task = Body(...)):
    message = hf_update_task(task_id, updated_task)
    if message == {"message": "No task found"}:
        raise HTTPException(status_code= status.HTTP_404_NOT_FOUND,
                            detail= message)
    return message

@app.delete("/delete_task/{task_id}", status_code= status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int):
    message = hf_delete_task(task_id)
    if message == {"message": "No task found"}:
        raise HTTPException(status_code= status.HTTP_404_NOT_FOUND,
                            detail= message)