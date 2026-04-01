import asyncio
import json
from typing import Dict, Any, Optional
from datetime import datetime
from packages.common.logging import get_logger
from packages.common.config import settings
from packages.brokers.base import BrokerAdapter
from packages.execution.order_manager import OrderManager
from packages.risk.engine import RiskEngine
from packages.core.database import Redis, MongoDB

from packages.ai_assistant.gemini_engine import GeminiEngine

logger = get_logger("execution.controller")

class DeploymentController:
    """
    Orchestrates the lifecycle of a live or paper trading strategy.
    Runs a continuous loop for market data processing and order execution.
    """
    def __init__(self, deployment_id: str, symbol: str, broker: BrokerAdapter, db_session):
        self.deployment_id = deployment_id
        self.symbol = symbol.upper()
        self.broker = broker
        self.db = db_session
        self.order_manager = OrderManager(broker, db_session)
        self.ai_engine = GeminiEngine(settings.GEMINI_API_KEY)
        self.is_running = False
        self._task: Optional[asyncio.Task] = None

    async def start(self):
        if self.is_running:
            return
        self.is_running = True
        logger.info(f"🚀 Deployment {self.deployment_id} ({self.symbol}) STARTING")
        self._task = asyncio.create_task(self._main_loop())

    async def stop(self):
        self.is_running = False
        if self._task:
            self._task.cancel()
            try:
                await self._task
            except asyncio.CancelledError:
                pass
        logger.info(f"🛑 Deployment {self.deployment_id} STOPPED")

    async def _main_loop(self):
        """The heartbeat. Fetches price, calls AI, logs, executes."""
        while self.is_running:
            try:
                # 1. Fetch Market State from Redis
                tick_raw = await Redis.client.get(f"tick:{self.symbol}")
                if not tick_raw:
                    logger.warning(f"No price for {self.symbol} in Redis. Skipping cycle.")
                    await asyncio.sleep(5)
                    continue

                tick = json.loads(tick_raw)
                price = tick.get("price")
                
                # 2. Get AI Signal
                # We'll also try to get candles if available
                candles_raw = await Redis.client.get(f"latest_candle:{self.symbol}:1m")
                candles = [json.loads(candles_raw)] if candles_raw else []
                
                signal = await self.ai_engine.get_signal(self.symbol, price, candles)
                
                # 3. Log Signal to MongoDB
                if MongoDB.db is not None:
                    await MongoDB.db.ai_signals.insert_one({
                        "deployment_id": self.deployment_id,
                        "symbol": self.symbol,
                        "timestamp": datetime.now().isoformat(),
                        "price": price,
                        "signal": signal
                    })

                # 4. Filter and Execute
                confidence_threshold = 0.75 # Default threshold
                action = signal.get("action", "HOLD")
                confidence = signal.get("confidence", 0.0)

                if action in ["BUY", "SELL"] and confidence >= confidence_threshold:
                    logger.info(f"🔥 AI EXECUTION: {action} {self.symbol} at {price} (Conf: {confidence})")
                    # Placeholder for quantity logic, using 1 for now
                    await self.order_manager.place_order(
                        symbol=self.symbol,
                        side=action,
                        quantity=1.0,
                        price=price,
                        is_paper=True # Default to paper for now
                    )
                
                await asyncio.sleep(10) # 10 second loop for AI decisions
            except Exception as e:
                logger.error(f"Execution Error in {self.deployment_id}: {e}")
                await asyncio.sleep(10)
