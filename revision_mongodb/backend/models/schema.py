from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime

class TradeRecord(BaseModel):
    """
    Pydantic model for a trade record in MongoDB.
    """
    symbol: str
    market: str
    side: str
    quantity: float
    entry_price: float
    exit_price: Optional[float] = None
    status: str
    ai_reasoning: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    metadata: Dict[str, Any] = Field(default_factory=dict)

    class Config:
        json_schema_extra = {
            "example": {
                "symbol": "AAPL",
                "market": "US",
                "side": "BUY",
                "quantity": 10.0,
                "entry_price": 175.42,
                "status": "EXECUTED",
                "ai_reasoning": "Strong momentum detected in Qwen analysis.",
                "metadata": {"order_id": "alp-123"}
            }
        }

class PortfolioState(BaseModel):
    """
    Pydantic model for portfolio state in MongoDB.
    """
    equity: float
    balance: float
    drawdown: float
    updated_at: datetime = Field(default_factory=datetime.utcnow)
