from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from packages.core.database import get_db
from packages.core.models import Deployment, StrategyVersion, User, Position, BrokerAccount
from ..auth import get_current_user

router = APIRouter(prefix="/deployments", tags=["deployments"])

@router.post("/", response_model=dict)
async def create_deployment(
    data: dict, 
    db: Session = Depends(get_db), 
    current_user_email: str = Depends(get_current_user)
):
    user = db.query(User).filter(User.email == current_user_email).first()
    version_id = data.get("strategy_version_id")
    broker_account_id = data.get("broker_account_id")
    
    version = db.query(StrategyVersion).filter(StrategyVersion.id == version_id).first()
    if not version:
        raise HTTPException(status_code=404, detail="Strategy version not found")
        
    broker = db.query(BrokerAccount).filter(BrokerAccount.id == broker_account_id, BrokerAccount.user_id == user.id).first()
    if not broker:
        raise HTTPException(status_code=404, detail="Broker account not found")
    
    new_deployment = Deployment(
        user_id=user.id,
        strategy_version_id=version_id,
        broker_account_id=broker_account_id,
        mode=data.get("mode", "PAPER"),
        status="ACTIVE"
    )
    db.add(new_deployment)
    db.commit()
    db.refresh(new_deployment)
    
    return {"id": new_deployment.id, "status": "ACTIVE"}

@router.get("/", response_model=List[dict])
async def list_deployments(db: Session = Depends(get_db), current_user_email: str = Depends(get_current_user)):
    user = db.query(User).filter(User.email == current_user_email).first()
    deployments = db.query(Deployment).filter(Deployment.user_id == user.id).all()
    return [
        {
            "id": d.id, 
            "strategy": d.strategy_version.strategy.name,
            "mode": d.mode, 
            "status": d.status, 
            "broker": d.broker_account.broker_name,
            "created_at": d.created_at
        } for d in deployments
    ]

@router.get("/positions", response_model=List[dict])
async def get_positions(db: Session = Depends(get_db), current_user_email: str = Depends(get_current_user)):
    user = db.query(User).filter(User.email == current_user_email).first()
    positions = db.query(Position).filter(Position.user_id == user.id).all()
    return [
        {
            "symbol": p.symbol,
            "quantity": p.quantity,
            "avg_price": p.avg_price,
            "pnl": p.unrealized_pnl + p.realized_pnl
        } for p in positions
    ]

@router.post("/{deployment_id}/stop")
async def stop_deployment(deployment_id: int, db: Session = Depends(get_db), current_user_email: str = Depends(get_current_user)):
    user = db.query(User).filter(User.email == current_user_email).first()
    deployment = db.query(Deployment).filter(Deployment.id == deployment_id, Deployment.user_id == user.id).first()
    if not deployment:
        raise HTTPException(status_code=404, detail="Deployment not found")
    
    deployment.status = "STOPPED"
    db.commit()
    return {"status": "STOPPED"}
