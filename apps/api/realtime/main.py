from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from typing import List, Dict
import asyncio
import json
import os
import aioredis

app = FastAPI(title="Athos Realtime Service")

# Connection Manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except Exception:
                pass

manager = ConnectionManager()
redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Keep connection alive
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

async def redis_listener():
    """
    Listens to Redis Pub/Sub and broadcasts to all connected WebSockets.
    """
    redis = aioredis.from_url(redis_url)
    pubsub = redis.pubsub()
    await pubsub.subscribe("market_data", "order_updates", "risk_alerts")
    
    async for message in pubsub.listen():
        if message["type"] == "message":
            channel = message["channel"].decode("utf-8")
            data = message["data"].decode("utf-8")
            payload = {
                "channel": channel,
                "data": json.loads(data)
            }
            await manager.broadcast(json.dumps(payload))

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(redis_listener())

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
