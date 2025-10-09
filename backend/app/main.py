from http.client import HTTPException
from fastapi import FastAPI, Body, Response, status, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware

from app import models
from app.utils import *
from app.database import engine, get_db
from sqlalchemy.orm import Session
from app.models import *

# app related setups
app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://localhost:8000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ['*'],
    allow_headers = ['*'],
)

models.Base.metadata.create_all(bind=engine)


# all apis
@app.get("/", status_code= status.HTTP_200_OK)
def root():
    return {"message": "Hello World"}

@app.get("/tasks", status_code= status.HTTP_200_OK)
def get_tasks(db: Session = Depends(get_db)):
    tasks = hf_return_tasks(db)
    if tasks == {"message": "No task found"}:
        raise HTTPException(status_code= status.HTTP_404_NOT_FOUND,
                            detail= tasks)
    return tasks

@app.get("/task/{task_id}", status_code= status.HTTP_200_OK)
def get_task(task_id: int, db: Session = Depends(get_db)):
    task_info = hf_return_one_task(task_id, db)
    if task_info == {"message": "No task found"}:
        raise HTTPException(status_code= status.HTTP_404_NOT_FOUND,
                            detail= task_info)
    return task_info

@app.post("/add_task", status_code= status.HTTP_201_CREATED)
def add_task(new_task: TaskInfo = Body(...), db: Session = Depends(get_db)):
    message = hf_add_task(new_task, db)
    if message == {"message": "An error has occurred"}:
        raise HTTPException(status_code= status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail= message)
    return message

@app.patch("/update_task_status/{task_id}", status_code= status.HTTP_202_ACCEPTED)
def update_task_status(task_id: int, task_status: StatusUpdate = Body(...),  db: Session = Depends(get_db)):
    message = hf_update_task_status(task_id, task_status.status, db)
    if message == {"message": "No task found"}:
        raise HTTPException(status_code= status.HTTP_404_NOT_FOUND,
                            detail= message)
    return message

@app.put("/update_task/{task_id}", status_code= status.HTTP_202_ACCEPTED)
def update_task(task_id: int, updated_task: TaskInfo = Body(...), db: Session = Depends(get_db)):
    message = hf_update_task(task_id, updated_task, db)
    if message == {"message": "No task found"}:
        raise HTTPException(status_code= status.HTTP_404_NOT_FOUND,
                            detail= message)
    return message

@app.delete("/delete_task/{task_id}", status_code= status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    message = hf_delete_task(task_id, db)
    if message == {"message": "No task found"}:
        raise HTTPException(status_code= status.HTTP_404_NOT_FOUND,
                            detail= message)