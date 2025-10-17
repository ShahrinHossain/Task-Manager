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

### Helper functions for auth_routes

# Encodes the data with SECRET_KEY and expiry time into the access token
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


# Decodes a user token and verifies the data
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


# Decodes an admin token and verifies the data
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


# Verifies a user token and returns user info
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                          detail="Could not validate credentials",
                                          headers={"WWW-Authenticate": "Bearer"})
    token_data = verify_access_token(token, credentials_exception)
    user_info = db.query(User).filter(User.id == token_data.id).first()
    return UserResponse.from_orm(user_info)


# Verifies an admin token and returns admin info
def get_current_admin(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                          detail="Could not validate admin credentials",
                                          headers={"WWW-Authenticate": "Bearer"})
    token_data = verify_access_token(token, credentials_exception)

    admin_info = db.query(Admin).filter(Admin.id == token_data.id).first()
    return AdminResponse.from_orm(admin_info)


# Hash a password
def hash_pass(password: str):
    return pwd_context.hash(password)


# Matches a password and returns the result
def verify_pass(attempted_password: str, actual_password: str):
    return pwd_context.verify(attempted_password, actual_password)


# Registers a user by hashing password
def hf_add_user(user: UserInfo, db):
    try:
        user_info = db.query(User).filter(User.email == user.email).first()
        if user_info:
            return {"message": "Some account is using this email !"}

        user.password = hash_pass(user.password)

        db.add(User(**user.model_dump()))
        db.commit()
        return {"message": "User addition successful"}
    except Exception as e:
        db.rollback()
        print('Error:', e)
        return {"message": "An error has occurred"}


# Registers an admin by hashing password
def hf_add_admin(admin: AdminInfo, db, current_admin):
    try:
        admin_info = db.query(Admin).filter(Admin.email == admin.email).first()
        if admin_info:
            return {"message": "This admin email is already in use !"}

        admin.password = hash_pass(admin.password)

        db.add(Admin(**admin.model_dump()))
        db.commit()
        return {"message": "Admin addition successful"}
    except Exception as e:
        db.rollback()
        print('Error:', e)
        return {"message": "An error has occurred"}


# Logins a user by checking credentials
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


# Logins an admin by checking credentials
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


# Changes the user password
def hf_edit_password(old_password, new_password, db, current_user):
    try:
        user_info_query = db.query(User).filter(User.id == current_user.id)
        user_info = user_info_query.first()
        old_hashed_password = user_info.password
        if verify_pass(old_password, old_hashed_password):
            new_hashed_password = hash_pass(new_password)
            user_info_query.update({"password" : new_hashed_password}, synchronize_session=False)
            db.commit()
            return {"message": "Password changed successfully"}
        else:
            return {"message": "Old password did not match"}
    except Exception as e:
        print(e)
        return {"message": "Error changing password"}
