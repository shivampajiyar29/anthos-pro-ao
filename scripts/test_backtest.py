import asyncio
from datetime import datetime, timedelta
import pandas as pd
from unittest.mock import MagicMock

from packages.backtester.engine import BacktestEngine
from packages.strategy_dsl.schema import StrategyDSL, Leg, InstrumentSelector
from packages.marketdata.provider import DataProvider

async def run_test():
    print("🚀 Starting Backtest Engine Verification...")

    # 1. Create a mock Strategy DSL
    dsl = StrategyDSL(
        name="Test BTC Strategy",
        timeframe="1m",
        legs=[
            Leg(
                instrument=InstrumentSelector(exchange="BINANCE", symbol="BTCUSDT", instrument_type="CRYPTO"),
                quantity=1,
                direction="LONG",
                stop_loss=49000,
                target=50500
            )
        ],
        risk_settings={"initial_capital": 100000.0}
    )

    # 2. Mock DataProvider
    mock_provider = MagicMock(spec=DataProvider)
    
    # Generate some mock bars
    now = datetime.now()
    bars_data = []
    base_price = 50000.0
    for i in range(60):
        price = base_price + (i * 10) # Price goes up slowly
        bars_data.append({
            "timestamp": now + timedelta(minutes=i),
            "open": price,
            "high": price + 5,
            "low": price - 5,
            "close": price,
            "volume": 100
        })
    mock_provider.get_bars.return_value = pd.DataFrame(bars_data)

    # 3. Initialize and run engine
    engine = BacktestEngine(dsl, mock_provider)
    results = engine.run(now, now + timedelta(hours=1))

    # 4. Assertions
    print(f"Results: {results['status']}")
    print(f"Total Trades: {results['total_trades']}")
    print(f"Final Equity: {results['final_equity']}")
    print(f"Net PnL: {results['net_pnl']}")

    if results['total_trades'] > 0:
        print("✅ Backtest Engine is functional!")
    else:
        print("❌ No trades executed. Check logic.")

if __name__ == "__main__":
    asyncio.run(run_test())
