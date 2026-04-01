from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from packages.core.database import get_db
from packages.core.models import RiskRule, User, Notification
from ..auth import get_current_user

router = APIRouter(prefix="/risk", tags=["risk"])

@router.get("/rules", response_model=List[dict])
async def get_risk_rules(db: Session = Depends(get_db), current_user_email: str = Depends(get_current_user)):
    user = db.query(User).filter(User.email == current_user_email).first()
    rules = db.query(RiskRule).filter(RiskRule.user_id == user.id).all()
    return [
        {
            "id": r.id, 
            "rule_type": r.rule_type, 
            "scope": r.scope, 
            "parameters": r.parameters, 
            "action": r.action,
            "is_active": r.is_active
        } for r in rules
    ]

@router.post("/rules", response_model=dict)
async def create_risk_rule(rule_data: dict, db: Session = Depends(get_db), current_user_email: str = Depends(get_current_user)):
    user = db.query(User).filter(User.email == current_user_email).first()
    
    new_rule = RiskRule(
        user_id=user.id,
        rule_type=rule_data.get("rule_type"),
        scope=rule_data.get("scope", "PORTFOLIO"),
        scope_id=rule_data.get("scope_id"),
        parameters=rule_data.get("parameters", {}),
        action=rule_data.get("action", "LOG")
    )
    db.add(new_rule)
    db.commit()
    db.refresh(new_rule)
    
    return {"id": new_rule.id, "status": "active"}

@router.get("/alerts", response_model=List[dict])
async def get_risk_alerts(db: Session = Depends(get_db), current_user_email: str = Depends(get_current_user)):
    user = db.query(User).filter(User.email == current_user_email).first()
    # Risk breaches are stored as Notifications of type RISK_BREACH
    alerts = db.query(Notification).filter(
        Notification.user_id == user.id, 
        Notification.type == "RISK_BREACH"
    ).order_by(Notification.created_at.desc()).all()
    
    return [
        {
            "id": a.id,
            "title": a.title,
            "message": a.message,
            "created_at": a.created_at,
            "is_read": a.is_read
        } for a in alerts
    ]
