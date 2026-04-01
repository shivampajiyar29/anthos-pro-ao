import numpy as np
import pandas as pd
from typing import List, Dict

class StrategySimulator:
    @staticmethod
    def monte_carlo(returns: pd.Series, n_sims: int = 1000, n_days: int = 252) -> Dict[str, Any]:
        """
        Run Monte Carlo simulations based on historical returns distribution.
        """
        if returns.empty:
            return {}

        # Resample returns
        sim_results = []
        for _ in range(n_sims):
            samples = np.random.choice(returns, size=n_days, replace=True)
            equity_path = (1 + samples).cumprod()
            sim_results.append(equity_path[-1])
            
        sim_results = np.array(sim_results)
        
        return {
            "mean_final_equity": float(np.mean(sim_results)),
            "median_final_equity": float(np.median(sim_results)),
            "vaR_95": float(np.percentile(sim_results, 5)), # Value at Risk
            "cVaR_95": float(np.mean(sim_results[sim_results <= np.percentile(sim_results, 5)]))
        }
