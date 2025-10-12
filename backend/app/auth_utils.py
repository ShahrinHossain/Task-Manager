from app.models import *
from app.utils import hf_initiate_daily_score
from jose import JWTError, jwt
from datetime import datetime, timedelta
from passlib.context import CryptContext
from fastapi import Depends, status, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.database import get_db

oauth2_scheme = OAuth2PasswordBearer(tokenUrl='login')
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_access_token(token: str, credentials_exception):
    try:
        # print(token)
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("id")
        if user_id is None:
            raise credentials_exception
        else:
            token_data = TokenData(id=user_id)
            return token_data
    except JWTError:
        raise credentials_exception


def verify_admin_access_token(token: str, credentials_exception: HTTPException):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        admin_id = payload.get("id")
        admin_role = payload.get("role")
        if admin_id is None or admin_role != "admin":
            raise credentials_exception
        else:
            token_data = AdminTokenData(id=admin_id, role=admin_role)
            return token_data
    except JWTError:
        raise credentials_exception

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                          detail="Could not validate credentials",
                                          headers={"WWW-Authenticate": "Bearer"})
    token_data = verify_access_token(token, credentials_exception)
    user_info = db.query(User).filter(User.id == token_data.id).first()
    return UserResponse.from_orm(user_info)

def get_current_admin(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                          detail="Could not validate admin credentials",
                                          headers={"WWW-Authenticate": "Bearer"})
    token_data = verify_access_token(token, credentials_exception)

    admin_info = db.query(Admin).filter(Admin.id == token_data.id).first()
    return AdminResponse.from_orm(admin_info)

def hash_pass(password: str):
    return pwd_context.hash(password)

def verify_pass(attempted_password: str, actual_password: str):
    return pwd_context.verify(attempted_password, actual_password)

def hf_add_user(user: UserInfo, db):
    try:
        user.password = hash_pass(user.password)

        db.add(User(**user.model_dump()))
        db.commit()
        return {"message": "User addition successful"}
    except Exception as e:
        db.rollback()
        print('Error:', e)
        return {"message": "An error has occurred"}

def hf_add_admin(admin: AdminInfo, db):
    try:
        admin.password = hash_pass(admin.password)

        db.add(Admin(**admin.model_dump()))
        db.commit()
        return {"message": "Admin addition successful"}
    except Exception as e:
        db.rollback()
        print('Error:', e)
        return {"message": "An error has occurred"}

def hf_login_user(user_creds: OAuth2PasswordRequestForm, db):
    try:
        user_info = db.query(User).filter(User.email == user_creds.username).first()
        if user_info:
            if verify_pass(user_creds.password, user_info.password):
                hf_initiate_daily_score(db, user_info.id)
                access_token = create_access_token(data= {"id" : user_info.id})
                return {"access_token": access_token, "token_type": "bearer"}
            else:
                return {"message": "Wrong password"}
        else:
            return {"message": "Invalid credentials"}
    except Exception as e:
        print('Error:', e)
        return {"message": "An error has occurred"}

def hf_login_admin(user_creds: OAuth2PasswordRequestForm, db):
    try:
        admin_info = db.query(Admin).filter(Admin.email == user_creds.username).first()
        if admin_info:
            if verify_pass(user_creds.password, admin_info.password):
                access_token = create_access_token(data={"id": admin_info.id, "role": "admin"})
                return {"access_token": access_token, "token_type": "bearer", "role": "admin"}
            else:
                return {"message": "Wrong password"}
        else:
            return {"message": "Invalid credentials"}

    except Exception as e:
        print('Error:', e)
        return {"message": "An error has occurred"}


