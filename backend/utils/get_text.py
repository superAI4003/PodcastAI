import speech_recognition as sr
from moviepy.editor import VideoFileClip
from PIL import Image
import pytesseract

def get_text_from_image(file_path):
    img = Image.open(file_path)
    text = pytesseract.image_to_string(img)
    return text

def get_text_from_audio(file_path):
    r = sr.Recognizer()
    with sr.AudioFile(file_path) as source:
        audio_data = r.record(source)
        text = r.recognize_google(audio_data)
        return text
    
def get_text_from_video(file_path):
    video = VideoFileClip(file_path)
    audio = video.audio
    audio_file_path = "media/temp/temp_audio.wav"
    audio.write_audiofile(audio_file_path)
    text = get_text_from_audio(audio_file_path)
    return text
