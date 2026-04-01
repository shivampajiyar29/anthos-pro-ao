from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
import datetime
from packages.core.database import get_db
from packages.core.models import BacktestRun, StrategyVersion, User
from ..auth import get_current_user

router = APIRouter(prefix="/backtests", tags=["backtests"])

@router.post("/run", response_model=dict)
async def run_backtest(
    config: dict, 
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db), 
    current_user_email: str = Depends(get_current_user)
):
    user = db.query(User).filter(User.email == current_user_email).first()
    version_id = config.get("strategy_version_id")
    
    version = db.query(StrategyVersion).filter(StrategyVersion.id == version_id).first()
    if not version:
        raise HTTPException(status_code=404, detail="Strategy version not found")
    
    # Create Backtest Run record
    new_run = BacktestRun(
        user_id=user.id,
        strategy_version_id=version_id,
        status="PENDING",
        config=config
    )
    db.add(new_run)
    db.commit()
    db.refresh(new_run)
    
    # In a full implementation, this would be queued to Celery
    # For now, we simulate a start
    new_run.status = "RUNNING"
    db.commit()
    
    return {"id": new_run.id, "status": "PENDING"}

@router.get("/", response_model=List[dict])
async def list_backtests(db: Session = Depends(get_db), current_user_email: str = Depends(get_current_user)):
    user = db.query(User).filter(User.email == current_user_email).first()
    runs = db.query(BacktestRun).filter(BacktestRun.user_id == user.id).order_by(BacktestRun.created_at.desc()).all()
    return [
        {
            "id": r.id, 
            "strategy_name": r.strategy_version.strategy.name, 
            "status": r.status, 
            "created_at": r.created_at,
            "metrics": r.metrics
        } for r in runs
    ]

@router.get("/{run_id}", response_model=dict)
async def get_backtest_result(run_id: int, db: Session = Depends(get_db), current_user_email: str = Depends(get_current_user)):
    user = db.query(User).filter(User.email == current_user_email).first()
    run = db.query(BacktestRun).filter(BacktestRun.id == run_id, BacktestRun.user_id == user.id).first()
    if not run:
        raise HTTPException(status_code=404, detail="Backtest run not found")
        
    return {
        "id": run.id,
        "status": run.status,
        "config": run.config,
        "metrics": run.metrics,
        "created_at": run.created_at
    }
