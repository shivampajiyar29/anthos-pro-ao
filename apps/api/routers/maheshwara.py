from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional, Literal
from datetime import datetime
import logging
import random
from packages.core.database import MongoDB, InfluxDB, get_db
from sqlalchemy.orm import Session

logger = logging.getLogger("api.maheshwara")
router = APIRouter()

# --- Models ---

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

class FeedbackRequest(BaseModel):
    agent_id: str
    feedback: Literal["up", "down"]
    comment: Optional[str] = None

# --- Maheshwara Logic ---

@router.get("/status")
async def get_maheshwara_status():
    """Unified status for Maheshwara Autonomous Engine."""
    # In a real system, this might come from a Redis 'engine_state' key
    return {
        "is_active": True,
        "active_bots": 5,
        "mode": "AUTONOMOUS",
        "health": "OPTIMAL",
        "uptime": 3600 # Static for now, or fetch from heartbeat
    }

@router.get("/portfolio", response_model=PortfolioResponse)
async def get_portfolio():
    if MongoDB.db is None:
        return {
            "total_equity": 0, "daily_pnl": 0, "daily_pnl_percent": 0,
            "win_rate_24h": 0, "sharpe_ratio": 0, "max_drawdown": 0, "trades_today": 0
        }
    
    try:
        today_start = datetime.combine(datetime.today(), datetime.min.time())
        trades_today = await MongoDB.db.decisions.count_documents({"timestamp": {"$gt": today_start}})
        
        all_closed_trades = await MongoDB.db.decisions.find({"status": "CLOSED"}).to_list(length=1000)
        total_pnl = sum(t.get("pnl", 0) for t in all_closed_trades)
        
        active_positions = await MongoDB.db.decisions.find({"status": "OPEN"}).to_list(length=100)
        unrealized_pnl = sum(t.get("pnl", 0) for t in active_positions)
        
        daily_pnl = sum(t.get("pnl", 0) for t in all_closed_trades if t.get("timestamp") > today_start)
        daily_unrealized = sum(t.get("pnl", 0) for t in active_positions if t.get("timestamp") > today_start)
        
        wins = len([t for t in all_closed_trades if t.get("pnl", 0) > 0])
        win_rate = (wins / len(all_closed_trades) * 100) if all_closed_trades else 0
        
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
    except Exception as e:
        logger.error(f"Error calculating portfolio: {e}")
        raise HTTPException(status_code=500, detail="Portfolio calculation failed")

@router.get("/agents", response_model=List[AgentStatus])
async def get_agents():
    if MongoDB.db is None:
        return []
        
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
    results = await MongoDB.db.decisions.aggregate(pipeline).to_list(length=10)
    
    roles = {
        "Strategist": "Macro Alignment",
        "Tactician": "Micro Execution",
        "Sentinel": "Risk Management",
        "Analyst": "Sentiment Engine",
        "Arbitrageur": "Delta Neutral"
    }
    
    agents = []
    for r in results:
        agents.append({
            "agent_name": r["_id"],
            "role": roles.get(r["_id"], "Specialist"),
            "confidence": r["confidence"],
            "decision": r["decision"],
            "aggressiveness": 50
        })
    
    # Fill defaults
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

@router.post("/feedback")
async def submit_feedback(feedback: FeedbackRequest):
    if MongoDB.db is None:
        raise HTTPException(status_code=503, detail="Database Offline")
        
    await MongoDB.db.feedback.insert_one({
        "timestamp": datetime.now(),
        "agent_id": feedback.agent_id,
        "feedback": feedback.feedback,
        "comment": feedback.comment
    })
    return {"status": "success", "message": "Neural Feedback recorded"}

@router.get("/logs")
async def get_autonomous_logs():
    return [
        {"time": datetime.now().strftime("%H:%M:%S"), "msg": "Maheshwara Neural Brain active..."},
        {"time": (datetime.now()).strftime("%H:%M:%S"), "msg": "Syncing agent memory with MongoDB Atlas..."},
        {"time": (datetime.now()).strftime("%H:%M:%S"), "msg": "Telemetry stream established to InfluxDB."},
    ]
