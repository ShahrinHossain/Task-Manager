from app.auth_utils import *
from http.client import HTTPException
from fastapi import Body, status, HTTPException, Depends, APIRouter
from app.database import get_db
from sqlalchemy.orm import Session
from fastapi.security.oauth2 import OAuth2PasswordRequestForm

router = APIRouter(prefix="/auth",
                   tags=["Authentication related"])

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register_user(user: UserInfo = Body(...), db: Session = Depends(get_db)):
    message = hf_add_user(user, db)
    if message == {"message": "An error has occurred"}:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail=message)
    return message

@router.post("/login", status_code=status.HTTP_202_ACCEPTED)
def login_user(user_creds: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    message = hf_login_user(user_creds, db)
    if message == {"message": "An error has occurred"}:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail=message)
    elif message == {"message": "Invalid credentials"} or message == {"message": "Wrong password"}:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail=message)
    return message

@router.post("/logout", status_code=status.HTTP_200_OK)
def logout_user():
    return {"message": "Logout successful"}

