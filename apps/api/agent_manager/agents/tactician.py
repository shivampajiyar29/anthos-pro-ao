from .base import BaseAgent, TacticianOrder, StrategistSignal
from typing import Dict, Any, Optional
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
import os
import logging
import json

logger = logging.getLogger("TacticianAgent")

class TacticianAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="Tactician", model_provider="OpenRouter/Grok")
        api_key = os.getenv("OPENROUTER_API_KEY", "dummy_key")
        base_url = "https://openrouter.ai/api/v1"
        try:
            self.llm = ChatOpenAI(
                model="x-ai/grok-1",
                openai_api_key=api_key,
                openai_api_base=base_url
            )
        except Exception:
            self.llm = None

    async def analyze(self, market_data: Dict[str, Any], context: Optional[StrategistSignal] = None) -> TacticianOrder:
        """
        Chooses precise entries and exits based on short-term data and Strategist bias.
        """
        if not self.llm:
            return self._mock_decision(market_data)

        prompt = ChatPromptTemplate.from_template(
            """
            You are the Tactician agent.
            You operate on fast timeframes (1M, 5M, 15M) and focus on precise entries, exits, and scaling based on short-term ML predictions, order-flow, and volatility.
            
            Inputs:
            Strategist Bias: {bias}
            Short-term Market Data: {market_data}
            
            Tasks:
            2. Avoid trading against the core_bias.
            3. **Learn from history**: Review `lessons_learned` in the market data to avoid repeating entry/exit mistakes that led to losses.
            
            Output must be a single JSON object with:
            {{
              "symbol": "BTCUSDT",
              "side": "BUY/SELL/HOLD",
              "size": float,
              "entry_price": "market" or float,
              "stop": float,
              "target": float,
              "confidence": float,
              "rationale": "short precision timing explanation"
            }}
            """
        )
        
        try:
            chain = prompt | self.llm | JsonOutputParser()
            result = await chain.ainvoke({
                "bias": context.json() if context else "No bias provided",
                "market_data": json.dumps(market_data)
            })
            
            return TacticianOrder(**result)
        except Exception as e:
            logger.error(f"Tactician Error: {e}")
            return self._mock_decision(market_data)

    def _mock_decision(self, data) -> TacticianOrder:
        return TacticianOrder(
            symbol=data.get("symbol", "BTCUSDT"),
            side="HOLD",
            size=0.0,
            entry_price="market",
            stop=0.0,
            target=0.0,
            confidence=0.5,
            rationale="LLM Fallback: Precision engine offline."
        )
