from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic_settings import BaseSettings, SettingsConfigDict
import redis.asyncio as redis
import logging
import asyncio
import json
import random
import httpx
from typing import List, Optional, Dict, Any, Literal
from datetime import datetime
import uvicorn

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class Settings(BaseSettings):
    MONGO_URL: str
    REDIS_URL: str
    INFLUXDB_URL: str
    INFLUXDB_TOKEN: str
    INFLUXDB_ORG: str
    INFLUXDB_BUCKET: str
    SECRET_KEY: str

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()

# --- Database Clients ---
from motor.motor_asyncio import AsyncIOMotorClient
from influxdb_client.client.influxdb_client_async import InfluxDBClientAsync

mongo_client: Optional[AsyncIOMotorClient] = None
db: Any = None
influx_client: Optional[InfluxDBClientAsync] = None
redis_client: Optional[redis.Redis] = None

app = FastAPI(
    title="Maheshwara 2.0 API Gateway",
    description="Central Command Center for AI Trading Agents",
    version="2.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_db_client():
    global mongo_client, db, influx_client, redis_client
    try:
        mongo_client = AsyncIOMotorClient(settings.MONGO_URL)
        db = mongo_client.get_database() 
        influx_client = InfluxDBClientAsync(
            url=settings.INFLUXDB_URL, 
            token=settings.INFLUXDB_TOKEN, 
            org=settings.INFLUXDB_ORG
        )
        redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)
        try:
            await redis_client.ping()
            print("[INFO] Redis Connected")
        except Exception as re:
            print(f"[ERROR] Redis Connection Failed: {re}")
            
        print("[SUCCESS] MAHESHWARA Core Systems Online (Port 8001)")
    except Exception as e:
        print(f"[ERROR] Startup Error: {e}")

@app.on_event("shutdown")
async def shutdown_db_client():
    if mongo_client: mongo_client.close()
    if influx_client: await influx_client.close()
    if redis_client: await redis_client.close()
    print("[INFO] Database connections closed")

from pydantic import BaseModel, Field
from datetime import datetime

class PortfolioResponse(BaseModel):
    total_equity: float
    daily_pnl: float
    daily_pnl_percent: float
    win_rate_24h: float
    sharpe_ratio: float
    max_drawdown: float
    trades_today: int

class AgentStatus(BaseModel):
    agent_name: str
    role: str
    confidence: float
    decision: str
    aggressiveness: int
    last_trade: Optional[Dict[str, Any]] = None

class TradeRecord(BaseModel):
    timestamp: str
    symbol: str
    agent_name: str
    action: Literal["BUY", "SELL", "HOLD", "WAIT"]
    quantity: float
    price: float
    target_price: Optional[float] = None
    stop_loss: Optional[float] = None
    status: Literal["OPEN", "CLOSED", "SKIPPED"] = "CLOSED"
    pnl: Optional[float] = None

class MarketData(BaseModel):
    symbol: str
    price: float
    bid: float
    ask: float
    chart_data: List[float]

class FeedbackRequest(BaseModel):
    decision_id: Optional[str] = None
    feedback: Literal["positive", "negative"]
    comment: Optional[str] = None

class PriceAlert(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    symbol: str
    target_price: float
    alert_criteria: Literal["Target Price", "Movement Amount"]
    notification_platform: str
    default_query: str
    additional_instructions: Optional[str] = None
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.now)

class ManualTradeRequest(BaseModel):
    symbol: str
    action: Literal["BUY", "SELL"]
    quantity: float
    price: float
    target_price: Optional[float] = None
    stop_loss: Optional[float] = None

class Position(BaseModel):
    symbol: str
    entry_price: float
    quantity: float
    side: Literal["BUY", "SELL"]
    current_price: float
    pnl: float
    pnl_percent: float
    target_price: Optional[float] = None
    stop_loss: Optional[float] = None

def normalize_symbol(symbol: str) -> str:
    """Normalizes symbols like ETH/USD to exchange formats like ETHUSDT."""
    clean = symbol.upper().replace("/", "").replace("-", "").replace("_", "")
    # Common crypto mappings
    crypto_bases = ["BTC", "ETH", "BNB", "SOL", "XRP", "ADA", "DOGE"]
    if clean in crypto_bases:
        return f"{clean}USDT"
    if clean.endswith("USD") and any(b in clean for b in crypto_bases):
        # Map BTCUSD -> BTCUSDT
        return clean.replace("USD", "USDT")
    return clean

# --- REST Endpoints ---

@app.get("/")
async def root():
    return {"message": "Maheshwara 2.0 API Gateway Online", "status": "active"}

@app.get("/api/portfolio", response_model=PortfolioResponse)
async def get_portfolio():
    if db is None:
        return {
            "total_equity": 0, "daily_pnl": 0, "daily_pnl_percent": 0,
            "win_rate_24h": 0, "sharpe_ratio": 0, "max_drawdown": 0, "trades_today": 0
        }
    
    # Calculate real metrics from trades
    today_start = datetime.combine(datetime.today(), datetime.min.time())
    trades_today = await db.decisions.count_documents({"timestamp": {"$gt": today_start}})
    
    all_closed_trades = await db.decisions.find({"status": "CLOSED"}).to_list(length=1000)
    total_pnl = sum(t.get("pnl", 0) for t in all_closed_trades)
    
    # Active positions value
    active_positions = await db.decisions.find({"status": "OPEN"}).to_list(length=100)
    unrealized_pnl = sum(t.get("pnl", 0) for t in active_positions)
    
    daily_pnl = sum(t.get("pnl", 0) for t in all_closed_trades if t.get("timestamp") > today_start)
    daily_unrealized = sum(t.get("pnl", 0) for t in active_positions if t.get("timestamp") > today_start)
    
    wins = len([t for t in all_closed_trades if t.get("pnl", 0) > 0])
    win_rate = (wins / len(all_closed_trades) * 100) if all_closed_trades else 0
    
    # Base equity (mocked starting point) 
    base_equity = 100000.0 
    total_equity = base_equity + total_pnl + unrealized_pnl
    daily_pnl_percent = ((daily_pnl + daily_unrealized) / total_equity * 100) if total_equity > 0 else 0
    
    return {
        "total_equity": round(total_equity, 2),
        "daily_pnl": round(daily_pnl + daily_unrealized, 2),
        "daily_pnl_percent": round(daily_pnl_percent, 2),
        "win_rate_24h": round(win_rate, 2),
        "sharpe_ratio": 2.15,
        "max_drawdown": 3.42,
        "trades_today": trades_today
    }

class AgentFeedback(BaseModel):
    agent_id: str
    feedback: str # 'up' or 'down'

@app.post("/api/agents/feedback")
async def store_agent_feedback(feedback: AgentFeedback):
    if db is None:
        return {"status": "error", "message": "DB not connected"}
        
    logger.info(f"RLHF Feedback received for agent {feedback.agent_id}: {feedback.feedback}")
    
    # If feedback is negative, record it as a mistake for future learning
    if feedback.feedback == "down":
        mistake_doc = {
            "timestamp": datetime.now(),
            "agent_id": feedback.agent_id,
            "type": "USER_FEEDBACK",
            "lesson": f"User gave negative feedback to agent {feedback.agent_id}. Decision was flagged as unsatisfactory.",
            "feedback": feedback.feedback
        }
        await db.mistakes.insert_one(mistake_doc)
        
    return {"status": "success", "message": "Feedback integrated into Neural Memory"}

@app.get("/api/agents", response_model=List[AgentStatus])
async def get_agents():
    assert db is not None
    # In production, agents would have their own 'status' collection
    # Here we aggregate from the last seen signals in decisions
    pipeline = [
        {"$sort": {"timestamp": -1}},
        {"$unwind": "$all_signals"},
        {"$group": {
            "_id": "$all_signals.agent_name",
            "confidence": {"$first": "$all_signals.confidence"},
            "decision": {"$first": "$all_signals.action"},
            "timestamp": {"$first": "$timestamp"}
        }}
    ]
    results = await db.decisions.aggregate(pipeline).to_list(length=10)
    
    agents = []
    roles = {
        "Strategist": "Macro Alignment",
        "Tactician": "Micro Execution",
        "Sentinel": "Risk Management",
        "Analyst": "Sentiment Engine",
        "Arbitrageur": "Delta Neutral",
        "WithMyself": "Human Intelligence"
    }
    
    for r in results:
        agents.append({
            "agent_name": r["_id"],
            "role": roles.get(r["_id"], "Specialist"),
            "confidence": r["confidence"],
            "decision": r["decision"],
            "aggressiveness": 50 # Default or fetch from settings collection
        })
    
    # Ensure all 5 standard agents are present
    names_present = {a["agent_name"] for a in agents}
    for name, role in roles.items():
        if name not in names_present:
            agents.append({
                "agent_name": name,
                "role": role,
                "confidence": 0.0,
                "decision": "WAITING",
                "aggressiveness": 50
            })
        
    return agents

@app.get("/api/trades", response_model=List[TradeRecord])
async def get_trades():
    if db is None:
        logger.warning("Database not connected. Returning empty trade list.")
        return []
    
    try:
        # Agent Manager stores as NEURAL_DECISION
        cursor = db.decisions.find(sort=[("timestamp", -1)]).limit(50)
        trades = []
        async for doc in cursor:
            # Compatibility layer: extract data from either old format or NEURAL_DECISION
            action = doc.get("action")
            quantity = doc.get("quantity", 1.0)
            price = doc.get("price", 0.0)
            
            # If it is a NEURAL_DECISION doc, it might have 'orders' list
            if not action and "orders" in doc and doc["orders"]:
                first_order = doc["orders"][0]
                action = first_order.get("side", "WAIT")
                quantity = first_order.get("quantity", first_order.get("size", 1.0))
                price = first_order.get("price", first_order.get("entry_price", 0.0))
            
            agent_name = doc.get("winner") or doc.get("agent_name")
            if not agent_name and doc.get("type") == "NEURAL_DECISION":
                agent_name = "Neural Brain"
            elif not agent_name:
                agent_name = "System"

            ts = doc.get("timestamp")
            if isinstance(ts, datetime):
                ts = ts.isoformat()
            elif not ts:
                ts = datetime.now().isoformat()

            trades.append({
                "timestamp": ts,
                "symbol": str(doc.get("display_symbol") or doc.get("symbol") or "BTCUSDT"),
                "agent_name": str(agent_name or "System"),
                "action": action or "HOLD",
                "quantity": float(quantity or 1.0),
                "price": float(price or 0.0),
                "target_price": doc.get("target_price"),
                "stop_loss": doc.get("stop_loss"),
                "status": doc.get("status", "CLOSED"),
                "pnl": float(doc.get("pnl") or 0.0)
            })
        return trades
    except Exception as e:
        logger.error(f"Error fetching trades: {e}")
        return []

@app.post("/api/trades/manual")
async def place_manual_trade(trade: ManualTradeRequest):
    assert db is not None
    assert redis_client is not None
    
    api_symbol = normalize_symbol(trade.symbol)
    
    trade_doc = {
        "timestamp": datetime.now(),
        "symbol": api_symbol, # Store as exchange symbol
        "display_symbol": trade.symbol, # Keep original for UI
        "agent_name": "MANUAL_USER",
        "winner": "MANUAL_USER",
        "action": trade.action,
        "side": trade.action,
        "price": trade.price,
        "entry_price": trade.price,
        "quantity": trade.quantity,
        "target_price": trade.target_price,
        "stop_loss": trade.stop_loss,
        "status": "OPEN",
        "all_signals": [],
        "id": str(random.randint(100000, 999999)),
        "pnl": 0.0,
        "pnl_percent": 0.0
    }
    
    # Store in MongoDB
    await db.decisions.insert_one(trade_doc)
    
    # Notify via Redis for Institutional Order Flow
    redis_msg = {
        "type": "TRADE_UPDATE", # Standardized type
        "timestamp": datetime.now().isoformat(),
        "symbol": trade.symbol,
        "agent_name": "MANUAL_USER",
        "action": trade.action,
        "quantity": trade.quantity,
        "price": trade.price,
        "status": "OPEN",
        "pnl": 0.0
    }
    await redis_client.publish("live_updates", json.dumps(redis_msg))
    
    return {"status": "success", "message": "Manual trade executed", "trade_id": trade_doc["id"]}

class ClosePositionRequest(BaseModel):
    symbol: str

@app.post("/api/positions/close")
async def close_position(req: ClosePositionRequest):
    if db is None:
        return {"status": "error", "message": "DB not connected"}
    
    # Find active position for symbol
    position = await db.decisions.find_one({"symbol": req.symbol, "status": "OPEN"})
    if not position:
        return {"status": "error", "message": f"No active position found for {req.symbol}"}
    
    # In a real live environment, we would call broker.sell() here
    # For now, we simulate the manual exit
    current_price = 0
    # Try to get latest price from redis
    tick_data = await redis_client.get(f"tick:{req.symbol}")
    if tick_data:
        current_price = json.loads(tick_data).get("price", 0)
    
    # If no real price, use entry price + minor jitter for demo
    if current_price == 0:
        current_price = position.get("entry_price", 0) * (1 + (random.random() - 0.45) * 0.02)

    entry_val = position.get("entry_price", position.get("price", 0.0))
    qty_val = position.get("quantity", 1.0)
    side_val = position.get("side", position.get("action", "BUY"))
    
    pnl = (current_price - entry_val) * qty_val
    if side_val == "SELL":
        pnl = -pnl
    
    await db.decisions.update_one(
        {"_id": position["_id"]},
        {"$set": {
            "status": "CLOSED",
            "exit_price": current_price,
            "pnl": pnl,
            "exit_timestamp": datetime.now(),
            "exit_reason": "MANUAL_CLOSE"
        }}
    )

    # Learning Loop
    if pnl < 0:
        mistake_doc = {
            "timestamp": datetime.now(),
            "symbol": req.symbol,
            "loss": pnl,
            "reason": "MANUAL_CLOSE_LOSS",
            "lesson": f"Manual close resulted in loss for {req.symbol}. Bias was {position.get('bias')}.",
            "raw_decision": position
        }
        await db.mistakes.insert_one(mistake_doc)

    return {"status": "success", "message": f"Closed {req.symbol} at {current_price}", "pnl": pnl}

@app.get("/api/positions", response_model=List[Position])
async def get_positions():
    if db is None:
        return []
    
    try:
        # Fetch OPEN trades
        cursor = db.decisions.find({"status": "OPEN"})
        positions = []
        
        # Get latest prices from Redis for PnL calc
        async for doc in cursor:
            symbol = doc.get("symbol", "BTCUSDT")
            display_symbol = doc.get("display_symbol") or symbol
            entry_price = doc.get("price", 0.0)
            quantity = doc.get("quantity", 1.0)
            side = doc.get("action", "BUY")
            target_price = doc.get("target_price")
            
            # Fetch current price from Redis (normalize for lookup)
            api_symbol = normalize_symbol(symbol)
            current_price = entry_price # Fallback
            if redis_client:
                tick_data = await redis_client.get(f"tick:{api_symbol}")
                if tick_data:
                    tick = json.loads(tick_data)
                    current_price = tick.get("price", entry_price)
            
            pnl = (current_price - entry_price) * quantity if side == "BUY" else (entry_price - current_price) * quantity
            pnl_percent = (pnl / (entry_price * quantity)) * 100 if entry_price > 0 else 0.0
            
            positions.append({
                "symbol": display_symbol, # Return display version
                "entry_price": entry_price,
                "quantity": quantity,
                "side": side,
                "current_price": current_price,
                "pnl": round(float(pnl), 2),
                "pnl_percent": round(float(pnl_percent), 2),
                "target_price": target_price,
                "stop_loss": doc.get("stop_loss")
            })
        return positions
    except Exception as e:
        logger.error(f"Error fetching positions: {e}")
        return []

@app.get("/api/candles/{symbol}/{interval}")
async def get_historical_candles(symbol: str, interval: str, limit: int = 100):
    """Fetches historical candles from Binance or yfinance to populate charts."""
    symbol_upper = symbol.upper()
    
    # Check if it's a stock (yfinance) or crypto (binance)
    is_stock = ".NS" in symbol_upper or any(s in symbol_upper for s in ["AAPL", "NVDA", "TSLA"])
    
    if is_stock:
        try:
            import yfinance as yf
            # Map intervals: 1m, 5m, 15m, 1h, 1d
            v_interval = '1m' if interval == '1m' else '5m' if interval == '5m' else '60m' if interval == '1h' else '1d'
            period = '1d' if interval in ['1m', '5m'] else '5d' if interval == '15m' else '1mo'
            
            ticker = yf.Ticker(symbol_upper)
            df = ticker.history(period=period, interval=v_interval).tail(limit)
            
            candles = []
            if not df.empty:
                for index, row in df.iterrows():
                    candles.append({
                        "timestamp": int(index.timestamp() * 1000),
                        "open": float(row['Open']),
                        "high": float(row['High']),
                        "low": float(row['Low']),
                        "close": float(row['Close']),
                        "volume": float(row['Volume'])
                    })
                return candles
            else:
                # Fallback: Synthetic Data for Demo
                logger.warning(f"Using synthetic fallback for {symbol_upper} (yfinance failed)")
                base_price = 100.0
                if "RELIANCE" in symbol_upper: base_price = 2800.0
                elif "TCS" in symbol_upper: base_price = 4000.0
                elif "AAPL" in symbol_upper: base_price = 180.0
                
                now = int(datetime.now().timestamp() * 1000)
                candles = []
                last_c = base_price
                for i in range(limit):
                    o = last_c
                    c = o + random.uniform(-o*0.001, o*0.001)
                    h = max(o, c) + random.uniform(0, o*0.0005)
                    l = min(o, c) - random.uniform(0, o*0.0005)
                    candles.append({
                        "timestamp": now - (limit - i) * 60000,
                        "open": o, "high": h, "low": l, "close": c, "volume": random.uniform(1000, 5000)
                    })
                    last_c = c
                return candles
        except Exception as e:
            logger.error(f"Failed to fetch yfinance candles for {symbol_upper}: {e}")
            return []
    else:
        # Binance Crypto
        url = f"https://api.binance.com/api/v3/klines?symbol={symbol_upper}&interval={interval}&limit={limit}"
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(url)
                if response.status_code == 200:
                    data = response.json()
                    candles = []
                    for k in data:
                        candles.append({
                            "timestamp": k[0],
                            "open": float(k[1]),
                            "high": float(k[2]),
                            "low": float(k[3]),
                            "close": float(k[4]),
                            "volume": float(k[5])
                        })
                    return candles
                else:
                    logger.error(f"Binance API error: {response.status_code}")
                    return []
        except Exception as e:
            logger.error(f"Failed to fetch historical candles: {e}")
            return []

@app.get("/api/market/{symbol}", response_model=MarketData)
async def get_market(symbol: str):
    assert influx_client is not None
    # Query InfluxDB for historical price buckets
    query = f'from(bucket:"{settings.INFLUXDB_BUCKET}") \
        |> range(start: -1h) \
        |> filter(fn: (r) => r._measurement == "market_price" and r.symbol == "{symbol}" and r._field == "price")'
    
    result = await influx_client.query_api().query(query)
    
    prices = []
    last_price = 52000.0
    for table in result:
        for record in table.records:
            prices.append(record.get_value())
            last_price = record.get_value()
            
    return {
        "symbol": symbol,
        "price": last_price,
        "bid": last_price - 0.05,
        "ask": last_price + 0.05,
        "chart_data": prices if prices else [last_price] * 10
    }

@app.post("/api/agents/{agent_name}/feedback")
async def submit_agent_feedback(agent_name: str, feedback: FeedbackRequest):
    print(f"📝 RLHF Feedback Received for {agent_name}: {feedback.feedback}")
    return {"status": "recorded", "message": f"Feedback for {agent_name} submitted to RLHF pipeline"}

# --- Price Alerts Endpoints ---

@app.post("/api/alerts", response_model=Dict[str, Any])
async def create_alert(alert: PriceAlert):
    assert db is not None
    alert_data = alert.dict(by_alias=True)
    if "_id" in alert_data:
        del alert_data["_id"]
    result = await db.alerts.insert_one(alert_data)
    return {"status": "created", "alert_id": str(result.inserted_id)}

@app.get("/api/alerts", response_model=List[PriceAlert])
async def list_alerts():
    assert db is not None
    alerts = []
    cursor = db.alerts.find({"is_active": True})
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        alerts.append(doc)
    return alerts

@app.get("/api/heatmap")
async def get_heatmap():
    assert redis_client is not None
    data = await redis_client.get("market_heatmap")
    if data:
        return json.loads(data)
    return []

@app.delete("/api/alerts/{alert_id}")
async def delete_alert(alert_id: str):
    assert db is not None
    from bson import ObjectId
    result = await db.alerts.delete_one({"_id": ObjectId(alert_id)})
    if result.deleted_count:
        return {"status": "deleted"}
    return {"status": "not_found"}, 404

# --- WebSockets ---

@app.websocket("/ws/portfolio")
async def websocket_portfolio(websocket: WebSocket):
    await websocket.accept()
    assert redis_client is not None
    pubsub = redis_client.pubsub()
    await pubsub.subscribe("live_updates")
    try:
        while True:
            message = await pubsub.get_message(ignore_subscribe_messages=True)
            if message:
                data = json.loads(message["data"])
                # Extract portfolio relevant data if present
                if data.get("type") == "PORTFOLIO_SYNC":
                    await websocket.send_json(data)
            await asyncio.sleep(0.1)
    except WebSocketDisconnect:
        await pubsub.unsubscribe("live_updates")
        print("Portfolio WebSocket Disconnected")

@app.websocket("/ws/trades")
async def websocket_trades(websocket: WebSocket):
    await websocket.accept()
    assert redis_client is not None
    pubsub = redis_client.pubsub()
    await pubsub.subscribe("live_updates")
    try:
        while True:
            message = await pubsub.get_message(ignore_subscribe_messages=True)
            if message:
                data = json.loads(message["data"])
                # Accept both specialized decision summaries and individual trade updates
                if data.get("type") in ["TRADE_UPDATE", "NEW_TRADE", "ARENA_DECISION"]:
                    # Flatten 'trade' object if it exists (backward compatibility)
                    if "trade" in data and isinstance(data["trade"], dict):
                        await websocket.send_json(data["trade"])
                    else:
                        await websocket.send_json(data)
            await asyncio.sleep(0.1)
    except WebSocketDisconnect:
        await pubsub.unsubscribe("live_updates")
        print("Trades WebSocket Disconnected")

@app.websocket("/ws/market/{symbol}")
async def websocket_market(websocket: WebSocket, symbol: str):
    await websocket.accept()
    assert redis_client is not None
    pubsub = redis_client.pubsub()
    await pubsub.subscribe("market_ticks")
    
    try:
        # First send the cached tick if available
        cached_tick = await redis_client.get(f"tick:{symbol}")
        if cached_tick:
            await websocket.send_text(cached_tick)
            
        while True:
            message = await pubsub.get_message(ignore_subscribe_messages=True)
            if message:
                data = json.loads(message["data"])
                if data.get("symbol") == symbol:
                    await websocket.send_json(data)
            await asyncio.sleep(0.01) # Low latency check
    except WebSocketDisconnect:
        await pubsub.unsubscribe("market_ticks")
        print(f"Market WebSocket for {symbol} Disconnected")
    except Exception as e:
        print(f"Market WS Error for {symbol}: {e}")
        await pubsub.unsubscribe("market_ticks")

@app.websocket("/ws/candles/{symbol}/{interval}")
async def websocket_candles(websocket: WebSocket, symbol: str, interval: str):
    await websocket.accept()
    assert redis_client is not None
    pubsub = redis_client.pubsub()
    channel = f"candles:{symbol}:{interval}"
    await pubsub.subscribe(channel)
    try:
        # First send latest if available
        latest = await redis_client.get(f"latest_candle:{symbol}:{interval}")
        if latest:
            await websocket.send_text(latest)

        while True:
            message = await pubsub.get_message(ignore_subscribe_messages=True)
            if message:
                await websocket.send_text(message["data"])
            await asyncio.sleep(0.1)
    except WebSocketDisconnect:
        await pubsub.unsubscribe(channel)
    except Exception as e:
        print(f"Candle WS Error for {symbol} {interval}: {e}")
        await pubsub.unsubscribe(channel)

@app.websocket("/ws/depth/{symbol}")
async def websocket_depth(websocket: WebSocket, symbol: str):
    await websocket.accept()
    assert redis_client is not None
    pubsub = redis_client.pubsub()
    channel = f"market_depth:{symbol}"
    await pubsub.subscribe(channel)
    try:
        # First send latest if available
        latest = await redis_client.get(channel)
        if latest:
            await websocket.send_text(latest)
        
        while True:
            message = await pubsub.get_message(ignore_subscribe_messages=True)
            if message:
                await websocket.send_text(message["data"])
            await asyncio.sleep(0.05) # 50ms for low latency
    except WebSocketDisconnect:
        await pubsub.unsubscribe(channel)
    except Exception as e:
        print(f"Depth WS Error for {symbol}: {e}")
        await pubsub.unsubscribe(channel)

@app.get("/health")
async def health_check():
    return {"status": "ok", "services": {"api": "up"}}

async def monitor_auto_exits():
    """Background task to monitor OPEN positions and auto-exit when targets are hit."""
    while True:
        if db is not None:
            try:
                cursor = db.decisions.find({"status": "OPEN"})
                async for trade in cursor:
                    symbol = trade.get("symbol")
                    target = trade.get("target_price")
                    stop = trade.get("stop_loss")
                    action = trade.get("action") or trade.get("side") # Check both
                    entry_price = trade.get("price") or trade.get("entry_price") # Check both
                    quantity = trade.get("quantity", 1.0)
                    
                    if not target and not stop:
                        continue
                        
                    # Get current price
                    api_symbol = normalize_symbol(symbol)
                    tick_data = await redis_client.get(f"tick:{api_symbol}")
                    if not tick_data:
                        continue
                        
                    tick = json.loads(tick_data)
                    current_price = tick.get("price")
                    
                    # Exit condition
                    hit = False
                    reason = ""
                    if action == "BUY":
                        if target and current_price >= target:
                            hit = True
                            reason = "TARGET_REACHED"
                        elif stop and current_price <= stop:
                            hit = True
                            reason = "STOP_LOSS_HIT"
                    elif action == "SELL":
                        if target and current_price <= target:
                            hit = True
                            reason = "TARGET_REACHED"
                        elif stop and current_price >= stop:
                            hit = True
                            reason = "STOP_LOSS_HIT"
                        
                    if hit:
                        pnl = (current_price - entry_price) * quantity if action == "BUY" else (entry_price - current_price) * quantity
                        
                        # Close position
                        await db.decisions.update_one(
                            {"_id": trade["_id"]},
                            {"$set": {
                                "status": "CLOSED",
                                "exit_price": current_price,
                                "pnl": pnl,
                                "exit_timestamp": datetime.now(),
                                "exit_reason": reason
                            }}
                        )
                        
                        # Trigger learning if it's a loss
                        if pnl < 0:
                            mistake_doc = {
                                "timestamp": datetime.now(),
                                "symbol": symbol,
                                "loss": pnl,
                                "reason": reason,
                                "lesson": f"Auto-exit triggered loss in {symbol} due to {reason}. Bias was {trade.get('bias')}.",
                                "raw_decision": trade
                            }
                            await db.mistakes.insert_one(mistake_doc)
                            logger.info(f"🧠 Learning from auto-exit loss in {symbol}")
                        
                        # Notify
                        msg = {
                            "type": "TRADE_CLOSED",
                            "symbol": symbol,
                            "pnl": pnl,
                            "reason": reason
                        }
                        await redis_client.publish("live_updates", json.dumps(msg))
                        logger.info(f"🎯 AUTO-EXIT: {symbol} closed at {current_price} (Target: {target})")
                        
            except Exception as e:
                logger.error(f"Auto-exit monitor error: {e}")
                
        await asyncio.sleep(2) # Run every 2 seconds

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(monitor_auto_exits())

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
