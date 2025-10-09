from pydantic import BaseModel

from app.database import Base
from sqlalchemy import Column, Integer, String
from sqlalchemy.sql.expression import text
from sqlalchemy.sql.sqltypes import TIMESTAMP
from sqlalchemy.dialects.postgresql import INTERVAL


class TaskInfo(BaseModel):
    description: str
    status: int
    priority: int
    userid: int

class StatusUpdate(BaseModel):
    status: int

class UserInfo(BaseModel):
    name: str
    email: str


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
    bestspeed = Column(INTERVAL, nullable=True)
    created = Column(TIMESTAMP(timezone=True), nullable=False,
                     server_default=text('now()'))