

from fastapi import FastAPI, Request
from contextlib import asynccontextmanager
from app.db.session import create_db_and_tables
from app.api import auth
from app.api import chat

from app.services.nlp_service import initialize_ai_client 

@asynccontextmanager
async def lifespan(app: FastAPI):
    
    create_db_and_tables() 
    
    
    app.state.ai_client = initialize_ai_client()
    
    yield
    
    
    print("Shutting down...")

app = FastAPI(title="PulseLinkAI API", lifespan=lifespan)


app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(chat.router, prefix="/api/v1/chat", tags=["Chat"])


@app.get("/")
def get_root():
    return {"message": "Welcome to the PulseLinkAI API!"}