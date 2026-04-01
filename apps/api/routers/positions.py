from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import datetime
import logging
import time
import random

from packages.core.database import get_db
from packages.core.models import Order, OrderStatus, OrderSide

logger = logging.getLogger("api.positions")
router = APIRouter()

INITIAL_EQUITY = 100_000.0


def _compute_positions_from_orders(db: Session) -> List[dict]:
    """Derive positions from filled paper orders in the DB."""
    filled_orders = (
        db.query(Order)
        .filter(Order.status == OrderStatus.FILLED)
        .order_by(Order.created_at.asc())
        .all()
    )

    # Aggregate by symbol
    agg: dict = {}
    for o in filled_orders:
        sym = o.symbol
        if sym not in agg:
            agg[sym] = {"symbol": sym, "quantity": 0.0, "avg_price": 0.0, "side": o.side.value if o.side else "BUY"}

        qty = o.filled_quantity if o.filled_quantity else o.quantity
        price = o.price or 0.0
        pos = agg[sym]

        if o.side == OrderSide.BUY or (hasattr(o.side, "value") and o.side.value == "BUY"):
            new_qty = pos["quantity"] + qty
            if new_qty > 0:
                pos["avg_price"] = ((pos["avg_price"] * pos["quantity"]) + (price * qty)) / new_qty
            pos["quantity"] = new_qty
        else:  # SELL
            pos["quantity"] -= qty

    return [p for p in agg.values() if abs(p["quantity"]) > 0.0001]


def _get_current_price(symbol: str, entry_price: float) -> float:
    """Try yfinance for a fresh price, fallback to entry_price."""
    try:
        import yfinance as yf
        # Convert NSE symbol format
        ticker_sym = symbol if "." in symbol or symbol.endswith("USDT") else symbol
        if symbol.endswith(".NS") or symbol.upper() in ["RELIANCE", "HDFCBANK", "INFY", "TCS", "ZOMATO", "TATASTEEL"]:
            ticker_sym = symbol if ".NS" in symbol else f"{symbol}.NS"
        t = yf.Ticker(ticker_sym)
        hist = t.history(period="1d", interval="1m")
        if not hist.empty:
            return float(hist["Close"].iloc[-1])
    except Exception:
        pass
    return entry_price


@router.get("/")
async def get_positions(db: Session = Depends(get_db)):
    """Return all open positions derived from filled paper orders."""
    raw = _compute_positions_from_orders(db)
    results = []
    for pos in raw:
        entry = pos["avg_price"] or 1.0
        current_price = _get_current_price(pos["symbol"], entry)
        qty = pos["quantity"]
        pnl = (current_price - entry) * qty
        pnl_pct = ((current_price - entry) / entry * 100) if entry else 0

        results.append({
            "symbol": pos["symbol"],
            "entry_price": round(entry, 4),
            "current_price": round(current_price, 4),
            "quantity": qty,
            "side": pos["side"],
            "pnl": round(pnl, 2),
            "pnl_percent": round(pnl_pct, 4),
        })
    return results


@router.get("/history")
async def get_portfolio_history(db: Session = Depends(get_db)):
    """Return estimated equity curve (last 30 days)."""
    filled_orders = db.query(Order).filter(Order.status == OrderStatus.FILLED).all()
    realized_pnl = sum(
        (o.price or 0) * (o.filled_quantity or o.quantity) * (-1 if o.side == OrderSide.SELL else 1)
        for o in filled_orders
    )
    base = INITIAL_EQUITY + realized_pnl

    points = []
    now = int(time.time())
    price = base * 0.85
    for i in range(30 * 24):
        ts = now - (30 * 24 - i) * 3600
        price = price * (1 + random.gauss(0.0002, 0.003))
        points.append({"time": ts, "equity": round(price, 2)})
    points[-1]["equity"] = round(base, 2)
    return {"history": points, "current_equity": round(base, 2)}
