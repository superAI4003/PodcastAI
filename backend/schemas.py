from pydantic import BaseModel
from datetime import datetime
from typing import Optional
class PromptBase(BaseModel):
    title: str
    description: str

class PromptCreate(PromptBase):
    pass

class Prompt(PromptBase):
    id: int
    class Config:
        form_attributes = True

class ScriptBase(BaseModel):
    title : str
    gscript :str
    start_time : datetime
    end_time : datetime
    category: Optional[str] = None
    audio_path: Optional[str] = None
    noupdate:Optional[bool] = False

class Script(ScriptBase):
    id: int
    class Config:
        form_attributes = True

