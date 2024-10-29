import base64
import json
import vertexai
import os
import re
import requests
from google.cloud import texttospeech
from pydub import AudioSegment
from dotenv import load_dotenv
load_dotenv()

# Now you can access the environment variable
google_credentials = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')

client = texttospeech.TextToSpeechClient()

speaker_voice_map = {
    "Sascha": "en-US-Wavenet-D",  # We'll handle Sascha with the ElevenLabs API
    "Marina": "en-US-Journey-O"  # Marina uses the Google API
}

def synthesize_speech_google(text, speaker, index):
    synthesis_input = texttospeech.SynthesisInput(text=text)
    voice = texttospeech.VoiceSelectionParams(
        language_code="en-US",
        name=speaker_voice_map[speaker]
    )
    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.LINEAR16
    )
    response = client.synthesize_speech(
        input=synthesis_input, voice=voice, audio_config=audio_config
    )
    filename = f"media/audio-files/{index}_{speaker}.mp3"
    with open(filename, "wb") as out:
        out.write(response.audio_content)
    print(f'Audio content written to file "{filename}"')

def synthesize_speech(text, speaker, index):
    if speaker == "Sascha":
        synthesize_speech_google(text, speaker, index)
    else:
        synthesize_speech_google(text, speaker, index)

def natural_sort_key(filename):
    return [int(text) if text.isdigit() else text for text in re.split(r'(\d+)', filename)]
# 

def generate_audio(conversation):
    if isinstance(conversation, str):
        conversation = json.loads(conversation)

    for index, part in enumerate(conversation):
        if isinstance(part, dict):  # Ensure part is a dictionary
            speaker = part['speaker']
            text = part['text']
            synthesize_speech(text, speaker, index)
        else:
            print(f"Unexpected format for conversation part: {part}")
    audio_folder = "media/audio-files"
    output_file = "media/podcast.mp3"
    merge_audios(audio_folder, output_file)

def merge_audios(audio_folder, output_file):
    combined = AudioSegment.empty()
    audio_files = sorted(
        [f for f in os.listdir(audio_folder) if f.endswith(".mp3") or f.endswith(".wav")],
        key=natural_sort_key
    )
    for filename in audio_files:
        audio_path = os.path.join(audio_folder, filename)
        print(f"Processing: {audio_path}")
        audio = AudioSegment.from_file(audio_path)
        combined += audio
    combined.export(output_file, format="mp3")
    print(f"Merged audio saved as {output_file}")


# load json file and geenrate audio with conversation
# with open('generated_conversation.json', 'r') as json_file:
#     conversation = json.load(json_file)
#     generate_audio(conversation)
