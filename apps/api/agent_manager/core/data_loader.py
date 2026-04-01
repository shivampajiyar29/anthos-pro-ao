import asyncio
import json
import logging
import redis.asyncio as redis
from typing import Dict, Any, List
from datetime import datetime

logger = logging.getLogger("MarketDataManager")

class MarketDataManager:
    def __init__(self, redis_url: str = "redis://127.0.0.1:6379"):
        self.redis_url = redis_url
        self.symbols = ["BTCUSDT", "ETHUSDT", "RELIANCE.NS", "AAPL", "NVDA"]
    
    async def fetch_snapshot(self) -> Dict[str, Any]:
        """
        Fetches a consolidated snapshot of market data from Redis.
        """
        try:
            r = redis.from_url(self.redis_url, decode_responses=True)
            
            snapshot = {
                "timestamp": datetime.now().isoformat(),
                "market_regime": "REAL_TIME_FEED",
                "global_news": [
                    "Live data stream active via Binance and yfinance",
                    "Monitoring Indian and US stock markets"
                ],
                "tickers": {}
            }
            
            # In a real scenario, we might store the latest tick in a Redis HASH
            # For this implementation, we'll try to get the latest values
            # (Note: LiveDataProvider is already publishing to 'market_ticks' channel)
            # To fetch a snapshot, we either need a persistent store or we listen for a bit.
            # Let's assume we store the latest tick per symbol in Redis Keys: "tick:{symbol}"
            
            for sym in self.symbols:
                tick_data = await r.get(f"tick:{sym}")
                if tick_data:
                    tick = json.loads(tick_data)
                    snapshot["tickers"][sym] = {
                        "price": tick["price"],
                        "change_pct": tick["change_pct"],
                        "source": tick["source"],
                        "timestamp": tick["timestamp"]
                    }
                else:
                    # Fallback/Placeholder
                    snapshot["tickers"][sym] = {
                        "price": 0.0,
                        "change_pct": 0.0,
                        "status": "AWAITING_DATA"
                    }
            
            await r.close()
            return snapshot
            
        except Exception as e:
            logger.error(f"Error fetching snapshot from Redis: {e}")
            return {"error": str(e), "tickers": {}}
