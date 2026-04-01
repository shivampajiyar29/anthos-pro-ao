from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from packages.core.database import get_db
from packages.core.models import Instrument

router = APIRouter()

@router.get("/")
async def list_instruments(db: Session = Depends(get_db)):
    return db.query(Instrument).all()

@router.get("/{symbol}")
async def get_instrument(symbol: str, db: Session = Depends(get_db)):
    instrument = db.query(Instrument).filter(Instrument.tradingsymbol == symbol).first()
    if not instrument:
        raise HTTPException(status_code=404, detail="Instrument not found")
    return instrument

@router.post("/search")
async def search_instruments(query: str, db: Session = Depends(get_db)):
    return db.query(Instrument).filter(Instrument.tradingsymbol.contains(query.upper())).all()
