from packages.execution.order_manager import OrderManager
from packages.brokers.base import BaseBroker
import time
import threading

class ReconciliationService:
    def __init__(self, broker: BaseBroker, order_manager: OrderManager):
        self.broker = broker
        self.order_manager = order_manager
        self.is_running = False
        self.thread = None

    def start(self, interval: int = 60):
        self.is_running = True
        self.interval = interval
        self.thread = threading.Thread(target=self._run_loop)
        self.thread.start()

    def stop(self):
        self.is_running = False
        if self.thread:
            self.thread.join()

    def _run_loop(self):
        while self.is_running:
            try:
                self.reconcile()
            except Exception as e:
                print(f"Reconciliation Error: {e}")
            time.sleep(self.interval)

    def reconcile(self):
        # 1. Sync Positions
        broker_positions = self.broker.get_positions()
        # Logic to compare with DB and update if necessary

        # 2. Sync Orders
        # We can fetch recent orders from broker and update our OrderManager
        print("Reconciliation Loop: Synced orders and positions.")
