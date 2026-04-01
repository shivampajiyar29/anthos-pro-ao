# Strategy DSL Guide

This document describes the JSON-based Domain Specific Language (DSL) used to define trading strategies in the platform.

## Core Structure

A strategy is defined as a JSON object with the following top-level fields:

- `name`: (string) Unique name of the strategy.
- `instruments`: (list of strings) Symbols to monitor (e.g., `["NIFTY"]`).
- `timeframe`: (string) Candlestick interval (e.g., `"1m"`, `"5m"`).
- `legs`: (list of objects) The individual option or future legs.
- `entry_rules`: (list of objects) Conditions to trigger the strategy.
- `exit_rules`: (list of objects) Conditions to close the strategy.

## Leg Definition

Each leg in the `legs` list supports:

- `instrument_type`: `EQUITY`, `FUTURES`, `OPTIONS`.
- `side`: `BUY` or `SELL`.
- `option_type`: `CE` or `PE` (optional).
- `strike`: `ATM`, `ATM+100`, `ATM-100`, etc.
- `expiry`: `CURRENT_WEEK`, `NEXT_WEEK`, `MONTHLY`.
- `stop_loss_value`: (float) Value for stop loss.
- `stop_loss_type`: `PERCENT` or `POINTS`.

## Example: Short Straddle

```json
{
  "name": "Nifty Short Straddle",
  "instruments": ["NIFTY"],
  "legs": [
    {
      "instrument_type": "OPTIONS",
      "symbol": "NIFTY",
      "option_type": "CE",
      "strike": "ATM",
      "side": "SELL",
      "quantity": 50,
      "stop_loss_value": 25,
      "stop_loss_type": "PERCENT"
    },
    {
      "instrument_type": "OPTIONS",
      "symbol": "NIFTY",
      "option_type": "PE",
      "strike": "ATM",
      "side": "SELL",
      "quantity": 50,
      "stop_loss_value": 25,
      "stop_loss_type": "PERCENT"
    }
  ]
}
```
