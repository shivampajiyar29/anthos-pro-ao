import aiohttp
import asyncio
import logging
from datetime import datetime

logger = logging.getLogger("services.binance")

class BinanceDataProvider:
    def __init__(self):
        self.base_url = "https://api.binance.com/api/v3"
        self.prices = {}
        self._running = False

    async def get_price(self, symbol: str) -> float:
        """Fetch current price for a symbol (e.g., BTCUSDT)."""
        try:
            async with aiohttp.ClientSession() as session:
                url = f"{self.base_url}/ticker/price?symbol={symbol.upper()}"
                async with session.get(url) as response:
                    data = await response.json()
                    return float(data.get("price", 0.0))
        except Exception as e:
            logger.error(f"Error fetching Binance price for {symbol}: {e}")
            return 0.0

    async def get_24h_stats(self, symbol: str) -> dict:
        """Fetch 24h ticker stats."""
        try:
            async with aiohttp.ClientSession() as session:
                url = f"{self.base_url}/ticker/24hr?symbol={symbol.upper()}"
                async with session.get(url) as response:
                    data = await response.json()
                    if "lastPrice" not in data:
                        return {}
                    return {
                        "price": float(data["lastPrice"]),
                        "change_pct": float(data["priceChangePercent"]),
                        "volume": float(data["volume"]),
                        "high": float(data["highPrice"]),
                        "low": float(data["lowPrice"]),
                    }
        except Exception as e:
            logger.error(f"Error fetching Binance stats for {symbol}: {e}")
            return {}

    async def get_klines(self, symbol: str, interval: str, limit: int = 100) -> list:
        """Fetch historical klines (candles)."""
        try:
            async with aiohttp.ClientSession() as session:
                url = f"{self.base_url}/klines?symbol={symbol.upper()}&interval={interval}&limit={limit}"
                async with session.get(url) as response:
                    data = await response.json()
                    candles = []
                    for k in data:
                        candles.append({
                            "timestamp": k[0],
                            "open": float(k[1]),
                            "high": float(k[2]),
                            "low": float(k[3]),
                            "close": float(k[4]),
                            "volume": float(k[5]),
                        })
                    return candles
        except Exception as e:
            logger.error(f"Error fetching Binance klines for {symbol}: {e}")
            return []

binance_client = BinanceDataProvider()
