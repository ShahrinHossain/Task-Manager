from app.utils import *
from app.auth_utils import *
from http.client import HTTPException
from fastapi import Body, status, HTTPException, Depends, APIRouter
from app.database import get_db
from sqlalchemy.orm import Session

router = APIRouter(tags=["App related"])

# For testing
@router.get("/", status_code= status.HTTP_200_OK)
def root():
    return {"message": "Hello World"}


### All APIs that require User Authentication

# User can fetch the task list
@router.get("/tasks", status_code= status.HTTP_200_OK)
def get_tasks(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    tasks = hf_return_tasks(db, current_user)
    return tasks


# User can fetch a specific task information
@router.get("/task/{task_id}", status_code= status.HTTP_200_OK)
def get_task(task_id: int, db: Session = Depends(get_db)):
    task_info = hf_return_one_task(task_id, db)
    if task_info == {"message": "No task found"}:
        raise HTTPException(status_code= status.HTTP_404_NOT_FOUND,
                            detail= task_info)
    return task_info


# User can add a new task
@router.post("/add_task", status_code= status.HTTP_201_CREATED)
def add_task(new_task: TaskInfo = Body(...), db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    message = hf_add_task(new_task, db, current_user)
    if message == {"message": "An error has occurred"}:
        raise HTTPException(status_code= status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail= message)
    return message


# User can update the status of a task
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


# User can update a task
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


# User can delete a task
@router.delete("/delete_task/{task_id}", status_code= status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    message = hf_delete_task(task_id, db, current_user)
    if message == {"message": "No task found"}:
        raise HTTPException(status_code= status.HTTP_404_NOT_FOUND,
                            detail= message)
    elif message == {"message": "Unauthorized action"}:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail= message)


# User can fetch own account information
@router.get("/user", status_code= status.HTTP_200_OK)
def get_user(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    user_info = hf_return_user_info(db, current_user)
    if user_info == {"message": "No user found"}:
        raise HTTPException(status_code= status.HTTP_404_NOT_FOUND,
                            detail= user_info)
    return user_info

# User can edit own information
@router.put("/edit_user", status_code= status.HTTP_202_ACCEPTED)
def edit_user(db: Session = Depends(get_db), updated_user: UserUpdate = Body(...), current_user = Depends(get_current_user)):
    message = hf_edit_user_info(updated_user, db, current_user)
    if message == {"message": "No user found"}:
        raise HTTPException(status_code= status.HTTP_404_NOT_FOUND,
                            detail= message)
    elif message == {"message": "This email is already in use! Action failed"}:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail=message)
    elif message == {"message": "Error updating user info"}:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail=message)
    return message


# User can see daily, weekly and best score
@router.get("/score", status_code= status.HTTP_200_OK)
def get_score(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    score_info = hf_return_score_info(db, current_user)
    if score_info == {"message": "No user found"}:
        raise HTTPException(status_code= status.HTTP_404_NOT_FOUND,
                            detail= score_info)
    return score_info