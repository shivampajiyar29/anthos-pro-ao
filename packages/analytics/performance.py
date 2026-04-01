import numpy as np
import pandas as pd
from typing import List, Dict

def calculate_performance_metrics(trades: List[Dict], equity_curve: List[float]) -> Dict:
    """
    Calculate advanced performance metrics for a backtest.
    """
    if not trades or not equity_curve:
        return {}

    returns = pd.Series(equity_curve).pct_change().dropna()
    
    # Basic Metrics
    total_pnl = sum(t['pnl'] for t in trades)
    win_trades = [t for t in trades if t['pnl'] > 0]
    win_rate = len(win_trades) / len(trades)
    
    # Risk Metrics
    sharpe_ratio = (returns.mean() / returns.std()) * np.sqrt(252) if returns.std() != 0 else 0
    
    # Drawdown
    equity_series = pd.Series(equity_curve)
    max_drawdown = (equity_series.cummax() - equity_series).max()
    max_drawdown_pct = ((equity_series.cummax() - equity_series) / equity_series.cummax()).max()

    return {
        "net_pnl": round(total_pnl, 2),
        "win_rate": round(win_rate * 100, 2),
        "sharpe_ratio": round(float(sharpe_ratio), 2),
        "max_drawdown": round(max_drawdown, 2),
        "max_drawdown_pct": round(max_drawdown_pct * 100, 2),
        "total_trades": len(trades),
        "profit_factor": round(_calculate_profit_factor(trades), 2)
    }

def _calculate_profit_factor(trades: List[Dict]) -> float:
    gross_profits = sum(t['pnl'] for t in trades if t['pnl'] > 0)
    gross_losses = abs(sum(t['pnl'] for t in trades if t['pnl'] < 0))
    return gross_profits / gross_losses if gross_losses != 0 else 0
