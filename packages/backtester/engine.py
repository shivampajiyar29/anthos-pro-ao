import numpy as np
import pandas as pd
from typing import Dict, List, Any
from .portfolio import Portfolio
from packages.strategy_dsl.schema import StrategyDSL
from packages.marketdata.provider import DataProvider
from datetime import datetime

class BacktestEngine:
    def __init__(self, strategy: StrategyDSL, config: Dict):
        self.strategy = strategy
        self.config = config
        self.portfolio = Portfolio(initial_cash=config.get("initial_cash", 1000000.0))
        self.data_provider = DataProvider()
        self.slippage_pct = config.get("slippage_pct", 0.05) # 0.05% per side
        self.brokerage = config.get("brokerage", 20.0) # per order

    def run(self, start_date: str, end_date: str):
        # 1. Fetch underlyings data
        underlying = self.strategy.instruments[0]
        candles = self.data_provider.get_historical_candles(
            underlying, self.strategy.timeframe, start_date, end_date
        )
        
        if candles.empty:
            return {"error": "No market data found for range"}

        # 2. Main Loop
        for _, row in candles.iterrows():
            ts = row['timestamp']
            price = row['close']
            
            # Simplified Signal Logic (Placeholder)
            # In real system, this evaluates self.strategy.entry_rules
            is_entry_time = ts.time().strftime("%H:%M") == self.strategy.start_time[:5]
            is_exit_time = ts.time().strftime("%H:%M") == self.strategy.square_off_time[:5]

            if is_entry_time and not self.portfolio.positions:
                for leg in self.strategy.legs:
                    # If leg is OPTIONS, we'd find the strike here
                    fill_price = price * (1 + self.slippage_pct/100) if leg.side == 'BUY' else price * (1 - self.slippage_pct/100)
                    self.portfolio.execute_trade(
                        symbol=leg.symbol,
                        quantity=leg.quantity,
                        price=fill_price,
                        side=leg.side,
                        timestamp=ts
                    )
                    self.portfolio.cash -= self.brokerage # Deduct fixed brokerage

            if is_exit_time and self.portfolio.positions:
                for symbol, pos in list(self.portfolio.positions.items()):
                    fill_price = price * (1 - self.slippage_pct/100) if pos.quantity > 0 else price * (1 + self.slippage_pct/100)
                    self.portfolio.execute_trade(
                        symbol=symbol,
                        quantity=abs(pos.quantity),
                        price=fill_price,
                        side='SELL' if pos.quantity > 0 else 'BUY',
                        timestamp=ts
                    )
                    self.portfolio.cash -= self.brokerage

            self.portfolio.update_metrics(ts, {underlying: price})

        return self.calculate_performance_metrics()

    def calculate_performance_metrics(self):
        df = pd.DataFrame(self.portfolio.equity_curve)
        if df.empty: return {"status": "no_trades"}

        df['returns'] = df['equity'].pct_change()
        
        total_return = (df['equity'].iloc[-1] / self.portfolio.initial_cash) - 1
        sharpe = (df['returns'].mean() / df['returns'].std()) * np.sqrt(252 * 375) if len(df) > 1 else 0 # Annualized
        
        # Max Drawdown
        df['cum_max'] = df['equity'].cummax()
        df['drawdown'] = (df['equity'] - df['cum_max']) / df['cum_max']
        max_dd = df['drawdown'].min()

        return {
            "total_pnl": df['equity'].iloc[-1] - self.portfolio.initial_cash,
            "return_pct": total_return * 100,
            "sharpe_ratio": round(sharpe, 2),
            "max_drawdown": round(max_dd * 100, 2),
            "trades_count": len(self.portfolio.trades),
            "win_rate": self._calculate_win_rate(),
            "equity_curve": self.portfolio.equity_curve
        }

    def _calculate_win_rate(self):
        if not self.portfolio.trades: return 0
        # Group buy/sell pairs to find single trade P&Ls
        # Simplified: check for finalized realized P&Ls in position history
        return 0.65 # Placeholder
