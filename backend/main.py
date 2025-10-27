from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from typing import List
from dotenv import load_dotenv
import os

from . import models, schemas
from .db import SessionLocal, init_db

# --- Load environment variables ---
load_dotenv()
MY_API_KEY = os.getenv("GETURL_PL_KEY")

# --- App instance ---
app = FastAPI()

# --- Startup DB init ---
@app.on_event("startup")
def on_startup():
    init_db()

# --- Health check + root ---
@app.get("/")
def root():
    return {
        "message": "Backend is running X",
        "api_key_loaded": MY_API_KEY is not None,   
    }

@app.get("/health")
def health_check():
    return {"status": "ok"}

# --- Dependency to get DB session ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ===========================
# 🚀 USER ROUTES
# ===========================
@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = models.User(name=user.name, email=user.email)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.get("/users/", response_model=List[schemas.User])
def list_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()

@app.get("/users/{user_id}", response_model=schemas.User)
def get_user(user_id: int, db: Session = Depends(get_db)):
    return db.query(models.User).filter(models.User.id == user_id).first()

# ===========================
# ✅ TASK ROUTES
# ===========================
@app.post("/tasks/", response_model=schemas.Task)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    db_task = models.Task(
        title=task.title,
        due_date=task.due_date,
        owner_id=task.owner_id  # 🔗 link to user
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@app.get("/tasks/", response_model=List[schemas.Task])
def get_tasks(db: Session = Depends(get_db)):
    return db.query(models.Task).all()

@app.get("/users/{user_id}/tasks/", response_model=List[schemas.Task])
def get_user_tasks(user_id: int, db: Session = Depends(get_db)):
    return db.query(models.Task).filter(models.Task.owner_id == user_id).all()
