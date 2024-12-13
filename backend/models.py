from sqlalchemy import Column, Integer, String, DateTime, Boolean
from database import Base

class Prompt(Base):
    __tablename__ = "prompts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String, index=True)

class UserPrompt(Base):
    __tablename__ = "userprompts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String, index=True)

class Script(Base):
    __tablename__ = "scripts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    gscript = Column(String)
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    category = Column(String)
    audio_path = Column(String)
    noupdate = Column(Boolean)