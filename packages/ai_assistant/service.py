from typing import Dict, Any, Optional
import json
from packages.common.logging import get_logger

logger = get_logger("ai_assistant.service")

class AIService:
    """
    Service hub for AI-powered trading features.
    In production, this connects to OpenAI/Anthropic/Local LLMs.
    """
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key

    async def generate_strategy_dsl(self, prompt: str) -> Dict[str, Any]:
        """
        Convert natural language description into Strategy DSL JSON.
        """
        logger.info(f"Generating DSL for prompt: {prompt}")
        
        # MOCK LOGIC for demonstration
        if "straddle" in prompt.lower():
            return {
                "name": "AI Generated Straddle",
                "legs": [
                    {"instrument": {"symbol": "NIFTY", "instrument_type": "OPT", "option_type": "CE"}, "action": "SELL", "quantity": 50},
                    {"instrument": {"symbol": "NIFTY", "instrument_type": "OPT", "option_type": "PE"}, "action": "SELL", "quantity": 50}
                ]
            }
        
        return {"error": "Could not parse strategy. Try 'Build a short straddle'."}

    async def explain_results(self, metrics: Dict[str, Any]) -> str:
        """
        Provide a human-readable summary of backtest performance.
        """
        sharpe = metrics.get('sharpe_ratio', 0)
        if sharpe > 2:
            return "This strategy shows exceptional risk-adjusted returns. Warning: Check for overfitting."
        elif sharpe < 0:
            return "Strategy is consistently losing value. Regime analysis suggests it fails in high-volatility."
        return "Stable performance. Consider conservative deployment."
