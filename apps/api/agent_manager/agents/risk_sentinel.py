from .base import BaseAgent, SentinelDecision, TacticianOrder
from typing import Dict, Any, List, Optional
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
import os
import logging
import json

logger = logging.getLogger("RiskSentinelAgent")

class RiskSentinelAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="Sentinel", model_provider="OpenRouter/Grok")
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

    async def analyze(self, market_data: Dict[str, Any], context: List[TacticianOrder] = []) -> SentinelDecision:
        """
        Protects capital by filtering orders and detecting dangerous conditions.
        """
        if not self.llm:
            return self._mock_decision(market_data)

        prompt = ChatPromptTemplate.from_template(
            """
            You are the Sentinel risk agent. Your only job is to protect capital.
            
            Inputs:
            Current Portfolio & Risk Metrics: {market_data}
            Proposed Orders from Tactician: {orders}
            
            Tasks:
            1. Detect dangerous conditions (high correlation, volatility spikes, breaches of max daily loss, drawdown, or VAR limits).
            2. Decide which open positions to cut or hedge.
            3. Decide which proposed new orders to block, reduce, or allow.
            
            Priority: Capital preservation above all else.
            
            Output must be a single JSON object with:
            {{
              "forced_closes": [{"symbol": "...", "reason": "..."}],
              "hedges": [{"symbol": "...", "instrument": "...", "reason": "..."}],
              "approved_orders": [ ... filtered list of Tactician orders ... ],
              "risk_warning": "summary of dangerous conditions found"
            }}
            """
        )
        
        try:
            # We wrap orders in a list if it's not already
            orders_json = json.dumps([o.dict() for o in context]) if context else "[]"
            chain = prompt | self.llm | JsonOutputParser()
            result = await chain.ainvoke({
                "market_data": json.dumps(market_data),
                "orders": orders_json
            })
            
            return SentinelDecision(**result)
        except Exception as e:
            logger.error(f"Sentinel Error: {e}")
            return self._mock_decision(market_data)

    def _mock_decision(self, data) -> SentinelDecision:
        return SentinelDecision(
            forced_closes=[],
            hedges=[],
            approved_orders=[],
            risk_warning="LLM Fallback: Sentinel in safe-mode. Blocking all new orders."
        )
