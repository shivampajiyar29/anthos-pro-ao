from abc import ABC, abstractmethod
from typing import List, Dict, Optional
import enum

class BrokerOrderStatus(str, enum.Enum):
    COMPLETE = "COMPLETE"
    REJECTED = "REJECTED"
    CANCELLED = "CANCELLED"
    OPEN = "OPEN"

class BaseBroker(ABC):
    @abstractmethod
    def authenticate(self, credentials: Dict):
        pass

    @abstractmethod
    def place_order(self, symbol: str, side: str, quantity: int, order_type: str, price: Optional[float] = None) -> str:
        pass

    @abstractmethod
    def get_order_status(self, order_id: str) -> BrokerOrderStatus:
        pass

    @abstractmethod
    def get_positions(self) -> List[Dict]:
        pass

    @abstractmethod
    def get_margins(self) -> Dict:
        pass

    @abstractmethod
    def cancel_order(self, order_id: str):
        pass
