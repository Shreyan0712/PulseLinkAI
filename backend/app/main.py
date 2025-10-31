from fastapi import FastAPI
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware

from app.db.session import create_db_and_tables
from app.api import auth, chat, audio, topics # ✅ ADDED topics
from app.services.nlp_service import initialize_ai_client


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database
    create_db_and_tables()

    # Initialize AI client
    app.state.ai_client = initialize_ai_client()

    yield  # Keeps app running

    print("Shutting down...")


# Create FastAPI app
app = FastAPI(title="PulseLinkAI API", lifespan=lifespan)

# ✅ Allow frontend (React) to talk to backend
origins = [
    "http://localhost:8080",  # React dev server (Vite default)
    "http://127.0.0.1:8080",  # Alternate local address
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          # Frontend URLs allowed
    allow_credentials=True,
    allow_methods=["*"],            # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],            # Allow all headers
)

# ✅ Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(chat.router, prefix="/api/v1/chat", tags=["Chat"])
app.include_router(audio.router, prefix="/api/v1/audio", tags=["Audio"])
app.include_router(topics.router, prefix="/api/v1/data", tags=["Data"]) # ✅ ADDED Topics Router


# ✅ Root route for testing
@app.get("/")
def get_root():
    return {"message": "Welcome to the PulseLinkAI API!"}


# ✅ Test connection endpoint (for frontend testing)
@app.get("/api/v1/test")
def test_connection():
    return {"message": "Backend is connected successfully!"}
