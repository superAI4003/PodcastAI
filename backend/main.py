from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from database import engine
import models
from routes import prompts, generation, userprompts
from google.cloud import texttospeech
from starlette.middleware.trustedhost import TrustedHostMiddleware
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware



# Create tables
models.Base.metadata.create_all(bind=engine)
app = FastAPI(
    title="My backend"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

load_dotenv()

# Now you can access the environment variable
google_credentials = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')

# Include routers
app.include_router(prompts.router, prefix="/prompts", tags=["prompts"])
app.include_router(userprompts.router, prefix="/userprompts", tags=["userprompts"])
app.include_router(generation.router, tags=["generation"])
