from pydantic import BaseModel, Field, validator
from typing import List, Optional, Union, Dict
import enum

class InstrumentType(str, enum.Enum):
    EQUITY = "EQUITY"
    FUTURES = "FUTURES"
    OPTIONS = "OPTIONS"
    INDEX = "INDEX"

class OptionType(str, enum.Enum):
    CE = "CE"
    PE = "PE"

class OrderType(str, enum.Enum):
    MARKET = "MARKET"
    LIMIT = "LIMIT"
    SL_MARKET = "SL-M"
    SL_LIMIT = "SL-L"

class Side(str, enum.Enum):
    BUY = "BUY"
    SELL = "SELL"

class Leg(BaseModel):
    instrument_type: InstrumentType
    symbol: str
    option_type: Optional[OptionType] = None
    strike: Optional[str] = "ATM" # ATM, ATM+100, etc.
    expiry: Optional[str] = "CURRENT_WEEK" # CURRENT_WEEK, NEXT_WEEK, etc.
    side: Side
    quantity: int
    order_type: OrderType = OrderType.MARKET
    entry_price: Optional[float] = None
    stop_loss_value: Optional[float] = None
    stop_loss_type: Optional[str] = "PERCENT" # PERCENT, POINTS
    target_value: Optional[float] = None
    target_type: Optional[str] = "PERCENT" # PERCENT, POINTS
    trailing_sl: Optional[Dict] = None # {"points": 10, "step": 10}

class EntryExitRule(BaseModel):
    condition: str # e.g., "price > sma(20)"
    indicator_params: Optional[Dict] = None

class StrategyDSL(BaseModel):
    name: str
    description: Optional[str] = ""
    instruments: List[str]
    timeframe: str = "1m"
    legs: List[Leg]
    entry_rules: List[EntryExitRule]
    exit_rules: List[EntryExitRule]
    start_time: str = "09:20:00"
    end_time: str = "15:20:00"
    square_off_time: str = "15:25:00"
    risk_settings: Optional[Dict] = None

def validate_strategy(dsl_json: Dict):
    """
    Validates the strategy DSL JSON.
    """
    try:
        strategy = StrategyDSL(**dsl_json)
        return strategy, None
    except Exception as e:
        return None, str(e)
