# Strategy DSL Specification

The Athos Pro Strategy DSL is a JSON-based schema designed for multi-market algorithmic trading.

## Schema Overview

### Base Strategy
- `version`: DSL version (default: "1.0.0")
- `name`: Strategy identifier
- `legs`: List of execution legs
- `global_exit_time`: Portfolio-wide exit (e.g., "15:20")

### Leg Definition
- `instrument`: Selector object (symbol, exchange, type)
- `quantity`: Positive integer
- `direction`: "LONG" or "SHORT"
- `stop_loss`: Optional absolute or percentage value
- `target`: Optional profit target

### Example: Short Straddle
```json
{
  "name": "NIFTY Short Straddle",
  "legs": [
    {
      "instrument": {
        "symbol": "NIFTY24MAR19500CE",
        "exchange": "NFO",
        "instrument_type": "OPT"
      },
      "action": "SELL",
      "quantity": 50,
      "stop_loss": 0.2
    },
    {
      "instrument": {
        "symbol": "NIFTY24MAR19500PE",
        "exchange": "NFO",
        "instrument_type": "OPT"
      },
      "action": "SELL",
      "quantity": 50,
      "stop_loss": 0.2
    }
  ]
}
```
