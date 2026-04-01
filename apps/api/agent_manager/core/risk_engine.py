import numpy as np
import pandas as pd
from typing import Dict, List

class RiskEngine:
    def __init__(self):
        # In a real app, this would connect to TimescaleDB
        pass

    def calculate_var(self, portfolio: Dict[str, float], confidence_level: float = 0.95) -> float:
        """
        Calculates Value at Risk (VaR) using Variance-Covariance approach (simplified).
        Returns the potential loss amount.
        """
        # 1. Mock volatility data (Standard Deviation of daily returns)
        volatilities = {
            "AAPL": 0.02,
            "BTC-USD": 0.05,
            "SPY": 0.012,
            "RELIANCE.NS": 0.018
        }
        
        # 2. Calculate Portfolio Variance
        # Var(P) = sum(weight_i^2 * vol_i^2) + sum(2 * w_i * w_j * cov_ij)
        # Simplified: Assuming zero correlation (conservative for disjoint assets, risky for correlated)
        portfolio_variance = 0.0
        total_value = sum(portfolio.values())
        
        if total_value == 0:
            return 0.0

        for symbol, value in portfolio.items():
            weight = value / total_value
            vol = volatilities.get(symbol, 0.03) # Default 3% vol
            portfolio_variance += (weight * vol) ** 2
            
        portfolio_std_dev = np.sqrt(portfolio_variance)
        
        # 3. Z-Score for Confidence
        # 95% -> 1.65, 99% -> 2.33
        z_score = 1.65 if confidence_level == 0.95 else 2.33
        
        # VaR = Value * Volatility * Z-Score
        var_amount = total_value * portfolio_std_dev * z_score
        return round(var_amount, 2)

    def stress_test(self, portfolio: Dict[str, float]) -> Dict[str, float]:
        """
        Runs historical stress scenarios on the portfolio.
        """
        scenarios = {
            "2008_Financial_Crisis": {"equity": -0.40, "crypto": -0.10}, # Crypto didn't exist, minor arbitrary
            "COVID_Crash_2020": {"equity": -0.34, "crypto": -0.50},
            "Crypto_Winter_2022": {"equity": -0.15, "crypto": -0.75}
        }
        
        results = {}
        for scenario_name, shocks in scenarios.items():
            loss = 0.0
            for symbol, value in portfolio.items():
                if "BTC" in symbol or "ETH" in symbol:
                    loss += value * shocks["crypto"]
                else:
                    loss += value * shocks["equity"]
            results[scenario_name] = round(loss, 2)
            
        return results

# Singleton instance
risk_engine = RiskEngine()
