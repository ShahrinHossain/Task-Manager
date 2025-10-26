from datetime import datetime, date
from pydantic import BaseModel, EmailStr, ConfigDict
from app.database import Base
from sqlalchemy import Column, Integer, String
from sqlalchemy.sql.expression import text
from sqlalchemy.sql.sqltypes import TIMESTAMP, ARRAY, Date


### All pydantic models

# Used when adding a task
class TaskInfo(BaseModel):
    description: str
    status: int
    priority: int
    target_date: datetime

# Used when only task status is updated
class StatusUpdate(BaseModel):
    status: int

# Used when password is changed
class PasswordUpdate(BaseModel):
    old_pass: str
    new_pass: str

# Used when registering a user
class UserInfo(BaseModel):
    name: str
    email: EmailStr
    password: str
    model_config = ConfigDict(extra='allow')

# Used when updating a user information
class UserUpdate(BaseModel):
    name: str
    email: EmailStr

# Used when registering an admin
class AdminInfo(BaseModel):
    email: EmailStr
    password: str

# Used when returning admin info
class AdminResponse(BaseModel):
    id: int
    email: EmailStr
    model_config = {
        "from_attributes": True
    }

# Used when returning user info
class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    bestscore: int
    created: datetime
    model_config = {
        "from_attributes": True
    }

# Used when logging in a user
class UserCredentials(BaseModel):
    email: EmailStr
    password: str

# Used to arrange the token
class Token(BaseModel):
    access_token: str
    token_type: str

# Used to fetch only the data portion of a user token
class TokenData(BaseModel):
    id: int

# Used to fetch the fields of an admin token
class AdminTokenData(TokenData):
    role: str



### All table models

# Used to store all the tasks
class Task(Base):
    __tablename__ = "alltasks"
    id = Column(Integer, primary_key=True, nullable=False)
    description = Column(String, nullable=False)
    status = Column(Integer, nullable=False)
    priority = Column(Integer, nullable=False)
    userid = Column(Integer, nullable=False)
    created = Column(TIMESTAMP(timezone=True), nullable=False,
                     server_default=text('now()'))
    target_date = Column(Date, default=date.today)

# Used to store all the users
class User(Base):
    __tablename__ = "allusers"
    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=False)
    bestscore = Column(Integer, nullable=False, server_default=text('0'))
    created = Column(TIMESTAMP(timezone=True), nullable=False,
                     server_default=text('now()'))

# Used to store all the daily scores by users
class Score(Base):
    __tablename__ = "allscores"
    id = Column(Integer, primary_key=True, nullable=False)
    taskids = Column(ARRAY(Integer), nullable=False, default=[])
    userid = Column(Integer, nullable=False)
    score = Column(Integer, nullable=False)
    created = Column(Date, nullable=False, server_default=text('CURRENT_DATE'))


# Used to store all the admins
class Admin(Base):
    __tablename__ = "alladmins"
    id = Column(Integer, primary_key=True, nullable=False)
    email = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=False)
