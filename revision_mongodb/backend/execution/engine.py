import os
from agents.sentinel import sentinel

class ExecutionEngine:
    """
    Translates decisions into broker-specific orders.
    Validates with Sentinel before execution.
    """
    def __init__(self):
        self.mode = "PAPER" # "PAPER" or "LIVE"

    async def execute_trade(self, trade_signal: dict, portfolio: dict):
        # 1. Risk Check
        if not await sentinel.validate_trade(trade_signal, portfolio):
            return {"status": "REJECTED", "reason": "Risk limits exceeded"}

        # 2. Check Paper/Live mode
        if self.mode == "PAPER":
            return await self._execute_simulated(trade_signal)

        # 3. Execute based on broker (LIVE)
        market = trade_signal.get("market", "US")
        if market == "US":
            return await self._execute_alpaca(trade_signal)
        elif market == "IN":
            return await self._execute_upstox(trade_signal)
        
        return {"status": "ERROR", "reason": "Unknown market"}

    async def _execute_alpaca(self, trade_signal: dict):
        # Simulated Alpaca Execution
        return {"status": "EXECUTED", "id": "alp-123", "broker": "Alpaca"}

    async def _execute_upstox(self, trade_signal: dict):
        # Simulated Upstox Execution
        return {"status": "EXECUTED", "id": "up-456", "broker": "Upstox"}

    async def _execute_simulated(self, trade_signal: dict):
        # Universal Simulated Execution for PAPER mode
        import random
        fill_id = f"sim-{random.randint(1000, 9999)}"
        return {
            "status": "EXECUTED",
            "id": fill_id,
            "broker": "SIMULATED",
            "mode": "PAPER",
            "timestamp": trade_signal.get("timestamp")
        }

execution_engine = ExecutionEngine()
