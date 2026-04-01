from .schema import StrategyDSL
from pydantic import ValidationError

def validate_strategy(data: dict) -> StrategyDSL:
    """Validate a strategy JSON against the DSL schema."""
    try:
        return StrategyDSL.parse_obj(data)
    except ValidationError as e:
        raise ValueError(f"Invalid Strategy DSL: {e.json()}")

def get_example_straddle() -> dict:
    return {
        "name": "NIFTY Short Straddle",
        "description": "Short ATM Call and Put for NIFTY",
        "market": "NSE",
        "timeframe": "5m",
        "legs": [
            {
                "instrument_prefix": "NIFTY",
                "side": "SELL",
                "quantity": 50,
                "option_type": "CE",
                "strike_offset": 0,
                "exit_rule": {"stop_loss_pct": 20.0, "time_exit": "15:20"}
            },
            {
                "instrument_prefix": "NIFTY",
                "side": "SELL",
                "quantity": 50,
                "option_type": "PE",
                "strike_offset": 0,
                "exit_rule": {"stop_loss_pct": 20.0, "time_exit": "15:20"}
            }
        ],
        "risk_settings": {"max_drawdown": 0.02}
    }
