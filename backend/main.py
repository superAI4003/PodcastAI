from fastapi import FastAPI, File, UploadFile, Form
import os
import json
from utils.get_text import get_text_from_audio, get_text_from_video, get_text_from_image
from utils.generation_audio import generate_audio
from utils.generation_conversation import generate_conversation
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from dotenv import load_dotenv

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to your needs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv()

# Now you can access the environment variable
google_credentials = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')

# Load prompt
with open('config/prompts.json', 'r') as f:
    prompts = json.load(f)

def find_prompt_by_id(id):
    for prompt_obj in prompts:
        if prompt_obj['id'] == id:
            return prompt_obj['prompt']
    return "Default prompt"  # Provide a default prompt or handle the None case

@app.post("/generate-conversation")
async def generate_conversation_endpoint(file: UploadFile = File(None)):
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

    prompt = find_prompt_by_id(1)
    if prompt is None:
        return JSONResponse(status_code=400, content={"error": "Prompt not found"})

    result = generate_conversation(prompt, article)
    return {"result": result}

@app.post("/generate-conversation-by-text")
async def generate_conversation_by_text_endpoint(text: str = Form(...)):
    prompt = find_prompt_by_id(1)
    if prompt is None:
        return JSONResponse(status_code=400, content={"error": "Prompt not found"})

    result = generate_conversation(prompt, text)
    return {"result": result}

@app.post("/generate-audio")
async def generate_audio_endpoint(conversation: str = Form(...)):

    audio_file_path = generate_audio(conversation)
    return FileResponse('media/podcast.mp3', media_type="audio/mpeg", filename="podcast.mp3")
