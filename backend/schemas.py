from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class TaskBase(BaseModel):
    title: str
    due_date: Optional[datetime] = None

class TaskCreate(TaskBase):
    pass

class Task(TaskBase):
    id: int
    completed: bool

    class Config:
        orm_mode = True

class UserBase(BaseModel):
    name: str
    email: str

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: int
    tasks: List[Task] = []

    class Config:
        orm_mode = True
