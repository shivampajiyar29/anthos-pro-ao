# Risk Engine Configuration

Athos Pro implements a strict multi-level risk enforcement layer.

## Risk Levels

1. **Pre-trade**: Checked before an order hits the broker gateway.
   - Insufficient margin
   - Max order quantity breaches
   - Daily loss limit already reached

2. **Post-trade**: Continuous monitoring of active positions.
   - Max portfolio exposure (notional)
   - Delta/Gamma concentration limits
   - Auto-liquidation thresholds

## Configuration Example
```python
limits = {
    "max_daily_loss": 50000,
    "max_order_quantity": 500,
    "max_total_notional": 10000000,
    "forbidden_symbols": ["GME", "AMC"]
}
```

## Emergency Stop
The system includes a Global Kill Switch. When triggered:
- All active deployments are paused.
- All open orders are cancelled.
- (Optional) All open positions are liquidated.
