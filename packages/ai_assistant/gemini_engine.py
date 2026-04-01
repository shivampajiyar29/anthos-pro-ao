import json
import logging
from typing import Dict, Any, Optional
import google.generativeai as genai
from packages.common.config import settings

logger = logging.getLogger("GeminiEngine")

class GeminiEngine:
    def __init__(self, api_key: str):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')
        self.system_prompt = """
        You are an expert algorithmic trading assistant. 
        Your task is to analyze market data (OHLCV) and provide a clear, structured trading signal.
        
        INPUT DATA:
        - Symbol: {symbol}
        - Current Price: {price}
        - Recent Candles (1m): {candles}
        
        RULES:
        1. Output ONLY a JSON object.
        2. Action must be "BUY", "SELL", or "HOLD".
        3. Confidence must be between 0.0 and 1.0.
        4. SL (Stop Loss) and TP (Take Profit) must be specific prices if Action is BUY/SELL.
        5. Provide a brief "reasoning".
        
        OUTPUT FORMAT (JSON):
        {{
            "action": "BUY" | "SELL" | "HOLD",
            "confidence": 0.85,
            "entry_price": 64500.50,
            "stop_loss": 64200.00,
            "take_profit": 65500.00,
            "reasoning": "Strong bullish momentum on 1m chart with increasing volume."
        }}
        """

    async def get_signal(self, symbol: str, current_price: float, candles: list) -> Dict[str, Any]:
        """Fetch a trading signal from Gemini based on price action."""
        try:
            prompt = self.system_prompt.format(
                symbol=symbol,
                price=current_price,
                candles=json.dumps(candles[-10:])  # Last 10 candles for context
            )
            
            # Using synchronous call in a thread for now or if genai supports async use that
            # genai library doesn't have a native async client for all features yet, 
            # but we'll assume it's fast enough or use an executor.
            response = self.model.generate_content(prompt)
            
            # Extract JSON from response text (Gemini sometimes adds markdown blocks)
            text = response.text.strip()
            if "```json" in text:
                text = text.split("```json")[-1].split("```")[0].strip()
            elif "```" in text:
                text = text.split("```")[-1].split("```")[0].strip()
                
            signal = json.loads(text)
            logger.info(f"🤖 AI Signal for {symbol}: {signal.get('action')} ({signal.get('confidence')})")
            return signal
            
        except Exception as e:
            logger.error(f"❌ Gemini Engine Error: {e}")
            return {
                "action": "HOLD",
                "confidence": 0.0,
                "reasoning": f"Signal generation failed: {str(e)}"
            }
