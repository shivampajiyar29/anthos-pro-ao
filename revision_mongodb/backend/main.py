import asyncio
from typing import List
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
import redis.asyncio as redis
from contextlib import asynccontextmanager
import json
from data_layer.db import db_manager

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

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
            await connection.send_text(message)

manager = ConnectionManager()

async def redis_listener(app: FastAPI):
    """
    Listens to Redis channels and broadcasts messages to all connected WebSockets.
    """
    pubsub = app.state.redis.pubsub()
    await pubsub.subscribe("agent_signals", "market_updates")
    
    try:
        while True:
            message = await pubsub.get_message(ignore_subscribe_messages=True)
            if message:
                await manager.broadcast(message["data"].decode("utf-8"))
            await asyncio.sleep(0.01)
    except Exception as e:
        print(f"Redis listener error: {e}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Connect to Redis and MongoDB
    app.state.redis = await redis.from_url(os.getenv("REDIS_URL", "redis://redis:6379"))
    await db_manager.connect()
    # Start Redis listener task
    app.state.listener_task = asyncio.create_task(redis_listener(app))
    yield
    # Shutdown
    app.state.listener_task.cancel()
    await app.state.redis.close()
    await db_manager.close()

app = FastAPI(title="MAHESHWARA API", lifespan=lifespan)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "MAHESHWARA Autonomous Multi-Market AI Trading Ecosystem is Live"}

@app.get("/mode")
async def get_mode():
    from execution.engine import execution_engine
    return {"mode": execution_engine.mode}

@app.post("/mode/toggle")
async def toggle_mode():
    from execution.engine import execution_engine
    execution_engine.mode = "LIVE" if execution_engine.mode == "PAPER" else "PAPER"
    await manager.broadcast(json.dumps({"type": "MODE_CHANGE", "mode": execution_engine.mode}))
    return {"mode": execution_engine.mode}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    from execution.engine import execution_engine
    # Send initial mode
    await websocket.send_text(json.dumps({"type": "MODE_CHANGE", "mode": execution_engine.mode}))
    try:
        while True:
            data = await websocket.receive_text()
            # Handle incoming client messages if needed
    except WebSocketDisconnect:
        manager.disconnect(websocket)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

