from fastapi import APIRouter, File, UploadFile, Form
from fastapi.responses import JSONResponse, FileResponse
from utils.get_text import get_text_from_audio, get_text_from_video, get_text_from_image
from utils.generation_audio import generate_audio, get_voice_list, get_elevenlabs_voices_list
from utils.generation_conversation import generate_conversation
import json
router = APIRouter()

@router.post("/generate-conversation")
async def generate_conversation_endpoint(file: UploadFile = File(None), prompt: str = Form(...), userPrompt: str=Form(...)):
    if file:
        # Save the uploaded file
        file_location = f"./media/{file.filename}"
        with open(file_location, "wb") as buffer:
            buffer.write(await file.read())
        if file.content_type.startswith('image/'):
            article = get_text_from_image(file_location)
        elif file.content_type.startswith('video/'):
            article = get_text_from_video(file_location)
        elif file.content_type.startswith('audio/'):
            article = get_text_from_audio(file_location)
    else:
        article = ""

    if prompt is None:
        return JSONResponse(status_code=400, content={"error": "Prompt not found"})

    result = generate_conversation(prompt, article,userPrompt)
    return {"result": result}

@router.post("/generate-conversation-by-text")
async def generate_conversation_by_text_endpoint(text: str = Form(...), prompt: str = Form(...), userPrompt: str=Form(...)):
    if prompt is None:
        return JSONResponse(status_code=400, content={"error": "Prompt not found"})
    result = generate_conversation(prompt, text,userPrompt)
    return {"result": result}

@router.post("/generate-audio")
async def generate_audio_endpoint(conversation: str = Form(...),currentSpeaker:str=Form(...)):
    audio_file_path = generate_audio(conversation,currentSpeaker)
    return FileResponse('media/podcast.mp3', media_type="audio/mpeg", filename="podcast.mp3")

@router.post("/get-voice-list")
async def get_voice_list_endpoint():
    voice_list = get_voice_list()
    return {"voice_list": voice_list}

@router.post("/get-elevenlabs-voice-list")
async def get_elevenlabs_voice_list_endpoint():
    voice_list = get_elevenlabs_voices_list()
    return {"voice_list": voice_list}
