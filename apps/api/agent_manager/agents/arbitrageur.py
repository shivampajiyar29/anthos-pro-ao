from .base import BaseAgent, AgentSignal
from typing import Dict, Any
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
import os
import logging
import random

logger = logging.getLogger("ArbitrageurAgent")

class ArbitrageurAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="The Arbitrageur", model_provider="OpenRouter/Grok")
        
        # OpenRouter Configuration for Grok
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

    async def analyze(self, market_data: Dict[str, Any]) -> AgentSignal:
        """
        Analyzes for arbitrage, spreads, and relative value correlations.
        """
        if not self.llm:
            return self._mock_decision(market_data)

        prompt = ChatPromptTemplate.from_template(
            """
            You are 'The Arbitrageur', a market-neutral trading agent.
            Role:
            - Look for mispricing, spreads, relative value.
            - Prefer market-neutral or hedged trades.
            - Focus on statistical anomalies rather than directional trend.

            Input (JSON context):
            {market_data}
            
            Constraints:
            - You must always return exactly one JSON object.
            - Confidence must be between 0 and 1.
            
            Required Output Schema:
            {{
              "action": "BUY/SELL/HOLD",
              "symbol": "...",
              "qty": int,
              "order_type": "MARKET/LIMIT",
              "limit_price": null/float,
              "target": float,
              "stop_loss": float,
              "confidence": 0.0-1.0,
              "reason": "...",
              "risk_comment": "..."
            }}
            """
        )
        
        try:
            chain = prompt | self.llm | JsonOutputParser()
            result = await chain.ainvoke({"market_data": str(market_data)})
            
            return AgentSignal(
                agent_name=self.name,
                action=result.get("action", "HOLD"),
                symbol=result.get("symbol", market_data.get("symbol", "UNKNOWN")),
                qty=result.get("qty", 0),
                order_type=result.get("order_type", "MARKET"),
                limit_price=result.get("limit_price"),
                target=result.get("target"),
                stop_loss=result.get("stop_loss"),
                confidence=float(result.get("confidence", 0.0)),
                reason=result.get("reason", "Arbitrage scan complete."),
                risk_comment=result.get("risk_comment", "Hedged/Neutral stance check."),
                metadata={"role": "Arbitrageur"}
            )
        except Exception as e:
            logger.error(f"Arbitrageur Error: {e}")
            return self._mock_decision(market_data)

    def _mock_decision(self, data) -> AgentSignal:
        symbol = data.get("symbol", "INFY")
        return AgentSignal(
            agent_name=self.name,
            action="HOLD",
            symbol=symbol,
            qty=0,
            order_type="MARKET",
            limit_price=None,
            target=0.0,
            stop_loss=0.0,
            confidence=0.6,
            reason="[Mock] No significant spread detected.",
            risk_comment="Capital preserved.",
            metadata={"mode": "fallback"}
        )
