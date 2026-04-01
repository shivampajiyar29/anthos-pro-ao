from typing import Dict, Optional
from packages.brokers.base import BaseBroker, BrokerOrderStatus
from packages.core.models import Order, OrderStatus
import uuid
import datetime

from packages.risk.engine import RiskEngine

class OrderManager:
    def __init__(self, broker: BaseBroker, db_session, risk_engine: Optional[RiskEngine] = None):
        self.broker = broker
        self.db = db_session
        self.risk_engine = risk_engine
        self.order_map: Dict[str, Order] = {} # client_order_id -> Order

    def place_order(self, deployment_id: int, symbol: str, side: str, quantity: int, order_type: str, price: Optional[float] = None, portfolio_state: Optional[Dict] = None) -> Order:
        client_order_id = str(uuid.uuid4())
        
        # 0. Risk Check
        if self.risk_engine and portfolio_state:
            risk_result = self.risk_engine.validate_order(
                {"symbol": symbol, "side": side, "quantity": quantity},
                portfolio_state
            )
            if not risk_result.is_allowed:
                raise Exception(f"Risk Violation: {risk_result.reason}")

        # 1. Create Order in DB
        new_order = Order(
            deployment_id=deployment_id,
            client_order_id=client_order_id,
            symbol=symbol,
            side=side,
            order_type=order_type,
            quantity=quantity,
            price=price,
            status=OrderStatus.PENDING
        )
        self.db.add(new_order)
        self.db.commit()
        self.db.refresh(new_order)

        # 2. Submit to Broker
        try:
            broker_order_id = self.broker.place_order(symbol, side, quantity, order_type, price)
            new_order.broker_order_id = broker_order_id
            new_order.status = OrderStatus.SUBMITTED
            self.db.commit()
        except Exception as e:
            new_order.status = OrderStatus.REJECTED
            new_order.tags = {"error": str(e)}
            self.db.commit()

        return new_order

    def update_order_status(self, client_order_id: str):
        order = self.db.query(Order).filter(Order.client_order_id == client_order_id).first()
        if not order or not order.broker_order_id:
            return

        broker_status = self.broker.get_order_status(order.broker_order_id)
        
        if broker_status == BrokerOrderStatus.COMPLETE:
            order.status = OrderStatus.FILLED
            order.filled_quantity = order.quantity
            # In a real scenario, we'd get the actual fill price from the broker
        elif broker_status == BrokerOrderStatus.CANCELLED:
            order.status = OrderStatus.CANCELLED
        elif broker_status == BrokerOrderStatus.REJECTED:
            order.status = OrderStatus.REJECTED

        self.db.commit()
        return order
