from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey, JSON, Enum, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import datetime
import enum

Base = declarative_base()

class OrderStatus(str, enum.Enum):
    PENDING = "PENDING"
    SUBMITTED = "SUBMITTED"
    OPEN = "OPEN"
    FILLED = "FILLED"
    CANCELLED = "CANCELLED"
    REJECTED = "REJECTED"

class OrderSide(str, enum.Enum):
    BUY = "BUY"
    SELL = "SELL"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class BrokerAccount(Base):
    __tablename__ = "broker_accounts"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    broker_name = Column(String)  # e.g., "ZERODHA", "ANGEL_ONE"
    encrypted_credentials = Column(JSON)
    is_active = Column(Boolean, default=True)
    
    user = relationship("User")

class Strategy(Base):
    __tablename__ = "strategies"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String, index=True)
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    is_active = Column(Boolean, default=True)
    
    user = relationship("User")
    versions = relationship("StrategyVersion", back_populates="strategy")

class StrategyVersion(Base):
    __tablename__ = "strategy_versions"
    id = Column(Integer, primary_key=True, index=True)
    strategy_id = Column(Integer, ForeignKey("strategies.id"))
    version_number = Column(Integer)
    dsl_content = Column(JSON)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    strategy = relationship("Strategy", back_populates="versions")

class BacktestRun(Base):
    __tablename__ = "backtest_runs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    strategy_version_id = Column(Integer, ForeignKey("strategy_versions.id"))
    status = Column(String)  # PENDING, RUNNING, COMPLETED, FAILED
    config = Column(JSON)
    metrics = Column(JSON)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    user = relationship("User")
    strategy_version = relationship("StrategyVersion")

class Deployment(Base):
    __tablename__ = "deployments"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    strategy_version_id = Column(Integer, ForeignKey("strategy_versions.id"))
    broker_account_id = Column(Integer, ForeignKey("broker_accounts.id"))
    mode = Column(String)  # PAPER, LIVE
    status = Column(String)  # ACTIVE, PAUSED, STOPPED
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    user = relationship("User")
    strategy_version = relationship("StrategyVersion")
    broker_account = relationship("BrokerAccount")

class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    deployment_id = Column(Integer, ForeignKey("deployments.id"), nullable=True)
    backtest_run_id = Column(Integer, ForeignKey("backtest_runs.id"), nullable=True)
    broker_order_id = Column(String, index=True, nullable=True)
    client_order_id = Column(String, unique=True, index=True)
    instrument_token = Column(String)
    symbol = Column(String)
    side = Column(Enum(OrderSide))
    order_type = Column(String)  # MARKET, LIMIT, SL-M, SL-L
    quantity = Column(Integer)
    filled_quantity = Column(Integer, default=0)
    price = Column(Float, nullable=True)
    avg_price = Column(Float, nullable=True)
    status = Column(Enum(OrderStatus), default=OrderStatus.PENDING)
    tags = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
class Fill(Base):
    __tablename__ = "fills"
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    broker_fill_id = Column(String, index=True)
    quantity = Column(Integer)
    price = Column(Float)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    
    order = relationship("Order")

class Position(Base):
    __tablename__ = "positions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    broker_account_id = Column(Integer, ForeignKey("broker_accounts.id"))
    symbol = Column(String)
    quantity = Column(Integer)
    avg_price = Column(Float)
    unrealized_pnl = Column(Float, default=0.0)
    realized_pnl = Column(Float, default=0.0)
    last_updated = Column(DateTime, default=datetime.datetime.utcnow)
    
    user = relationship("User")
    broker_account = relationship("BrokerAccount")

class RiskRule(Base):
    __tablename__ = "risk_rules"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    rule_type = Column(String) # MAX_DAILY_LOSS, MAX_SLIPPAGE, etc.
    scope = Column(String) # ACCOUNT, STRATEGY, PORTFOLIO
    scope_id = Column(Integer, nullable=True)
    parameters = Column(JSON)
    action = Column(String) # LOG, BLOCK, LIQUIDATE
    is_active = Column(Boolean, default=True)
    
    user = relationship("User")

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    type = Column(String) # INFO, WARNING, ERROR, RISK_BREACH
    title = Column(String)
    message = Column(Text)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    user = relationship("User")

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    action = Column(String)
    entity_type = Column(String) # ORDER, STRATEGY, USER
    entity_id = Column(Integer, nullable=True)
    changes = Column(JSON, nullable=True)
    ip_address = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    
    user = relationship("User")

class Instrument(Base):
    __tablename__ = "instruments"
    id = Column(Integer, primary_key=True, index=True)
    exchange_token = Column(String, unique=True, index=True)
    tradingsymbol = Column(String, index=True)
    name = Column(String)
    exchange = Column(String) # NSE, BSE, NFO, MCX
    instrument_type = Column(String) # EQ, FUT, OPT
    tick_size = Column(Float)
    lot_size = Column(Integer)
    expiry = Column(DateTime, nullable=True)
    strike = Column(Float, nullable=True)
    option_type = Column(String, nullable=True) # CE, PE

class OptionContract(Base):
    __tablename__ = "option_contracts"
    id = Column(Integer, primary_key=True, index=True)
    underlying_symbol = Column(String, index=True)
    instrument_token = Column(String, index=True)
    strike = Column(Float)
    option_type = Column(String) # CE, PE
    expiry = Column(DateTime)
    lot_size = Column(Integer)
