from datetime import datetime
from pydantic import BaseModel, EmailStr, ConfigDict
from app.database import Base
from sqlalchemy import Column, Integer, String
from sqlalchemy.sql.expression import text
from sqlalchemy.sql.sqltypes import TIMESTAMP, ARRAY, Date


class TaskInfo(BaseModel):
    description: str
    status: int
    priority: int

class StatusUpdate(BaseModel):
    status: int

class UserInfo(BaseModel):
    name: str
    email: EmailStr
    password: str
    model_config = ConfigDict(extra='allow')

class AdminInfo(BaseModel):
    email: EmailStr
    password: str

class AdminResponse(BaseModel):
    id: int
    email: EmailStr
    model_config = {
        "from_attributes": True
    }

class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    bestscore: int
    created: datetime
    model_config = {
        "from_attributes": True
    }

class UserCredentials(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    id: int

class AdminTokenData(TokenData):
    role: str

class Task(Base):
    __tablename__ = "alltasks"
    id = Column(Integer, primary_key=True, nullable=False)
    description = Column(String, nullable=False)
    status = Column(Integer, nullable=False)
    priority = Column(Integer, nullable=False)
    userid = Column(Integer, nullable=False)
    created = Column(TIMESTAMP(timezone=True), nullable=False,
                     server_default=text('now()'))

class User(Base):
    __tablename__ = "allusers"
    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=False)
    bestscore = Column(Integer, nullable=False, server_default=text('0'))
    created = Column(TIMESTAMP(timezone=True), nullable=False,
                     server_default=text('now()'))

class Score(Base):
    __tablename__ = "allscores"
    id = Column(Integer, primary_key=True, nullable=False)
    taskids = Column(ARRAY(Integer), nullable=False, default=[])
    userid = Column(Integer, nullable=False)
    score = Column(Integer, nullable=False)
    created = Column(Date, nullable=False, server_default=text('CURRENT_DATE'))

class Admin(Base):
    __tablename__ = "alladmins"
    id = Column(Integer, primary_key=True, nullable=False)
    email = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=False)
