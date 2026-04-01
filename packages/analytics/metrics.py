import pandas as pd
import numpy as np

def calculate_sharpe_ratio(equity_curve, risk_free_rate=0.05):
    # equity_curve should be a list of daily equity values
    equity_df = pd.DataFrame(equity_curve)
    equity_df['returns'] = equity_df['equity'].pct_change()
    
    # Yearly returns
    avg_annual_return = equity_df['returns'].mean() * 252 # Trading days
    annual_std_dev = equity_df['returns'].std() * np.sqrt(252)
    
    if annual_std_dev == 0:
        return 0.0
        
    return (avg_annual_return - risk_free_rate) / annual_std_dev

def calculate_max_drawdown(equity_curve):
    equity_df = pd.DataFrame(equity_curve)
    equity_df['peak'] = equity_df['equity'].cummax()
    equity_df['drawdown'] = (equity_df['equity'] - equity_df['peak']) / equity_df['peak']
    return equity_df['drawdown'].min()

def get_performance_report(equity_curve):
    return {
        "sharpe_ratio": calculate_sharpe_ratio(equity_curve),
        "max_drawdown": calculate_max_drawdown(equity_curve),
        "total_return": (equity_curve[-1]['equity'] - equity_curve[0]['equity']) / equity_curve[0]['equity'] * 100
    }
