from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from packages.core.database import get_db
from packages.core.models import Strategy, StrategyVersion, User
from packages.strategy_dsl.schema import StrategyDSL, validate_strategy
from ..auth import get_current_user

router = APIRouter(prefix="/strategies", tags=["strategies"])

@router.post("/", response_model=dict)
async def create_strategy(strategy_data: dict, db: Session = Depends(get_db), current_user_email: str = Depends(get_current_user)):
    user = db.query(User).filter(User.email == current_user_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Validate DSL
    validated_dsl, error = validate_strategy(strategy_data)
    if error:
        raise HTTPException(status_code=400, detail=f"Invalid Strategy DSL: {error}")
    
    # Create Strategy
    new_strategy = Strategy(
        user_id=user.id,
        name=validated_dsl.name,
        description=validated_dsl.description
    )
    db.add(new_strategy)
    db.commit()
    db.refresh(new_strategy)
    
    # Create Version 1
    new_version = StrategyVersion(
        strategy_id=new_strategy.id,
        version_number=1,
        dsl_content=strategy_data
    )
    db.add(new_version)
    db.commit()
    
    return {"id": new_strategy.id, "name": new_strategy.name, "version": 1}

@router.get("/", response_model=List[dict])
async def list_strategies(db: Session = Depends(get_db), current_user_email: str = Depends(get_current_user)):
    user = db.query(User).filter(User.email == current_user_email).first()
    strategies = db.query(Strategy).filter(Strategy.user_id == user.id).all()
    return [{"id": s.id, "name": s.name, "created_at": s.created_at} for s in strategies]

@router.get("/{strategy_id}", response_model=dict)
async def get_strategy(strategy_id: int, db: Session = Depends(get_db), current_user_email: str = Depends(get_current_user)):
    user = db.query(User).filter(User.email == current_user_email).first()
    strategy = db.query(Strategy).filter(Strategy.id == strategy_id, Strategy.user_id == user.id).first()
    if not strategy:
        raise HTTPException(status_code=404, detail="Strategy not found")
    
    # Get latest version
    latest_version = db.query(StrategyVersion).filter(StrategyVersion.strategy_id == strategy_id).order_by(StrategyVersion.version_number.desc()).first()
    
    return {
        "id": strategy.id,
        "name": strategy.name,
        "description": strategy.description,
        "latest_version": latest_version.version_number if latest_version else None,
        "dsl": latest_version.dsl_content if latest_version else None
    }
