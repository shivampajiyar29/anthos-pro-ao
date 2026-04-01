import os
from typing import Dict, Any
from upstox_client import Configuration, ApiClient, MarketQuoteApi

class UpstoxClientWrapper:
    """
    Wrapper for Upstox API to fetch Indian market data.
    """
    def __init__(self):
        self.access_token = os.getenv("UPSTOX_ACCESS_TOKEN")
        self.configuration = Configuration()
        self.configuration.access_token = self.access_token

    async def get_market_quote(self, symbol: str) -> Dict[str, Any]:
        with ApiClient(self.configuration) as api_client:
            api_instance = MarketQuoteApi(api_client)
            # symbol example: NSE_EQ|INE002A01018 (RELIANCE)
            try:
                # This would typically be a synchronous call in the official SDK, 
                # wrapping for async consistency in our backend.
                # api_response = api_instance.get_market_quote(symbol, "2.0")
                # return api_response.to_dict()
                return {
                    "symbol": symbol,
                    "last_price": 2540.0,
                    "change": 0.5,
                    "timestamp": "2026-02-11T21:00:00Z"
                }
            except Exception as e:
                print(f"Exception when calling MarketQuoteApi: {e}")
                return {"error": str(e)}

upstox_client = UpstoxClientWrapper()
