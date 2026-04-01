import json
from ai_layer.nvidia_client import nvidia_client
from data_layer.octagon import octagon_client
from data_layer.upstox import upstox_client

class StrategistAgent:
    """
    The Strategist Agent decides what to trade and when.
    It uses market regime detection and AI-driven analysis.
    """
    def __init__(self):
        self.name = "Strategist"

    async def analyze_market(self, symbol: str, market: str = "US"):
        # 1. Fetch market data
        if market == "US":
            data = await octagon_client.get_quote(symbol)
        else:
            data = await upstox_client.get_market_quote(symbol)

        # 2. Regime Detection logic (Simulated)
        regime = "TRENDING" if data.get("change", 0) > 0.5 else "RANGING"
        
        # 3. Prepare AI prompt with Regime context
        prompt = [
            {"role": "system", "content": f"You are the Strategist Agent for MAHESHWARA. Market Regime: {regime}."},
            {"role": "user", "content": f"Analyze the following market data for {symbol}: {json.dumps(data)}. Provide trade signals for this {regime} market."}
        ]

        # 4. Get AI decision
        decision = await nvidia_client.generate_response(prompt)
        
        return {
            "symbol": symbol,
            "regime": regime,
            "decision": decision,
            "agent": self.name
        }


strategist = StrategistAgent()
