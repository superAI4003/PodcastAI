from pydantic import BaseModel

class PromptBase(BaseModel):
    title: str
    description: str

class PromptCreate(PromptBase):
    pass

class Prompt(PromptBase):
    id: int

    class Config:
        form_attributes = True
