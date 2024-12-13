from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session
from typing import List
from fastapi import Depends, status
from database import get_db
from schemas import ScriptBase, Script
from models import Script as ScriptModel 
from pydantic import BaseModel
import time

router = APIRouter()

class ScriptResponse(BaseModel):
    exists: bool
    script: Script = None  

@router.get("/", response_model=List[Script])
def read_scripts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    scripts = db.query(ScriptModel).order_by(ScriptModel.id).offset(skip).all()
    scripts_data = []
    for script in scripts:
        script_data = {
            "id": script.id,
            "title": script.title,
            "gscript": script.gscript,
            "start_time": script.start_time,
            "end_time": script.end_time,
            "category": script.category,
            "audio_path": f"/media/podcast{script.id}.mp3"  # Assuming audio_path is the filename of the audio file
        }
        scripts_data.append(script_data)
    return scripts_data

@router.post("/", response_model=Script)
def create_script(script: ScriptBase, db: Session = Depends(get_db)):
    db_script = ScriptModel(**script.dict())
    db.add(db_script)
    db.commit()
    db.refresh(db_script)
    return db_script

@router.get("/{script_id}", response_model=Script)
def read_script(script_id: int, db: Session = Depends(get_db)):
    db_script = db.query(ScriptModel).filter(ScriptModel.id == script_id).first()
    if db_script is None:
        raise HTTPException(status_code=404, detail="Script not found")
    return db_script

@router.put("/{script_id}", response_model=Script)
def update_script(script_id: int, script: ScriptBase, db: Session = Depends(get_db)):
    db_script = db.query(ScriptModel).filter(ScriptModel.id == script_id).first()
    if db_script is None:
        raise HTTPException(status_code=404, detail="Script not found")
    for key, value in script.dict().items():
        setattr(db_script, key, value)
    db.commit()
    db.refresh(db_script)
    return db_script

@router.delete("/{script_id}")
def delete_script(script_id: int, db: Session = Depends(get_db)):
    db_script = db.query(ScriptModel).filter(ScriptModel.id == script_id).first()
    if db_script is None:
        raise HTTPException(status_code=404, detail="Script not found")
    db.delete(db_script)
    db.commit()
    return {"detail": "Script deleted"}



@router.get("/title/{script_title}", response_model=ScriptResponse)
def read_script_by_title(script_title: str, db: Session = Depends(get_db)):
    retry_count = 0
    delay = 2  # delay in seconds

    while True:
        try:
            db_script = db.query(ScriptModel).filter(ScriptModel.title == script_title).first()
            if db_script is None:
                return {"exists": False, "detail": "Script not found"}
            return {"exists": True, "script": db_script}
            break  # If successful, break the loop
        except Exception as e:  # Catch any exceptions
            if retry_count >= 5:  # Maximum retries
                raise HTTPException(status_code=500, detail=f"Error: {e}. Maximum retries exceeded.")
            else:
                print(f"Error: {e}. Retrying in {delay} seconds...")
                time.sleep(delay)
                retry_count += 1
                delay *= 2  # Double the delay for exponential backoff