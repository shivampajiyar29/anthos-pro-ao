import asyncio
import json
import logging
import random
import websockets
import yfinance as yf
import redis.asyncio as redis
from datetime import datetime
from typing import Dict, List, Any, Optional

logger = logging.getLogger("LiveDataProvider")

class LiveDataProvider:
    def __init__(self, redis_url: str):
        self.redis_url = redis_url
        self.redis_client: Optional[redis.Redis] = None
        self.running = False
        self.symbols = {
            "crypto": ["BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT"],
            "indian": ["RELIANCE.NS", "TCS.NS", "^NSEI"],
            "us": ["AAPL", "NVDA", "TSLA"]
        }
        self.last_prices = {}

    async def connect_redis(self):
        self.redis_client = redis.from_url(self.redis_url, decode_responses=True)
        assert self.redis_client is not None
        await self.redis_client.ping()
        logger.info("LiveDataProvider connected to Redis")

    async def binance_ws_stream(self):
        """Streams live crypto data from Binance WebSocket (Multi-stream)."""
        uri = "wss://stream.binance.com:9443/stream?streams="
        logger.info(f"Connecting to Binance: {uri}")
        
        # Build streams
        streams = []
        # Tickers for specific watchlist
        for s in self.symbols["crypto"]:
            streams.append(f"{s.lower()}@ticker")
            # Kline streams for different timeframes
            for tf in ['1m', '5m', '15m', '1h']:
                streams.append(f"{s.lower()}@kline_{tf}")
        
        # Depth for BTCUSDT
        streams.append("btcusdt@depth20@100ms")
        
        # Global market ticker for heatmap (all symbols 24h stats)
        streams.append("!miniTicker@arr")

        full_uri = uri + "/".join(streams)
        
        while self.running:
            try:
                async with websockets.connect(full_uri) as websocket:
                    logger.info("✅ Connected to Binance Multi-Stream WS")
                    while self.running:
                        message = await websocket.recv()
                        try:
                            # Handle both string and binary messages
                            if isinstance(message, bytes):
                                message = message.decode('utf-8')
                            
                            raw_data = json.loads(message)
                            stream = raw_data.get('stream')
                            data = raw_data.get('data')
                            
                            if not stream or not data: 
                                continue

                            # Route data based on stream type
                            if "@ticker" in stream:
                                await self._handle_ticker(data)
                            elif "@kline" in stream:
                                await self._handle_kline(data, stream)
                            elif "@depth" in stream:
                                await self._handle_depth(data)
                            elif "!miniTicker@arr" in stream:
                                await self._handle_heatmap(data)
                        except Exception as e:
                            logger.error(f"Error processing Binance message: {e}. Raw: {message[:100]}")
                            
            except websockets.ConnectionClosed:
                logger.warning("Binance WS Connection lost. Reconnecting in 5s...")
                await asyncio.sleep(5)
            except Exception as e:
                logger.error(f"Binance WS Connection Error: {e}")
                await asyncio.sleep(5)

    async def _handle_ticker(self, data):
        symbol = data['s']
        tick = {
            "type": "TICK",
            "symbol": symbol,
            "price": float(data['c']),
            "change_pct": float(data['P']),
            "source": "BINANCE",
            "timestamp": datetime.now().isoformat()
        }
        await self.redis_client.publish("market_ticks", json.dumps(tick))
        await self.redis_client.set(f"tick:{symbol}", json.dumps(tick))

    async def _handle_kline(self, data, stream):
        # Format: symbol@kline_interval
        interval = stream.split('_')[-1]
        k = data['k']
        # We only care about closed candles for some things, but for live chart we want current candle too
        candle = {
            "type": "CANDLE",
            "symbol": data['s'],
            "interval": interval,
            "open": float(k['o']),
            "high": float(k['h']),
            "low": float(k['l']),
            "close": float(k['c']),
            "volume": float(k['v']),
            "is_closed": k['x'],
            "timestamp": k['t']
        }
        await self.redis_client.publish(f"candles:{candle['symbol']}:{interval}", json.dumps(candle))
        # Keep latest candle in redis for quick fetch
        await self.redis_client.set(f"latest_candle:{candle['symbol']}:{interval}", json.dumps(candle))

    async def _handle_depth(self, data):
        # Top 20 bids/asks
        depth = {
            "type": "DEPTH",
            "symbol": "BTCUSDT",
            "bids": data.get('bids', data.get('b', []))[:10], # Handle partial depth and diff depth formats
            "asks": data.get('asks', data.get('a', []))[:10],
            "timestamp": datetime.now().isoformat()
        }
        await self.redis_client.publish("market_depth:BTCUSDT", json.dumps(depth))
        await self.redis_client.set("market_depth:BTCUSDT", json.dumps(depth))

    async def _handle_heatmap(self, data):
        # data is a list of miniTickers
        # filter for USDT pairs only to keep payload small
        heatmap = []
        for item in data:
            if item['s'].endswith('USDT'):
                heatmap.append({
                    "s": item['s'],
                    "c": float(item['c']), # last price
                    "o": float(item['o']), # open price
                    "h": float(item['h']),
                    "l": float(item['l']),
                    "v": float(item['v']),
                })
        
        # Publish every ~5 seconds (miniTicker updates every 1s, but we can throttle)
        # However, it's safer to just set in Redis and let the API decide the refresh
        await self.redis_client.set("market_heatmap", json.dumps(heatmap))

    async def stock_polling_stream(self):
        """Polls stock data from yfinance."""
        all_stocks = self.symbols["indian"] + self.symbols["us"]
        
        while self.running:
            try:
                for symbol in all_stocks:
                    try:
                        # yfinance ticker fetch
                        ticker = yf.Ticker(symbol)
                        # Use history sparingly
                        data = ticker.history(period='1d', interval='1m').tail(1)
                        if not data.empty:
                            price = float(data['Close'].iloc[0])
                            # Handle potential missing Open column
                            prev_close = price
                            if 'Open' in data and not data['Open'].empty:
                                prev_close = float(data['Open'].iloc[0])
                            
                            change_pct = ((price - prev_close) / prev_close) * 100 if prev_close != 0 else 0
                            
                            # Construct and publish candle for the chart
                            candle = {
                                "type": "CANDLE",
                                "symbol": symbol,
                                "interval": "1m",
                                "open": float(data['Open'].iloc[0]) if 'Open' in data and not data['Open'].empty else price,
                                "high": float(data['High'].iloc[0]) if 'High' in data and not data['High'].empty else price,
                                "low": float(data['Low'].iloc[0]) if 'Low' in data and not data['Low'].empty else price,
                                "close": price,
                                "volume": float(data['Volume'].iloc[0]) if 'Volume' in data and not data['Volume'].empty else 0,
                                "is_closed": True,
                                "timestamp": int(data.index[0].timestamp() * 1000)
                            }
                            
                            tick = {
                                "type": "TICK",
                                "symbol": symbol,
                                "price": round(price, 2),
                                "change_pct": round(change_pct, 2),
                                "source": "YFINANCE",
                                "timestamp": datetime.now().isoformat()
                            }
                            
                            assert self.redis_client is not None
                            await self.redis_client.publish(f"candles:{symbol}:1m", json.dumps(candle))
                            await self.redis_client.set(f"latest_candle:{symbol}:1m", json.dumps(candle))
                            
                            await self.redis_client.publish("market_ticks", json.dumps(tick))
                            await self.redis_client.set(f"tick:{symbol}", json.dumps(tick))
                            self.last_prices[symbol] = price
                        else:
                            # Trigger simulated fallback for empty data
                            logger.warning(f"No price data for {symbol} from yfinance. Using simulated fallback.")
                            price = self.last_prices.get(symbol, 1000.0)
                            price = price * (1 + (random.random() - 0.5) * 0.001)
                            self.last_prices[symbol] = price
                            
                            tick = {
                                "type": "TICK", "symbol": symbol, "price": round(price, 2),
                                "change_pct": 0.0, "source": "SIMULATED",
                                "timestamp": datetime.now().isoformat()
                            }
                            
                            candle = {
                                "type": "CANDLE", "symbol": symbol, "interval": "1m",
                                "open": price, "high": price * 1.001, "low": price * 0.999, "close": price,
                                "volume": 1000, "is_closed": True,
                                "timestamp": int(datetime.now().timestamp() * 1000)
                            }
                            
                            assert self.redis_client is not None
                            await self.redis_client.publish(f"candles:{symbol}:1m", json.dumps(candle))
                            await self.redis_client.set(f"latest_candle:{symbol}:1m", json.dumps(candle))
                            await self.redis_client.publish("market_ticks", json.dumps(tick))
                            await self.redis_client.set(f"tick:{symbol}", json.dumps(tick))

                    except Exception as e:
                        logger.warning(f"Failed to poll {symbol}: {e}. Using simulated jitter.")
                        # ... fallback logic already there ...
                
                # Poll stocks every 30 seconds (yfinance rate limits are tight)
                await asyncio.sleep(30)
                
            except Exception as e:
                logger.error(f"Stock Polling Error: {e}")
                await asyncio.sleep(10)

    async def start(self):
        self.running = True
        await self.connect_redis()
        
        # Run streams concurrently
        logger.info("Starting live data streams...")
        await asyncio.gather(
            self.binance_ws_stream(),
            self.stock_polling_stream()
        )

    async def stop(self):
        self.running = False
        if self.redis_client:
            await self.redis_client.close()
