class SymbolMapper:
    """
    Unified Symbol Mapping: Converts internal symbols to broker-specific symbols.
    Example: RELIANCE -> RELIANCE (Upstox), RELIANCE.NS (Yahoo), etc.
    """
    MAPPING = {
        "AAPL": {"US": "AAPL", "IN": "AAPL.ADR", "CRYPTO": None},
        "RELIANCE": {"US": "RLNIY", "IN": "NSE_EQ|INE002A01018", "CRYPTO": None},
        "BTC": {"US": "BITO", "IN": None, "CRYPTO": "BTC/USDT"},
    }

    @classmethod
    def resolve(cls, symbol: str, market: str) -> str:
        symbol_data = cls.MAPPING.get(symbol.upper())
        if not symbol_data:
            return symbol
        return symbol_data.get(market.upper(), symbol)

symbol_mapper = SymbolMapper()
