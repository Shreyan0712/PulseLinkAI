

import groq
from fastapi import Request
from app.core.config import settings


SYSTEM_INSTRUCTION = (
    "You are PulseLinkAI, a secure, HIPAA-compliant digital health assistant. "
    "Your goal is to help users navigate healthcare, schedule appointments, "
    "and explain medical reports. "
    "CRITICAL: NEVER offer a diagnosis, treatment, or specific medical advice. "
    "If asked for medical advice, state you are an assistant, not a doctor. "
    "Encourage the user to use the app's features (scheduling or report analysis)."
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


def get_chat_response(user_input: str, client: groq.Groq) -> str:
    """
    Sends user input to the Groq model and returns the response.
    """
    if not client:
        return "I am sorry, the AI service is currently unavailable."
        
    try:
        
        response = client.chat.completions.create(
            
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": SYSTEM_INSTRUCTION},
                {"role": "user", "content": user_input}
            ]
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