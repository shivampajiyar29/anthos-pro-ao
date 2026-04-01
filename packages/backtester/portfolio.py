from typing import List, Dict, Optional
import pandas as pd
from datetime import datetime
import enum

class Position:
    def __init__(self, symbol: str, quantity: int, avg_price: float):
        self.symbol = symbol
        self.quantity = quantity
        self.avg_price = avg_price
        self.current_price = avg_price
        self.unrealized_pnl = 0.0
        self.realized_pnl = 0.0

    def update_price(self, price: float):
        self.current_price = price
        self.unrealized_pnl = (self.current_price - self.avg_price) * self.quantity

class Portfolio:
    def __init__(self, initial_cash: float = 1000000.0):
        self.cash = initial_cash
        self.initial_cash = initial_cash
        self.positions: Dict[str, Position] = {}
        self.trades: List[Dict] = []
        self.equity_curve: List[Dict] = []

    def execute_trade(self, symbol: str, quantity: int, price: float, side: str, timestamp: datetime):
        # side: BUY or SELL
        # quantity: positive for Buy, positive for Sell (but side handles logic)
        
        cost = quantity * price
        
        if side == "BUY":
            self.cash -= cost
            if symbol in self.positions:
                pos = self.positions[symbol]
                new_total_qty = pos.quantity + quantity
                pos.avg_price = (pos.avg_price * pos.quantity + cost) / new_total_qty
                pos.quantity = new_total_qty
            else:
                self.positions[symbol] = Position(symbol, quantity, price)
        else: # SELL
            self.cash += cost
            if symbol in self.positions:
                pos = self.positions[symbol]
                # P&L calculation
                realized = (price - pos.avg_price) * quantity
                pos.realized_pnl += realized
                pos.quantity -= quantity
                if pos.quantity == 0:
                    del self.positions[symbol]
            else:
                # Short selling logic could go here
                self.positions[symbol] = Position(symbol, -quantity, price)

        self.trades.append({
            "timestamp": timestamp,
            "symbol": symbol,
            "quantity": quantity,
            "price": price,
            "side": side
        })

    def update_metrics(self, timestamp: datetime, current_prices: Dict[str, float]):
        total_unrealized = 0.0
        for symbol, pos in self.positions.items():
            if symbol in current_prices:
                pos.update_price(current_prices[symbol])
                total_unrealized += pos.unrealized_pnl
        
        total_equity = self.cash + total_unrealized
        self.equity_curve.append({
            "timestamp": timestamp,
            "equity": total_equity,
            "cash": self.cash
        })
