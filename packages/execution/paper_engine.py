from typing import List, Dict
from packages.execution.order_manager import OrderManager
from packages.strategy_dsl.schema import StrategyDSL
from packages.marketdata.provider import DataProvider
import time
import threading

class PaperEngine:
    def __init__(self, strategy: StrategyDSL, order_manager: OrderManager, data_provider: DataProvider):
        self.strategy = strategy
        self.order_manager = order_manager
        self.data_provider = data_provider
        self.is_running = False
        self.thread = None

    def start(self, deployment_id: int):
        self.is_running = True
        self.deployment_id = deployment_id
        self.thread = threading.Thread(target=self._run_loop)
        self.thread.start()

    def stop(self):
        self.is_running = False
        if self.thread:
            self.thread.join()

    def _run_loop(self):
        print(f"Starting Paper Engine for Deployment {self.deployment_id}")
        while self.is_running:
            # 1. Fetch "Current" Price (Mocking live feed for now)
            # In a real scenario, this would be a WebSocket subscription
            current_time = time.strftime("%H:%M:%S")
            
            # Simple Trigger Logic: Match 9:20 AM entry
            if current_time == "09:20:00":
                for leg in self.strategy.legs:
                    print(f"Placing Leg Order: {leg.symbol}")
                    self.order_manager.place_order(
                        deployment_id=self.deployment_id,
                        symbol=leg.symbol,
                        side=leg.side,
                        quantity=leg.quantity,
                        order_type="MARKET"
                    )
            
            # 2. Update Order Statuses
            # In a real scenario, we'd iterate through open orders for this deployment
            # For mock, we'll just check everything
            # (In-memory map or DB query)
            
            time.sleep(1) # Sleep for 1 second for the next tick
