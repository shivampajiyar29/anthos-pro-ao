import json
from .schema import StrategyDSL, validate_strategy

def get_sample_short_straddle():
    return {
        "name": "Nifty Short Straddle",
        "description": "Short ATM Call and Put at 9:20 AM",
        "instruments": ["NIFTY"],
        "timeframe": "1m",
        "legs": [
            {
                "instrument_type": "OPTIONS",
                "symbol": "NIFTY",
                "option_type": "CE",
                "strike": "ATM",
                "expiry": "CURRENT_WEEK",
                "side": "SELL",
                "quantity": 50,
                "order_type": "MARKET",
                "stop_loss_value": 20,
                "stop_loss_type": "PERCENT"
            },
            {
                "instrument_type": "OPTIONS",
                "symbol": "NIFTY",
                "option_type": "PE",
                "strike": "ATM",
                "expiry": "CURRENT_WEEK",
                "side": "SELL",
                "quantity": 50,
                "order_type": "MARKET",
                "stop_loss_value": 20,
                "stop_loss_type": "PERCENT"
            }
        ],
        "entry_rules": [
            {"condition": "time == '09:20:00'"}
        ],
        "exit_rules": [
            {"condition": "time == '15:15:00'"}
        ]
    }

if __name__ == "__main__":
    sample = get_sample_short_straddle()
    strategy, error = validate_strategy(sample)
    if error:
        print(f"Validation failed: {error}")
    else:
        print(f"Validation successful: {strategy.name}")
