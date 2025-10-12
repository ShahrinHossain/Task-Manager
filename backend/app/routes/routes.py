from app.utils import *
from app.auth_utils import *
from http.client import HTTPException
from fastapi import Body, status, HTTPException, Depends, APIRouter
from app.database import get_db
from sqlalchemy.orm import Session

router = APIRouter(tags=["App related"])

@router.get("/", status_code= status.HTTP_200_OK)
def root():
    return {"message": "Hello World"}

@router.get("/tasks", status_code= status.HTTP_200_OK)
def get_tasks(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    tasks = hf_return_tasks(db, current_user)
    return tasks

@router.get("/task/{task_id}", status_code= status.HTTP_200_OK)
def get_task(task_id: int, db: Session = Depends(get_db)):
    task_info = hf_return_one_task(task_id, db)
    if task_info == {"message": "No task found"}:
        raise HTTPException(status_code= status.HTTP_404_NOT_FOUND,
                            detail= task_info)
    return task_info

@router.post("/add_task", status_code= status.HTTP_201_CREATED)
def add_task(new_task: TaskInfo = Body(...), db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    message = hf_add_task(new_task, db, current_user)
    if message == {"message": "An error has occurred"}:
        raise HTTPException(status_code= status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail= message)
    return message

@router.patch("/update_task_status/{task_id}", status_code= status.HTTP_202_ACCEPTED)
def update_task_status(task_id: int, task_status: StatusUpdate = Body(...),  db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    message = hf_update_task_status(task_id, task_status.status, db, current_user)
    if message == {"message": "No task found"}:
        raise HTTPException(status_code= status.HTTP_404_NOT_FOUND,
                            detail= message)
    elif message == {"message": "Unauthorized action"}:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail= message)
    return message

@router.put("/update_task/{task_id}", status_code= status.HTTP_202_ACCEPTED)
def update_task(task_id: int, updated_task: TaskInfo = Body(...), db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    message = hf_update_task(task_id, updated_task, db, current_user)
    if message == {"message": "No task found"}:
        raise HTTPException(status_code= status.HTTP_404_NOT_FOUND,
                            detail= message)
    elif message == {"message": "Unauthorized action"}:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail= message)
    return message

@router.delete("/delete_task/{task_id}", status_code= status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    message = hf_delete_task(task_id, db, current_user)
    if message == {"message": "No task found"}:
        raise HTTPException(status_code= status.HTTP_404_NOT_FOUND,
                            detail= message)
    elif message == {"message": "Unauthorized action"}:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail= message)



@router.get("/user", status_code= status.HTTP_200_OK)
def get_user(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    user_info = hf_return_user_info(db, current_user)
    if user_info == {"message": "No user found"}:
        raise HTTPException(status_code= status.HTTP_404_NOT_FOUND,
                            detail= user_info)
    return user_info

@router.get("/score", status_code= status.HTTP_200_OK)
def get_score(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    score_info = hf_return_score_info(db, current_user)
    if score_info == {"message": "No user found"}:
        raise HTTPException(status_code= status.HTTP_404_NOT_FOUND,
                            detail= score_info)
    return score_info