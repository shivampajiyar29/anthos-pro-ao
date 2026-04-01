import time
from prometheus_client import Counter, Histogram, Gauge, generate_latest, CONTENT_TYPE_LATEST
from fastapi import Response

# Define shared metrics
TRADES_TOTAL = Counter('athos_trades_total', 'Total number of trades executed', ['exchange', 'symbol', 'side'])
BACKTEST_LATENCY = Histogram('athos_backtest_duration_seconds', 'Time spent running backtests')
ACTIVE_DEPLOYMENTS = Gauge('athos_active_deployments', 'Number of currently running strategies')

def get_metrics_response():
    return Response(content=generate_latest(), media_type=CONTENT_TYPE_LATEST)

class MetricsMiddleware:
    """Simple middleware to track request counts and latencies (optional)"""
    pass
