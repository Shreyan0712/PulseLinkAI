from fastapi import APIRouter, Depends, HTTPException, Request
from app.schemas.chat_schema import ChatRequest, ChatResponse
from app.services.nlp_service import get_chat_response, get_ai_client

router = APIRouter()

@router.post("/", response_model=ChatResponse)
def handle_chat(
    chat_request: ChatRequest,
    request: Request,
    ai_client = Depends(get_ai_client)
):
    """
    Handles incoming chat messages from the frontend.
    """
    try:
        if not ai_client:
            raise HTTPException(status_code=500, detail="AI client not initialized")

        # Get the AI's response from your Groq model
        ai_response_text = get_chat_response(chat_request.messages, ai_client)

        # Return the AI's response to the frontend
        return ChatResponse(response=ai_response_text)

    except HTTPException as e:
        raise e
    except Exception as e:
        print("Error in /chat route:", e)
        raise HTTPException(status_code=500, detail="Internal server error")
