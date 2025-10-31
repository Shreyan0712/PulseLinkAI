import groq
from fastapi import Request, UploadFile  # <-- Make sure UploadFile is imported
from app.core.config import settings
from app.schemas.chat_schema import Message
from typing import List


SYSTEM_INSTRUCTION = (
    "You are PulseLinkAI, a secure, HIPAA-compliant digital health assistant. "
    "Your role is to be a supportive and informational conversational partner."
    
    "When a user describes symptoms (e.g., 'I have a headache and fever'), "
    "your response MUST follow this exact two-part structure:"
    
    "PART 1: First, provide immediate, general, non-prescriptive self-care tips. "
    "Good examples are: 'get plenty of rest,' 'stay hydrated by drinking water or clear fluids,' "
    "or 'a cool compress on your forehead might help you feel more comfortable.' "
    
    "PART 2: After providing the tips, you MUST state your limitations. "
    "Explain that you are an AI, not a doctor, and this is general information, not medical advice. "
    "Conclude by strongly recommending they consult a healthcare professional for a proper diagnosis."
    
    "CRITICAL: You are stateless. DO NOT ask follow-up questions like 'Would you like some tips?'. "
    "You must provide the tips and the disclaimer in one single, complete response."
)


def initialize_ai_client():
    """
    Initializes and returns a Groq client during app startup.
    """
    try:
        
        if not settings.GROQ_API_KEY or settings.GROQ_API_KEY == "YOUR_API_KEY_HERE":
            raise ValueError(
                "GROQ_API_KEY is missing or is still the default placeholder. "
                "Please set it in your .env file."
            )
            
        client = groq.Groq(api_key=settings.GROQ_API_KEY)
        
        
        client.models.list() 
        
        print("Groq client initialized successfully.")
        return client
        
    except (ValueError, groq.APIError) as e:
        print(f"Error initializing Groq client: {e}")
        return None
    except Exception as e:
        print(f"A general error occurred during Groq initialization: {e}")
        return None


def get_ai_client(request: Request):
    """
    FastAPI dependency to get the Groq client from the app state.
    (This function is identical to the OpenAI one)
    """
    return request.app.state.ai_client

def transcribe_audio(client: groq.Groq, audio_file: UploadFile) -> str | None:
    """
    Transcribes an audio file using Groq's Whisper API.
    """
    try:
        # We pass the file-like object directly to the API
        # We don't specify the language, so Whisper will auto-detect it.
        transcription = client.audio.transcriptions.create(
            file=(audio_file.filename, audio_file.file, audio_file.content_type),
            model="whisper-large-v3"
        )
        return transcription.text

    except groq.APIError as e:
        print(f"Groq STT Error: {e}")
        return None
    except Exception as e:
        print(f"General STT Error: {e}")
        return None

def get_chat_response(messages: List[Message], client: groq.Groq) -> str:
    """
    Sends the full conversation history to the Groq model.
    """
    if not client:
        return "I am sorry, the AI service is currently unavailable."

    # 1. Create the system message object
    system_message = {"role": "system", "content": SYSTEM_INSTRUCTION}
    
    # 2. Convert your list of Pydantic Message models into a list of dictionaries
    #    that the Groq API can understand.
    messages_for_api = [msg.model_dump() for msg in messages]

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant", 
            # 3. Send the system prompt *plus* the entire chat history
            messages=[system_message] + messages_for_api
        )
        
        if response.choices and response.choices[0].message:
            return response.choices[0].message.content
        else:
            return "I'm sorry, I received an empty response from the AI."
        
    except groq.APIError as e:
        return f"Groq API Error: {e}"
    except Exception as e:
        print(f"An unexpected error occurred in get_chat_response: {e}")
        return "An unexpected error occurred."
