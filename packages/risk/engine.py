import numpy as np
from datetime import datetime, time
from typing import Dict, List, Any, Optional

class RiskEngine:
    def __init__(self):
        # Configuration for rules - in production these would come from the database per user/deployment
        self.rules = {
            "max_daily_loss_pct": 2.0,
            "max_margin_usage_pct": 80.0,
            "max_open_positions": 10,
            "max_delta_limit": 5000,
            "max_gamma_limit": 1000,
            "max_vega_limit": 2000,
            "trading_start_time": time(9, 15),
            "trading_end_time": time(15, 30),
            "blocked_event_days": [] # e.g., ["2026-04-01"]
        }

    def validate_order(self, order: Dict[str, Any], portfolio: Dict[str, Any], account_metrics: Dict[str, Any]) -> Dict[str, Any]:
        """
        Validates an order against all configured risk rules.
        Returns {"valid": bool, "reason": str}
        """
        # 1. Trading Window Check
        now = datetime.now().time()
        if not (self.rules["trading_start_time"] <= now <= self.rules["trading_end_time"]):
            return {"valid": False, "reason": "Outside trading window (Market Closed)"}

        # 2. Blocked Days Check
        today_str = datetime.now().strftime("%Y-%m-%d")
        if today_str in self.rules["blocked_event_days"]:
            return {"valid": False, "reason": f"Trading blocked for event day: {today_str}"}

        # 3. Max Daily Loss Check
        daily_pnl_pct = account_metrics.get("daily_pnl_pct", 0)
        if daily_pnl_pct <= -self.rules["max_daily_loss_pct"]:
            return {"valid": False, "reason": "Max daily loss threshold breached"}

        # 4. Max Open Positions Check
        open_positions_count = len(portfolio.get("positions", []))
        if open_positions_count >= self.rules["max_open_positions"]:
            return {"valid": False, "reason": "Max open positions limit reached"}

        # 5. Margin Usage Check
        margin_used_pct = account_metrics.get("margin_used_pct", 0)
        if margin_used_pct >= self.rules["max_margin_usage_pct"]:
            return {"valid": False, "reason": "Insufficient margin / Max usage threshold reached"}

        # 6. Greeks Check (Optional for options)
        if "delta" in order:
            new_delta = account_metrics.get("total_delta", 0) + order["delta"]
            if abs(new_delta) > self.rules["max_delta_limit"]:
                return {"valid": False, "reason": "Max portfolio Delta limit exceeded"}

        return {"valid": True, "reason": "All risk checks passed"}

    def calculate_var(self, portfolio: Dict[str, float], confidence_level: float = 0.95) -> float:
        """
        Calculates Value at Risk (VaR) using Variance-Covariance approach.
        """
        volatilities = {"BTC-USD": 0.05, "NIFTY": 0.015, "BANKNIFTY": 0.02}
        portfolio_variance = 0.0
        total_value = sum(portfolio.values())
        if total_value == 0: return 0.0
        
        for symbol, value in portfolio.items():
            weight = value / total_value
            vol = volatilities.get(symbol, 0.02)
            portfolio_variance += (weight * vol) ** 2
            
        portfolio_std_dev = np.sqrt(portfolio_variance)
        z_score = 1.65 if confidence_level == 0.95 else 2.33
        return round(total_value * portfolio_std_dev * z_score, 2)

    def stress_test(self, portfolio: Dict[str, float]) -> Dict[str, float]:
        """
        Runs historical stress scenarios on the portfolio.
        """
        scenarios = {
            "Black_Monday_Mock": -0.20,
            "Flash_Crash_Mock": -0.10,
            "Vol_Spike_Mock": -0.05
        }
        return {name: round(sum(portfolio.values()) * shock, 2) for name, shock in scenarios.items()}

risk_engine = RiskEngine()
