from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from .db import Base

# User Table
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)  # unique user ID
    name = Column(String, nullable=False, index=True)  # username
    email = Column(String, unique=True, index=True, nullable=False)  # email must be unique

    # Relationship: One user -> many tasks
    tasks = relationship("Task", back_populates="owner")


# Task Table
class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)  # unique task ID
    title = Column(String, nullable=False)  # task title (required)
    due_date = Column(DateTime)  # optional deadline
    completed = Column(Boolean, default=False)  # task status

    # Foreign Key: link to users table
    owner_id = Column(Integer, ForeignKey("users.id"))

    # Relationship: Task belongs to one user
    owner = relationship("User", back_populates="tasks")
