import random

class MatchingEngine:
    def __init__(self, slippage_model="linear", fee_model="standard"):
        self.slippage_model = slippage_model
        self.fee_model = fee_model

    def simulate_fill(self, order_type: str, side: str, price: float, quantity: float, bar: dict) -> dict:
        """
        Simulate a fill with slippage and realistic constraints.
        """
        fill_price = price
        
        if self.slippage_model == "linear":
            # Add 0.05% slippage
            slippage = fill_price * 0.0005
            fill_price = fill_price + slippage if side == "BUY" else fill_price - slippage

        # Simple random partial fill simulation (for testing)
        if random.random() < 0.1: # 10% chance of partial fill
            quantity = quantity * 0.5

        return {
            "price": fill_price,
            "quantity": quantity,
            "fees": self._calculate_fees(fill_price, quantity)
        }

    def _calculate_fees(self, price: float, quantity: float) -> float:
        # Standard brokerage + taxes (e.g., 0.03%)
        return price * quantity * 0.0003
