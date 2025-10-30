
from fastapi import APIRouter, Depends
from app.schemas.chat_schema import ChatRequest, ChatResponse
from app.services.nlp_service import get_chat_response, get_ai_client 
from app.api.auth import get_current_user
from app.models.user import User as UserModel

router = APIRouter()

@router.post("/", response_model=ChatResponse)
def handle_chat(
    *,
    chat_request: ChatRequest,
    current_user: UserModel = Depends(get_current_user),
    
    ai_client = Depends(get_ai_client) 
):
    user_input = chat_request.text
    
    ai_response = get_chat_response(user_input, ai_client)
    return ChatResponse(response=ai_response)