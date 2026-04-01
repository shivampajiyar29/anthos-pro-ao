from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional

router = APIRouter()

class AIRequest(BaseModel):
    prompt: Optional[str] = None
    dsl: Optional[Dict] = None

@router.get("/")
async def list_ai_tasks():
    """List pending AI strategy generation tasks."""
    return []

@router.post("/generate")
async def generate_strategy(request: AIRequest):
    """Generate strategy DSL from natural language prompt."""
    if not request.prompt:
        raise HTTPException(status_code=400, detail="Prompt is required")
    return {"dsl": {}, "status": "mock_success"}

@router.post("/explain")
async def explain_strategy(request: AIRequest):
    """Explain a strategy DSL in natural language."""
    if not request.dsl:
        raise HTTPException(status_code=400, detail="DSL is required")
    return {"explanation": "This strategy performs...", "status": "mock_success"}

