from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from app.services.nlp_service import transcribe_audio, get_ai_client
from app.api.auth import get_current_user
from app.models.user import User as UserModel
from app.schemas.audio_schema import TranscriptionResponse
import groq

router = APIRouter()

@router.post("/transcribe", response_model=TranscriptionResponse)
async def handle_transcription(
    *,
    
    current_user: UserModel = Depends(get_current_user),

    
    ai_client: groq.Groq = Depends(get_ai_client),

    
    audio_file: UploadFile = File(...)
):
    """
    Accepts an audio file, transcribes it to text, and returns the text.
    """
    if not ai_client:
        raise HTTPException(status_code=503, detail="AI service is unavailable.")

    
    transcribed_text = transcribe_audio(ai_client, audio_file)

    if transcribed_text is None:
        raise HTTPException(status_code=500, detail="Could not transcribe audio.")

    
    return TranscriptionResponse(text=transcribed_text)