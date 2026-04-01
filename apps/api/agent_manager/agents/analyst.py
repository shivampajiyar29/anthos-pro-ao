from .base import BaseAgent, AnalystExplanation
from typing import Dict, Any, Optional
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
import os
import logging
import json

logger = logging.getLogger("AnalystAgent")

class AnalystAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="Analyst", model_provider="OpenRouter/Grok")
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

    async def analyze(self, market_data: Dict[str, Any], context: Dict[str, Any] = {}) -> AnalystExplanation:
        """
        Explains the system's decisions in clear English.
        """
        if not self.llm:
            return self._mock_decision(market_data)

        prompt = ChatPromptTemplate.from_template(
            """
            You are the Analyst agent. You do not place trades.
            You read the latest data, ML outputs, and the decisions made by Strategist, Tactician, and Sentinel.
            
            Inputs:
            Latest Market Data: {market_data}
            Full Chain Decisions: {context}
            
            Your job is to explain in clear English:
            1. Why the system is long/short/flat on each major symbol.
            2. What the main risks are.
            3. What would cause the system to change its view.
            4. **Lessons Applied**: If any historical lessons were relevant to today's decision, mention how the system adapted to avoid past mistakes.
            
            Output must be a single JSON object with:
            {{
              "symbol": "BTCUSDT",
              "stance": "summary of the position and why",
              "risks": ["risk 1", "risk 2"],
              "trigger_for_change": "what would flip our bias"
            }}
            """
        )
        
        try:
            chain = prompt | self.llm | JsonOutputParser()
            result = await chain.ainvoke({
                "market_data": json.dumps(market_data),
                "context": json.dumps(context)
            })
            
            return AnalystExplanation(**result)
        except Exception as e:
            logger.error(f"Analyst Error: {e}")
            return self._mock_decision(market_data)

    def _mock_decision(self, data) -> AnalystExplanation:
        return AnalystExplanation(
            symbol=data.get("symbol", "BTCUSDT"),
            stance="Steady neural synchronization. Awaiting full brain connectivity.",
            risks=["API Connectivity", "LLM Latency"],
            trigger_for_change="Full node activation"
        )
