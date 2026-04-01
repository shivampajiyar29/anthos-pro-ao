from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from packages.core.database import get_db
from packages.core.models import Order, User, Position, OrderStatus
import datetime
from ..auth import get_current_user

router = APIRouter(prefix="/orders", tags=["orders"])

@router.get("/", response_model=List[dict])
async def list_orders(db: Session = Depends(get_db), current_user_email: str = Depends(get_current_user)):
    user = db.query(User).filter(User.email == current_user_email).first()
    orders = db.query(Order).filter(Order.deployment_id != None).order_by(Order.created_at.desc()).all()
    return [
        {
            "id": o.id,
            "symbol": o.symbol,
            "side": o.side,
            "qty": o.quantity,
            "price": o.price,
            "status": o.status,
            "created_at": o.created_at
        } for o in orders
    ]

@router.post("/", response_model=dict)
async def create_order(order_data: dict, db: Session = Depends(get_db), current_user_email: str = Depends(get_current_user)):
    user = db.query(User).filter(User.email == current_user_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    new_order = Order(
        symbol=order_data.get("symbol"),
        side=order_data.get("side"),
        quantity=order_data.get("quantity"),
        order_type=order_data.get("order_type", "MARKET"),
        price=order_data.get("price"),
        status=OrderStatus.FILLED, # Auto-fill for Paper Trading
        client_order_id=f"man_{datetime.datetime.utcnow().timestamp()}"
    )
    
    db.add(new_order)
    
    # Update Position
    position = db.query(Position).filter(Position.user_id == user.id, Position.symbol == new_order.symbol).first()
    if not position:
        position = Position(
            user_id=user.id,
            symbol=new_order.symbol,
            quantity=0,
            avg_price=0
        )
        db.add(position)
    
    if new_order.side == "BUY":
        new_qty = position.quantity + new_order.quantity
        new_avg = ((position.quantity * position.avg_price) + (new_order.quantity * (new_order.price or 0))) / new_qty
        position.quantity = new_qty
        position.avg_price = new_avg
    else:
        position.quantity -= new_order.quantity
    
    db.commit()
    return {"id": new_order.id, "status": "FILLED"}

@router.get("/{order_id}", response_model=dict)
async def get_order(order_id: int, db: Session = Depends(get_db), current_user_email: str = Depends(get_current_user)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return {
        "id": order.id,
        "symbol": order.symbol,
        "status": order.status,
        "qty": order.quantity,
        "filled_qty": order.filled_quantity,
        "avg_price": order.avg_price
    }
