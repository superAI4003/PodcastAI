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

# Add this line with the other environment variable
heygen_api_key = os.getenv('HEYGEN_API_KEY')
# Now you can access the environment variable
google_credentials = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')

client = texttospeech.TextToSpeechClient()



def synthesize_speech_google(text, speaker, index,speaker_voice_map):
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

def synthesize_speech_heygen(text, speaker, index):
    url = "https://api.heygen.com/v2/voices"

    headers = {
    "accept": "application/json",
    "x-api-key": heygen_api_key
}

    payload = {
        "text": text,
        "voice_id": "1bd001e7e50f421d891986aad5158bc8"  # Make sure voice_id is defined for the speaker
    }

    response = requests.post(url, headers=headers, data=json.dumps(payload))

    if response.status_code == 200:
        # Get audio URL from response
        audio_url = response.json().get('audio_url')
        
        # Download the audio content
        audio_response = requests.get(audio_url)
        if audio_response.status_code == 200:
            # Save to file using same naming convention as Google method
            filename = f"media/audio-files/{index}_{speaker}.mp3"
            with open(filename, "wb") as out:
                out.write(audio_response.content)
            print(f'Audio content written to file "{filename}"')
        else:
            print(f"Error downloading audio: {audio_response.status_code}")
    else:
        print(f"Error: {response.status_code}")
        print(response.text)

def synthesize_speech(text, speaker, index,speaker_voice_map):
    if speaker == "person1":
        synthesize_speech_google(text, speaker, index,speaker_voice_map)
    else:
        synthesize_speech_google(text, speaker, index,speaker_voice_map)

def natural_sort_key(filename):
    return [int(text) if text.isdigit() else text for text in re.split(r'(\d+)', filename)]
# 

def generate_audio(conversation,currentSpeaker):
    if isinstance(conversation, str):
        conversation = json.loads(conversation)
        speaker_voice_map = json.loads(currentSpeaker)
    for index, part in enumerate(conversation):
        if isinstance(part, dict):  # Ensure part is a dictionary
            speaker = part['speaker']
            text = part['text']
            synthesize_speech(text, speaker, index,speaker_voice_map)
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


def get_voice_list():
    voices = client.list_voices()
    # Convert the protobuf message to a serializable format
    voice_list = []
    for voice in voices.voices:
        # Only include voices that support English (en-US or en-GB)
        if any(lang.startswith('en-US') for lang in voice.language_codes):
          
            voice_list.append(voice.name)
    return voice_list

# synthesize_speech_heygen("hello", "person1", 1)
def get_heygen_voices_list():
    url = "https://api.heygen.com/v2/voices"
    
    headers = {
        "accept": "application/json",
        "x-api-key": heygen_api_key
    }

    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        response_data = response.json()
        
        try:
            voices_data = response_data.get('data', {}).get('voices', [])
            if not isinstance(voices_data, list):
                print(f"Unexpected voices_data type: {type(voices_data)}")
                return []
                
            return [
                {
                    "name": voice["name"],
                    "voice_id": voice["voice_id"]
                }
                for voice in voices_data
                if isinstance(voice, dict) and voice.get("language") == "English"
            ]
        except Exception as e:
            print(f"Error processing voices: {str(e)}")
            return []
    else:
        print(f"Error: {response.status_code}")
        return []

synthesize_speech_heygen('deadline is yesterday', "speaker", 100)