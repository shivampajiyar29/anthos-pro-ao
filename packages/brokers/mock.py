from .base import BaseBroker, BrokerOrderStatus
from typing import List, Dict, Optional
import uuid
import datetime

class MockBroker(BaseBroker):
    def __init__(self):
        self.orders = {}
        self.positions = []
        self.margins = {"available": 1000000.0, "used": 0.0}

    def authenticate(self, credentials: Dict):
        return True

    def place_order(self, symbol: str, side: str, quantity: int, order_type: str, price: Optional[float] = None) -> str:
        order_id = str(uuid.uuid4())
        self.orders[order_id] = {
            "order_id": order_id,
            "symbol": symbol,
            "side": side,
            "quantity": quantity,
            "status": BrokerOrderStatus.COMPLETE, # Auto-fill in mock
            "price": price or 100.0,
            "timestamp": datetime.datetime.now()
        }
        return order_id

    def get_order_status(self, order_id: str) -> BrokerOrderStatus:
        return self.orders.get(order_id, {}).get("status", BrokerOrderStatus.REJECTED)

    def get_positions(self) -> List[Dict]:
        return self.positions

    def get_margins(self) -> Dict:
        return self.margins

    def cancel_order(self, order_id: str):
        if order_id in self.orders:
            self.orders[order_id]["status"] = BrokerOrderStatus.CANCELLED
