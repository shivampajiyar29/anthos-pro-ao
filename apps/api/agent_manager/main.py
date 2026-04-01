import asyncio
import logging
import os
import json
import random
import redis.asyncio as redis
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic_settings import BaseSettings, SettingsConfigDict
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("MaheshwaraAgents")

class Settings(BaseSettings):
    REDIS_URL: str
    MONGO_URL: str
    INFLUXDB_URL: str
    INFLUXDB_TOKEN: str
    INFLUXDB_ORG: str
    INFLUXDB_BUCKET: str

    # API Keys (loaded from env) for agents to access later
    NVIDIA_API_KEY: str | None = None
    OPENROUTER_API_KEY: str | None = None

    # Broker Configuration
    PREFERRED_BROKER: str = "UPSTOX"
    UPSTOX_API_KEY: str | None = None
    UPSTOX_API_SECRET: str | None = None
    GROWW_API_KEY: str | None = None
    GROWW_API_SECRET: str | None = None
    
    # Execution Mode
    LIVE_MODE: bool = False
    
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()

from .core.data_loader import MarketDataManager
from .core.arena import CompetitionArena
from .agents.strategist import StrategistAgent
from .agents.tactician import TacticianAgent
from .agents.risk_sentinel import RiskSentinelAgent
from .agents.analyst import AnalystAgent
from .agents.arbitrageur import ArbitrageurAgent
from .agents.myself import MyselfAgent
from .core.live_provider import LiveDataProvider
from .core.broker import PaperBroker, LiveBroker

async def run_agent_cycle():
    """
    Simulates the Neural-1 Institutional decision cycle.
    """
    # Initialize Core Components
    data_manager = MarketDataManager()
    arena = CompetitionArena(settings)
    
    # Initialize Broker
    mongo_client = AsyncIOMotorClient(settings.MONGO_URL)
    db = mongo_client.get_database()
    
    if settings.LIVE_MODE:
        logger.info("⚠️ [CAUTION] LIVE EXECUTION MODE ENABLED.")
        broker = LiveBroker(settings)
    else:
        logger.info("🔬 [PAPER] Simulation Mode Enabled.")
        broker = PaperBroker(db)

    # Initialize Specialized Neural Brain Agents
    brain_agents = {
        "strategist": StrategistAgent(),
        "tactician": TacticianAgent(),
        "sentinel": RiskSentinelAgent(),
        "analyst": AnalystAgent(),
        "arbitrageur": ArbitrageurAgent(),
        "myself": MyselfAgent()
    }
    
    logger.info("🧠 MAHESHWARA NEURAL-1 Brain Initialized.")

    while True:
        logger.info("--- 🟢 Starting Neural-1 Decision Cycle ---")
        
        # 1. Data Ingestion
        logger.info("[1/3] Fetching Macro & Micro Snapshot...")
        market_data = await data_manager.fetch_snapshot()
        
        # 2. Parallel Opportunistic & Sequential Neural Analysis
        logger.info("[2/3] Processing Multi-Agent Matrix...")
        try:
            # Run Neural Chain (Sequential logic) and Arbitrageur (Parallel opportunistic)
            chain_task = arena.process_neural_chain(brain_agents, market_data, broker)
            arb_task = brain_agents['arbitrageur'].analyze(market_data)
            
            decision, arb_result = await asyncio.gather(chain_task, arb_task)
            
            logger.info(f"✅ Success: Bias={decision['bias']}, Orders={len(decision['orders'])}")
            if arb_result and arb_result.get("opportunity_found"):
                logger.info(f"⚡ Arbitrageur Found Entry: {arb_result['symbol']}")
                
        except Exception as e:
            logger.error(f"❌ Matrix Execution Failed: {e}")
        
        # 3. Cycle Completion
        logger.info("[3/3] Cycle Complete. Waiting for next sync...")
        await asyncio.sleep(60) # Sync every 1 minute

async def check_price_alerts(data_manager: MarketDataManager):
    """
    Background task to check for price alerts.
    """
    mongo_client = AsyncIOMotorClient(settings.MONGO_URL)
    db = mongo_client.get_database()
    redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)
    
    logger.info("🔔 Alert Monitoring System Active.")
    
    while True:
        try:
            # 1. Fetch active alerts
            alerts = await db.alerts.find({"is_active": True}).to_list(length=100)
            if not alerts:
                await asyncio.sleep(10)
                continue
                
            # 2. Get latest market data
            market_data = await data_manager.fetch_snapshot()
            tickers = market_data.get("tickers", {})
            
            for alert in alerts:
                symbol = alert["symbol"]
                target_price = alert["target_price"]
                criteria = alert["alert_criteria"]
                
                if symbol in tickers:
                    current_price = tickers[symbol]["price"]
                    triggered = False
                    
                    if criteria == "Target Price":
                        # Simplistic: check if we crossed or are near
                        # For demo, if price is within 0.1% of target
                        if abs(current_price - target_price) / target_price < 0.005: 
                            triggered = True
                    
                    if triggered:
                        logger.info(f"🚨 ALERT TRIGGERED: {symbol} at {current_price} (Target: {target_price})")
                        
                        # 3. Publish to Redis
                        notification = {
                            "type": "PRICE_ALERT",
                            "alert_id": str(alert["_id"]),
                            "symbol": symbol,
                            "price": current_price,
                            "message": f"Target price of ${target_price} for {symbol} has been reached.",
                            "timestamp": datetime.now().isoformat()
                        }
                        await redis_client.publish("live_updates", json.dumps(notification))
                        
                        # 4. Deactivate alert (so it doesn't fire repeatedly)
                        await db.alerts.update_one({"_id": alert["_id"]}, {"$set": {"is_active": False}})
                        
        except Exception as e:
            logger.error(f"Alert Check Cycle Error: {e}")
            
        await asyncio.sleep(10) # Check every 10 seconds

async def sync_portfolio_status():
    """
    Periodically syncs portfolio performance metrics to Redis for the dashboard.
    """
    redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)
    logger.info("📊 Portfolio Sync Service Active.")
    
    while True:
        try:
            # Simulated portfolio update
            # In production, this would calculate actual PnL from trades
            update = {
                "type": "PORTFOLIO_SYNC",
                "total_equity": 124644.17 + (random.random() - 0.5) * 50,
                "daily_pnl": 2906.92 + (random.random() - 0.5) * 10,
                "daily_pnl_percent": 2.38 + (random.random() - 0.5) * 0.1,
                "timestamp": datetime.now().isoformat()
            }
            await redis_client.publish("live_updates", json.dumps(update))
        except Exception as e:
            logger.error(f"Portfolio Sync Error: {e}")
        
        await asyncio.sleep(5) # Sync every 5 seconds

async def main():
    logger.info(f"System Starting. Env: {os.getenv('ENV', 'DEV')}")
    
    try:
        # Verify Redis Connection
        r = redis.from_url(settings.REDIS_URL)
        await r.ping()
        logger.info("Redis Connected [OK]")
        await r.close()
    except Exception as e:
        logger.error(f"Redis Connection Failed [FAIL]: {e}")
        # We continue even if Redis fails, though some services will be limited

    data_manager = MarketDataManager()
    
    live_provider = LiveDataProvider(settings.REDIS_URL)
    
    # Run Agent Cycle, Alert Monitor, Live Provider, and Portfolio Sync concurrently
    await asyncio.gather(
        run_agent_cycle(),
        check_price_alerts(data_manager),
        live_provider.start(),
        sync_portfolio_status()
    )

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("Agent Manager stopping...")
