from .base import BaseAgent, StrategistSignal
from typing import Dict, Any, Optional
from langchain_nvidia_ai_endpoints import ChatNVIDIA
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
import os
import logging
import json

logger = logging.getLogger("StrategistAgent")

class StrategistAgent(BaseAgent):
    def __init__(self):
        api_key = os.getenv("NVIDIA_API_KEY", "dummy_key")
        model_name = "meta/llama-3.1-405b-instruct" 
        try:
            self.llm = ChatNVIDIA(model=model_name, api_key=api_key)
        except Exception as e:
            logger.warning(f"Failed to init NVIDIA LLM ({model_name}): {e}. Using mock mode.")
            self.llm = None

    async def analyze(self, market_data: Dict[str, Any], context: Optional[Any] = None) -> StrategistSignal:
        """
        Determines core market bias based on higher timeframe data.
        """
        if not self.llm:
            return self._mock_decision(market_data)

        prompt = ChatPromptTemplate.from_template(
            """
            You are the Strategist agent in a multi-agent trading system.
            You focus on higher-timeframe structure (1H, 4H, daily) and define the core bias per symbol (bullish, bearish, neutral) plus the maximum risk budget allowed.
            
            Inputs:
            Trend Indicators & Macro Context: {market_data}
            Current Portfolio Allocations: {context}

            4. **Future Prediction**: Provide a specific outlook for the next 24 hours and 7 days. Include confidence intervals (e.g., "BTC +/- 2%").
            5. **Avoid repeating past mistakes**: Review the `lessons_learned` (if any) and ensure your bias doesn't lead to the same failures.
            
            Inputs:
            Trend Indicators & Macro Context: {market_data}
            Current Portfolio Allocations: {context}

            Output must be a single JSON object with:
            {{
              "symbol": "BTCUSDT",
              "core_bias": "strong buy/buy/neutral/sell/strong sell",
              "max_equity_risk_pct": float,
              "prediction_24h": "string outlook",
              "prediction_7d": "string outlook",
              "confidence_score": float (0.0 to 1.0),
              "notes": "short explanation for Tactician"
            }}
            """
        )
        
        try:
            chain = prompt | self.llm | JsonOutputParser()
            result = await chain.ainvoke({
                "market_data": json.dumps(market_data),
                "context": json.dumps(context) if context else "None"
            })
            
            return StrategistSignal(**result)
        except Exception as e:
            logger.error(f"Strategist Error: {e}")
            return self._mock_decision(market_data)

    def _mock_decision(self, data) -> StrategistSignal:
        return StrategistSignal(
            symbol=data.get("symbol", "BTCUSDT"),
            core_bias="neutral",
            max_equity_risk_pct=1.0,
            notes="LLM Fallback: Maintaining neural stance due to system disconnect."
        )
