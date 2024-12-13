from vertexai.generative_models import GenerativeModel, GenerationConfig
import vertexai
import json
from google.api_core.exceptions import ResourceExhausted
import time

generation_config = GenerationConfig(
    max_output_tokens=8192,
    temperature=1,
    top_p=0.95,
    response_mime_type="application/json",
    response_schema={"type": "ARRAY", "items": {"type": "OBJECT", "properties": {"speaker": {"type": "STRING"}, "text": {"type": "STRING"}}}},
)


def generate_conversation(prompt_text, article, userPrompt):
    vertexai.init(project="bookcastlm", location="us-central1")
    model = GenerativeModel(
        "gemini-1.5-flash-001",
        system_instruction=[prompt_text]
    )

    retry_count = 0
    delay = 4  # delay in seconds

    while True:
        try:
            responses = model.generate_content(
                [article,userPrompt],
                generation_config=generation_config,
                stream=False,
            )
            try:
                json_response = responses.candidates[0].content.parts[0].text
            except IndexError:
                print("No response generated, retrying...")
                continue 
            try:
                json_data = json.loads(json_response)
            except json.decoder.JSONDecodeError:
                print("JSONDecodeError encountered, retrying...")
                continue
            for i, item in enumerate(json_data):
                if i % 2 == 0:
                    item['speaker'] = 'person1'
                else:
                    item['speaker'] = 'person2'
            return json_data
            break  # If successful, break the loop
        except ResourceExhausted:
            if retry_count >= 5:  # Maximum retries
                raise  # If maximum retries exceeded, raise the exception
            else:
                print(f"Quota exceeded, retrying in {delay} seconds...")
                time.sleep(delay)
                retry_count += 1
                delay *= 2  # Double the delay for exponential backoff
        except Exception as e:  # Catch any other exceptions
            if retry_count >= 5:  # Maximum retries
                raise  # If maximum retries exceeded, raise the exception
            else:
                print(f"Error: {e}. Retrying in {delay} seconds...")
                time.sleep(delay)
                retry_count += 1
                delay *= 2  # Double the delay for exponential backoff

generation_config_cate = GenerationConfig(
    max_output_tokens=8192,
    temperature=1,
    top_p=0.95,
    response_mime_type="application/json",
    response_schema={"type": "STRING"},
)
    
def generate_category(text):
    vertexai.init(project="bookcastlm", location="us-central1")
    model = GenerativeModel(
        "gemini-1.5-flash-001",
        system_instruction=["Give me category of this book title."]
    )
    retry_count = 0
    delay = 4  # delay in seconds

    while True:
        try:
            responses = model.generate_content(
                [text],
                generation_config=generation_config_cate,
                stream=False,
            )
            try:
                json_response = responses.candidates[0].content.parts[0].text
            except IndexError:
                print("No response generated, retrying...")
                continue 
            json_response = json_response.replace('"', '')
            return json_response
            break  # If successful, break the loop
        except ResourceExhausted:
            if retry_count >= 5:  # Maximum retries
                raise  # If maximum retries exceeded, raise the exception
            else:
                print(f"Quota exceeded, retrying in {delay} seconds...")
                time.sleep(delay)
                retry_count += 1
                delay *= 2  # Double the delay for exponential backoff
        except Exception as e:  # Catch any other exceptions
            if retry_count >= 5:  # Maximum retries
                raise  # If maximum retries exceeded, raise the exception
            else:
                print(f"Error: {e}. Retrying in {delay} seconds...")
                time.sleep(delay)
                retry_count += 1
                delay *= 2  # Double the delay for exponential backoff