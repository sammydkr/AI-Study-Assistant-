from sqlalchemy import create_engine, Column, String, DateTime, Float, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from datetime import datetime

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/studydb")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    study_preferences = Column(JSON, default={})

class StudySession(Base):
    __tablename__ = "study_sessions"
    
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, index=True)
    topic = Column(String)
    duration_minutes = Column(Float)
    score = Column(Float)
    completed_at = Column(DateTime, default=datetime.utcnow)
    quiz_data = Column(JSON)

# Create tables
Base.metadata.create_all(bind=engine)
