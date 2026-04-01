from .base import BaseAgent, AgentSignal
from typing import Dict, Any, Optional
import logging
from datetime import datetime

logger = logging.getLogger("MyselfAgent")

class MyselfAgent(BaseAgent):
    """
    Representation of the User's own trading intelligence.
    Aggregates manual trades and provides a 'Human bias' signal.
    """
    def __init__(self):
        super().__init__("WithMyself", "Human")
        self.role = "Human Intelligence"

    async def analyze(self, market_data: Dict[str, Any], context: Optional[Any] = None) -> AgentSignal:
        """
        In a purely automated cycle, this agent remains 'NEUTRAL' or 'WAITING' 
        unless a manual trade was recently detected or explicitly set.
        """
        # Default behavior: Observe and wait for user input
        return AgentSignal(
            symbol=market_data.get("symbol", "BTCUSDT"),
            action="WAIT",
            confidence=1.0, # Complete confidence in waiting
            reason="Awaiting direct neural input from the user (WithMyself mode)."
        )

    def _mock_decision(self, data) -> AgentSignal:
        return AgentSignal(
            symbol=data.get("symbol", "BTCUSDT"),
            action="WAIT",
            confidence=1.0,
            reason="Human agent in standby."
        )
