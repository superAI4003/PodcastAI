import argparse
import os
import models
from database import engine, get_db
from dotenv import load_dotenv
from routes.userprompts import read_user_prompts
from routes.prompts import read_prompts
from utils.generation_conversation import generate_conversation
from utils.generation_audio import generate_audio, get_voice_list
google_credentials = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
load_dotenv()

models.Base.metadata.create_all(bind=engine)
db_session = next(get_db())

def get_args():
    parser = argparse.ArgumentParser(description="Run batch generation with specific parameters.")
    parser.add_argument('--m', action='store_true', help='Specify the mode of operation.') 
    parser.add_argument('-article', type=str, required=False, help='Article to be discussed.')
    parser.add_argument('-user_prompt_db', type=str, required=False, help='Name as saved in the database')
    parser.add_argument('-user_prompt_cmdline', type=str, required=False, help='Direct user prompt from command line')
    parser.add_argument('-system_prompt_db', type=str, required=False, help='Name as saved in the database')
    parser.add_argument('-speaker_1', type=str, required=False, help='Parameter for speaker 1')
    parser.add_argument('-speaker_2', type=str, required=False, help='Parameter for speaker 2')
    parser.add_argument('-help', action='store_true', help='Display help information with available prompts and speakers')
    parser.add_argument('--o', action='store_true', help='Specify the mode of operation.') 
    parser.add_argument('-output', type=str, required=False, help='Parameter for speaker 2')
    args = parser.parse_args()

    
    if args.help:
        display_help_info()
        exit()
    if bool(args.user_prompt_db) == bool(args.user_prompt_cmdline):
        parser.error("Either -user_prompt_db or -user_prompt_cmdline must be provided, but not both.")

    return args.user_prompt_db, args.system_prompt_db, args.speaker_1, args.speaker_2, args.article, args.output, args.user_prompt_cmdline

def display_help_info():
    print("Help Information:")
    print("Available User Prompts:")
    user_prompts = read_user_prompts(db=db_session)
    for uprompt in user_prompts:
        print(uprompt.title)
    print("Available System Prompts:")
    prompts = read_prompts(db=db_session)
    for prompt in prompts:
        print(prompt.title)
    print("Available Speakers:")
    all_voices = get_voice_list()
    for voice in all_voices:
        print(voice)

def get_user_prompt(args_user_prompt):
    user_prompts = read_user_prompts(db=db_session)
    user_prompt = None
    for uprompt in user_prompts:
        if uprompt.title == args_user_prompt:  # Check if the title matches the user argument
            user_prompt = uprompt.description
    if user_prompt is None:
        print("User prompt not found.")
        print("Available User Prompts:")
        for uprompt in user_prompts:
            print(uprompt.title)
        exit()
    return user_prompt

def get_system_prompt(args_system_prompt):
    prompts = read_prompts(db=db_session)
    system_prompt = None
    for prompt in prompts:
        if prompt.title == args_system_prompt:  # Check if the title matches the user argument
            system_prompt = prompt.description
    if system_prompt is None:
        print("System prompt not found.")
        print("Available System Prompts:")
        for prompt in prompts:
            print(prompt.title)
        exit()
    return system_prompt

def get_current_speaker(args_speaker_1, args_speaker_2):
    all_voices = get_voice_list()
    if args_speaker_1 not in all_voices and args_speaker_2 not in all_voices:
        print("Not found voice you input.")
        print("Available voices:")
        for voice in all_voices:
            print(voice)
        exit()
    else:
        return {
            "person1": args_speaker_1,
            "style1":True,
            "person2": args_speaker_2,
            "style2":True
        }

args_user_prompt, args_system_prompt, args_speaker_1, args_speaker_2, args_article, args_output, args_user_prompt_cmdline = get_args()

if args_user_prompt_cmdline:
    user_prompt = args_user_prompt_cmdline
    system_prompt = get_system_prompt(args_system_prompt)
if args_user_prompt:
    user_prompt = get_user_prompt(args_user_prompt)
    system_prompt = get_system_prompt(args_system_prompt)
get_current_speaker(args_speaker_1, args_speaker_2)
current_speaker = get_current_speaker(args_speaker_1, args_speaker_2)
generated_conversation = generate_conversation(args_article, user_prompt, system_prompt)
generate_audio(generated_conversation, current_speaker, args_output)