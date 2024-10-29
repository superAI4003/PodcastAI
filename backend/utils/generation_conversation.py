from vertexai.generative_models import GenerativeModel, GenerationConfig
import vertexai
import json


generation_config = GenerationConfig(
    max_output_tokens=8192,
    temperature=1,
    top_p=0.95,
    response_mime_type="application/json",
    response_schema={"type": "ARRAY", "items": {"type": "OBJECT", "properties": {"speaker": {"type": "STRING"}, "text": {"type": "STRING"}}}},
)


def generate_conversation(prompt_text, article):
    vertexai.init(project="bookcastlm", location="us-central1")
    model = GenerativeModel(
        "gemini-1.5-flash-001",
        system_instruction=[prompt_text]
    )
    responses = model.generate_content(
        [article],
        generation_config=generation_config,
        stream=False,
    )
    
    json_response = responses.candidates[0].content.parts[0].text
    json_data = json.loads(json_response)
    formatted_json = json.dumps(json_data, indent=4)
   
    return json_data
