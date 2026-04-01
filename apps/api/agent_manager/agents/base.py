from abc import ABC, abstractmethod
from pydantic import BaseModel, Field
from typing import Literal, Optional, Dict, Any, List
from datetime import datetime

class AgentSignal(BaseModel):
    # Required fields from User Schema
    action: Literal["BUY", "SELL", "HOLD"]
    symbol: str
    qty: int
    order_type: Literal["MARKET", "LIMIT"]
    limit_price: Optional[float] = None
    target: Optional[float] = None
    stop_loss: Optional[float] = None
    confidence: float = Field(..., ge=0.0, le=1.0)
    reason: str
    risk_comment: str
    
    # Internal fields
    agent_name: str = "Unknown"
    timestamp: datetime = Field(default_factory=datetime.now)
    metadata: Dict[str, Any] = Field(default_factory=dict)

# --- New Neural-1 Models ---

class StrategistSignal(BaseModel):
    symbol: str
    core_bias: Literal["strong buy", "buy", "neutral", "sell", "strong sell"]
    max_equity_risk_pct: float
    notes: str

class TacticianOrder(BaseModel):
    symbol: str
    side: Literal["BUY", "SELL", "HOLD"]
    size: float
    entry_price: str # or float
    stop: float
    target: float
    confidence: float
    rationale: str

class SentinelDecision(BaseModel):
    forced_closes: List[Dict[str, Any]] = []
    hedges: List[Dict[str, Any]] = []
    approved_orders: List[TacticianOrder] = []
    risk_warning: Optional[str] = None

class AnalystExplanation(BaseModel):
    symbol: str
    stance: str
    risks: List[str]
    trigger_for_change: str

class BaseAgent(ABC):
    def __init__(self, name: str, model_provider: str):
        self.name = name
        self.model_provider = model_provider
        
    @abstractmethod
    async def analyze(self, market_data: Dict[str, Any], context: Any = None) -> Any:
        pass
        
    def get_info(self) -> Dict[str, str]:
        return {
            "name": self.name,
            "provider": self.model_provider
        }
