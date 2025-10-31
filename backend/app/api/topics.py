from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

# Define the structure of the data you will send (Pydantic Model)
class Topic(BaseModel):
    id: int
    name: str
    description: str

router = APIRouter()

# Mock data to be transferred
MOCK_TOPICS: List[Topic] = [
    Topic(id=1, name="Mental Health", description="Discussions and resources for mental wellness."),
    Topic(id=2, name="Cardiovascular Care", description="Information on heart health and related services."),
    Topic(id=3, name="Pediatric Advice", description="Expert advice for child health and development."),
]

@router.get("/topics", response_model=List[Topic])
def get_topics():
    """
    Returns a list of mock chat topics to demonstrate data transfer.
    """
    # In a real app, this would be a database query (e.g., SQLAlchemy)
    return MOCK_TOPICS
