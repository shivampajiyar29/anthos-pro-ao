import asyncio
import logging
from typing import List, Dict, Any
from datetime import datetime, timedelta
from ..agents.base import AgentSignal
import redis.asyncio as redis
import json

from motor.motor_asyncio import AsyncIOMotorClient
from influxdb_client.client.influxdb_client_async import InfluxDBClientAsync
from influxdb_client import Point

logger = logging.getLogger("CompetitionArena")

class CompetitionArena:
    def __init__(self, settings):
        self.settings = settings
        self.redis = redis.from_url(settings.REDIS_URL)
        
        # Async DB Clients
        self.mongo_client = AsyncIOMotorClient(settings.MONGO_URL)
        self.db = self.mongo_client.get_database()
        self.influx_client = InfluxDBClientAsync(
            url=settings.INFLUXDB_URL,
            token=settings.INFLUXDB_TOKEN,
            org=settings.INFLUXDB_ORG
        )
        self.influx_write_api = self.influx_client.write_api()
        
    async def process_neural_chain(self, agents: Dict[str, Any], market_data: Dict[str, Any], broker: Any):
        """
        Coordinates the multi-agent reasoning chain and executes orders via broker.
        """
        # The Institutional Neural-1 Chain Logic:
        # 1. Strategist: Defines core bias & risk budget.
        # 2. Tactician: Defines precise entries based on bias.
        # 3. Sentinel: Filters/Blocks/Approves based on capital protection.
        # 4. Analyst: Explains why the decision was made.
        
        # 0. Retrieve Lessons Learned (Mistakes)
        mistakes = await self.db.mistakes.find({
            "symbol": market_data.get("symbol", "BTCUSDT"),
            "timestamp": {"$gt": datetime.now() - timedelta(days=7)} # Last 7 days
        }).sort("timestamp", -1).limit(5).to_list(length=5)
        
        mistake_context = [m.get("lesson", m.get("reason", "Unknown mistake")) for m in mistakes]
        logger.info(f"🧠 Injected {len(mistake_context)} historical lessons into Neural Chain.")

        # 1. Macro Analysis (Strategist)
        market_data_with_lessons = {**market_data, "lessons_learned": mistake_context}
        strategist_result = await agents['strategist'].analyze(market_data_with_lessons)
        logger.info(f"📍 Strategist Bias: {strategist_result.core_bias}")

        # 2. Strategy Refinement (Tactician)
        tactician_result = await agents['tactician'].analyze(market_data_with_lessons, context=strategist_result)
        logger.info(f"🎯 Tactician Entry: {tactician_result.side} @ {tactician_result.entry_price}")

        # 3. Capital Protection (Risk Sentinel)
        sentinel_result = await agents['sentinel'].analyze(market_data, context=[tactician_result])
        logger.info(f"🛡️ Sentinel Decision: {len(sentinel_result.approved_orders)} orders approved.")

        # 3b. Human Bias (WithMyself) - Just for representation/bias sync
        myself_result = await agents['myself'].analyze(market_data)
        logger.info(f"👤 Myself Bias: {myself_result.action}")

        # 4. Final Synthesis & Execution
        final_orders = []
        
        # Security Interlock: Only proceed if Sentinel approved orders
        if sentinel_result.approved_orders:
            for order in sentinel_result.approved_orders:
                order_dict = order.dict()
                order_dict['bias'] = strategist_result.core_bias
                executed_order = await broker.place_order(order_dict)
                final_orders.append(executed_order)
                
                # Broadest each trade for Institutional Order Flow
                trade_update = {
                    "type": "TRADE_UPDATE",
                    "timestamp": datetime.now().isoformat(),
                    "symbol": order.symbol,
                    "agent_name": "Neural Brain",
                    "action": order.side,
                    "quantity": order.size,
                    "price": float(order.entry_price) if isinstance(order.entry_price, (int, float)) else 0.0,
                    "target_price": order.target,
                    "stop_loss": order.stop,
                    "status": "OPEN",
                    "pnl": 0.0
                }
                await self.redis.publish("live_updates", json.dumps(trade_update))
        
        # 5. Narrative Explanation (Analyst)
        chain_context = {
            "market_data": market_data,
            "decisions": {
                "strategist": strategist_result.dict(),
                "tactician": tactician_result.dict(),
                "sentinel": sentinel_result.dict(),
                "myself": myself_result.dict()
            },
            "executed_orders": final_orders
        }
        analyst_result = await agents['analyst'].analyze(market_data, context=chain_context)
        logger.info(f"📝 Analyst Explanation Generated: {len(analyst_result.stance)} chars")

        # 6. Persist Unified Neural Decision
        decision_doc = {
            "type": "NEURAL_DECISION",
            "timestamp": datetime.now(),
            "symbol": market_data.get("symbol"),
            "bias": strategist_result.core_bias,
            "myself_bias": myself_result.action,
            "orders": final_orders,
            "risk_warning": sentinel_result.risk_warning,
            "explanation": analyst_result.dict(),
            "status": "OPEN" if final_orders else "SKIPPED",
            "raw_chain": chain_context # Restoring context for front-end deep-dives
        }
        
        try:
            await self.db.decisions.insert_one(decision_doc)
            logger.info("💾 Neural decision persisted to MongoDB.")
            
            # 7. Broadcast to Dashboard via Redis (Glassmorphism UI Link)
            message = {
                "type": "NEURAL_DECISION",
                "symbol": market_data.get("symbol"),
                "action": tactician_result.side,
                "myself_action": myself_result.action,
                "stance": analyst_result.stance,
                "risk_status": "SECURE" if not sentinel_result.risk_warning else "ALERT",
                "timestamp": datetime.now().isoformat(),
                "reasoning": analyst_result.stance,
                "orders": final_orders,
                "bias": strategist_result.core_bias
            }
            await self.redis.publish("live_updates", json.dumps(message))
            
        except Exception as e:
            logger.error(f"Failed to persist/broadcast neural decision: {e}")

        return decision_doc
        
    async def record_outcome(self, decision_id: str, profit: float, reason: str = "Technical Exit"):
        """
        Records the outcome of a trade and stores it as a mistake if it was a loss.
        """
        try:
            decision = await self.db.decisions.find_one({"_id": decision_id})
            if not decision:
                logger.error(f"Decision {decision_id} not found for outcome recording.")
                return

            # Update the decision with the actual outcome
            await self.db.decisions.update_one(
                {"_id": decision_id},
                {"$set": {"pnl": profit, "outcome_recorded_at": datetime.now()}}
            )

            # If it's a significant loss, record it as a mistake for the agents to learn from
            if profit < 0:
                mistake_doc = {
                    "timestamp": datetime.now(),
                    "symbol": decision.get("symbol"),
                    "loss": profit,
                    "reason": reason,
                    "lesson": f"Trade in {decision.get('symbol')} resulted in {profit} loss. Reason: {reason}. Bias was {decision.get('bias')}.",
                    "raw_decision": decision
                }
                await self.db.mistakes.insert_one(mistake_doc)
                logger.info(f"❌ Negative outcome recorded as a lesson for {decision.get('symbol')}")
            else:
                logger.info(f"✅ Positive outcome recorded for {decision.get('symbol')}")

        except Exception as e:
            logger.error(f"Error recording outcome: {e}")
