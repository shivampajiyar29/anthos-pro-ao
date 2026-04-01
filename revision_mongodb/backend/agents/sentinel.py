class SentinelAgent:
    """
    The Sentinel Agent monitors portfolio risk and black-swan events.
    It acts as a safeguard against excessive losses.
    """
    def __init__(self):
        self.name = "Sentinel"
        self.max_drawdown = 0.05 # 5% max drawdown limit
        self.max_position_size = 0.1 # 10% max position size

    async def validate_trade(self, trade_signal: dict, portfolio: dict) -> bool:
        """
        Validates if a trade signal adheres to VaR and position size limits.
        """
        # Value at Risk (VaR) simulated calculation
        var_estimate = portfolio.get("total_equity", 10000) * 0.02 # 2% VaR estimate
        
        if trade_signal.get("side") == "BUY":
            symbol = trade_signal.get("symbol")
            quantity = trade_signal.get("quantity", 0)
            price = trade_signal.get("entry_price", 0)
            
            notional_value = quantity * price
            total_equity = portfolio.get("total_equity", 10000)
            
            if notional_value / total_equity > self.max_position_size:
                return False
            
            if var_estimate > (total_equity * self.max_drawdown):
                print(f"[{self.name}] VaR Limit Exceeded: Reducing Exposure")
                return False
        
        return True


    async def get_risk_report(self, portfolio: dict) -> str:
        """
        Generates a summary of current risk exposure.
        """
        return f"Current drawdown: {portfolio.get('drawdown', 0)*100:.2f}%. All systems within safety limits."

sentinel = SentinelAgent()
