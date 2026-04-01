from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, status
import json
import asyncio
import logging
from typing import List, Dict, Any, Optional
from packages.core.database import Redis, get_db
from packages.core.auth import get_ws_user
from sqlalchemy.orm import Session

logger = logging.getLogger("api.realtime")
router = APIRouter()

# --- Connection Manager ---
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: Any):
        """Send a message to all connected clients."""
        if isinstance(message, dict):
            message = json.dumps(message)
        
        dead_connections = []
        for connection in self.active_connections:
            try:
                await connection.send_text(str(message))
            except Exception:
                dead_connections.append(connection)
        
        for dead in dead_connections:
            self.disconnect(dead)

manager = ConnectionManager()

async def _redis_fallback_loop(websocket: WebSocket, heartbeat_type: str = "heartbeat"):
    """Fallback loop when Redis is unavailable: sends periodic keep-alive."""
    try:
        while True:
            await websocket.send_json({"type": heartbeat_type, "status": "redis_unavailable"})
            await asyncio.sleep(5)
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# --- WebSocket Handlers ---

@router.websocket("/ws/portfolio")
async def websocket_portfolio(websocket: WebSocket, db: Session = Depends(get_db)):
    user = await get_ws_user(websocket, db)
    if not user:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    await manager.connect(websocket)

    if not Redis.client:
        logger.warning("Redis unavailable – portfolio WS running in degraded mode.")
        await _redis_fallback_loop(websocket, "PORTFOLIO_HEARTBEAT")
        return

    pubsub = Redis.client.pubsub()
    await pubsub.subscribe("live_updates")
    try:
        while True:
            message = await pubsub.get_message(ignore_subscribe_messages=True)
            if message:
                data = json.loads(message["data"])
                if data.get("type") == "PORTFOLIO_SYNC":
                    await websocket.send_json(data)
            await asyncio.sleep(0.1)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        await pubsub.unsubscribe("live_updates")

@router.websocket("/ws/trades")
async def websocket_trades(websocket: WebSocket, db: Session = Depends(get_db)):
    user = await get_ws_user(websocket, db)
    if not user:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    await manager.connect(websocket)

    if not Redis.client:
        logger.warning("Redis unavailable – trades WS running in degraded mode.")
        await _redis_fallback_loop(websocket, "TRADES_HEARTBEAT")
        return

    pubsub = Redis.client.pubsub()
    await pubsub.subscribe("live_updates")
    try:
        while True:
            message = await pubsub.get_message(ignore_subscribe_messages=True)
            if message:
                data = json.loads(message["data"])
                if data.get("type") in ["TRADE_UPDATE", "NEW_TRADE", "ARENA_DECISION"]:
                    await websocket.send_json(data)
            await asyncio.sleep(0.1)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        await pubsub.unsubscribe("live_updates")


@router.websocket("/ws/market/{symbol}")
async def websocket_market(websocket: WebSocket, symbol: str):
    await manager.connect(websocket)

    if not Redis.client:
        logger.warning(f"Redis unavailable – market/{symbol} WS running in degraded mode.")
        await _redis_fallback_loop(websocket, "MARKET_HEARTBEAT")
        return

    pubsub = Redis.client.pubsub()
    await pubsub.subscribe("market_ticks")
    try:
        # Initial cached tick
        cached_tick = await Redis.client.get(f"tick:{symbol}")
        if cached_tick:
            await websocket.send_text(cached_tick)

        while True:
            message = await pubsub.get_message(ignore_subscribe_messages=True)
            if message:
                data = json.loads(message["data"])
                if data.get("symbol") == symbol:
                    await websocket.send_json(data)
            await asyncio.sleep(0.01)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        await pubsub.unsubscribe("market_ticks")

@router.websocket("/ws/candles/{symbol}/{interval}")
async def websocket_candles(websocket: WebSocket, symbol: str, interval: str):
    await manager.connect(websocket)

    if not Redis.client:
        logger.warning(f"Redis unavailable – candles WS running in degraded mode.")
        await _redis_fallback_loop(websocket, "CANDLES_HEARTBEAT")
        return

    pubsub = Redis.client.pubsub()
    channel = f"candles:{symbol}:{interval}"
    await pubsub.subscribe(channel)
    try:
        latest = await Redis.client.get(f"latest_candle:{symbol}:{interval}")
        if latest:
            await websocket.send_text(latest)

        while True:
            message = await pubsub.get_message(ignore_subscribe_messages=True)
            if message:
                await websocket.send_text(message["data"])
            await asyncio.sleep(0.1)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        await pubsub.unsubscribe(channel)

# Unified endpoint for general updates from the old gateway
@router.websocket("/ws/updates")
async def websocket_updates(websocket: WebSocket):
    await manager.connect(websocket)

    if not Redis.client:
        logger.warning("Redis unavailable – updates WS running in degraded mode.")
        await _redis_fallback_loop(websocket, "UPDATES_HEARTBEAT")
        return

    pubsub = Redis.client.pubsub()
    await pubsub.subscribe("live_updates")
    try:
        while True:
            message = await pubsub.get_message(ignore_subscribe_messages=True)
            if message:
                await websocket.send_text(message["data"])
            await asyncio.sleep(0.1)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        await pubsub.unsubscribe("live_updates")


