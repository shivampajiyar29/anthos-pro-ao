from celery import Celery
import os

redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")
app = Celery('trading_worker', broker=redis_url, backend=redis_url)

@app.task(name="apps.api.worker.run_backtest_task")
def run_backtest_task(config: dict):
    # This would import the BacktestEngine and run it
    print(f"Running backtest with config: {config}")
    return {"status": "success", "pnl": 1250.0}
