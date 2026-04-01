from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional
import os
import json
from packages.core.database import get_db
from ..auth import get_current_user

router = APIRouter(prefix="/ai", tags=["ai"])

@router.post("/generate-strategy")
async def generate_strategy(prompt: str, current_user_email: str = Depends(get_current_user)):
    """
    Converts natural language prompt into a Strategy DSL JSON.
    """
    # In a full implementation, this uses LangChain with a specific system prompt
    # for generating valid StrategyDSL schemas.
    # For now, we provide a placeholder response that mimics the capability.
    
    mock_dsl = {
        "name": "AI Generated Mean Reversion",
        "description": f"Strategy generated from prompt: {prompt}",
        "instruments": ["BTCUSDT"],
        "timeframe": "15m",
        "legs": [
            {
                "instrument_type": "EQUITY",
                "symbol": "BTCUSDT",
                "side": "BUY",
                "quantity": 1,
                "order_type": "MARKET"
            }
        ],
        "entry_rules": [{"condition": "rsi(14) < 30"}],
        "exit_rules": [{"condition": "rsi(14) > 70"}]
    }
    
    return {"dsl": mock_dsl, "explanation": "This strategy enters when RSI is oversold (<30) and exits when overbought (>70)."}

@router.post("/analyze")
async def analyze_market(symbol: str = "BTCUSDT", current_user_email: str = Depends(get_current_user)):
    """
    Provides a multi-agent neural analysis for a specific symbol.
    """
    # This would instantiate and run the Strategist and Analyst agents.
    return {
        "symbol": symbol,
        "bias": "BULLISH",
        "confidence": 0.85,
        "reasoning": "Higher timeframe structure shows strong support at current levels with increasing volume in the last 4H cycle.",
        "risk_level": "MODERATE"
    }
