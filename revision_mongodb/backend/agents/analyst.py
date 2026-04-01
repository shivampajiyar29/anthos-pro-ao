from ai_layer.openrouter_client import open_router_client
import json

class AnalystAgent:
    """
    Generates high-level market summaries and AI-powered trade explanations.
    Uses Grok-4.20 for a Buffett-meets-Dalio narrative style.
    """
    def __init__(self):
        self.name = "Analyst"

    async def generate_daily_report(self, market_data: dict, trade_history: list):
        prompt = [
            {"role": "system", "content": "You are the Lead Analyst for MAHESHWARA. You write in a style that is a mix of Warren Buffett's wisdom and Ray Dalio's macro principles. Summarize the market and our performance."},
            {"role": "user", "content": f"Market Data: {json.dumps(market_data)}\nTrade History: {json.dumps(trade_history)}"}
        ]
        
        report = await open_router_client.generate_response(prompt)
        return {
            "title": "Maheshwara Intelligence Brief",
            "narrative": report,
            "sentiment": "CAUTIOUSLY BULLISH",
            "top_pick": "AAPL"
        }

analyst = AnalystAgent()
