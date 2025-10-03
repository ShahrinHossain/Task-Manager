from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
from utils import *


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
@app.get("/")
def root():
    return {"message": "Hello World"}

@app.get("/tasks")
def get_tasks():
    hf_print_tasks(memory_db['tasks'])
    return Tasks(tasks = memory_db["tasks"])

@app.get("/task/{task_id}")
def get_task(task_id: int):
    task_info = hf_organize_task(task_id)
    return task_info


@app.post("/add_tasks")
def add_tasks(new_tasks: Tasks = Body(...)):
    hf_assign_random_id(new_tasks.tasks)
    memory_db["tasks"].extend(new_tasks.tasks)
    hf_print_tasks(memory_db['tasks'])
    return {"message" : "Task Addition Successful"}

#smart
@app.patch("/update_task_status/{task_id}/{status}")
def update_task_status(task_id: int, status: TaskStatus):
    message = hf_update_status(task_id, status)
    return message