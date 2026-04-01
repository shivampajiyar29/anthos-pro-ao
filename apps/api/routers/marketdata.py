from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from packages.core.database import get_db
from packages.core.models import Instrument
from ..auth import get_current_user

router = APIRouter(prefix="/market", tags=["marketdata"])

@router.get("/instruments")
async def list_instruments(exchange: str = "NSE", db: Session = Depends(get_db)):
    instruments = db.query(Instrument).filter(Instrument.exchange == exchange).limit(100).all()
    return instruments

@router.get("/quotes/{symbol}")
async def get_quote(symbol: str):
    # This would call the LiveDataProvider from packages/marketdata
    return {
        "symbol": symbol,
        "last_price": 52500.50,
        "change_pct": 1.25,
        "volume": 1250000,
        "timestamp": "2026-03-21T12:10:00Z"
    }

@router.get("/option-chain/{symbol}")
async def get_option_chain(symbol: str):
    # Mock option chain for NIFTY/BANKNIFTY
    return {
        "underlying": symbol,
        "last_price": 22500,
        "expiries": ["2026-03-28", "2026-04-04"],
        "strikes": [
            {"strike": 22400, "call_ltp": 250, "put_ltp": 150},
            {"strike": 22500, "call_ltp": 200, "put_ltp": 200},
            {"strike": 22600, "call_ltp": 150, "put_ltp": 250}
        ]
    }
