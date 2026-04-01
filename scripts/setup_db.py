import clickhouse_connect
from packages.common.config import settings
from packages.core.database import engine
from packages.core.models import Base

def setup_postgres():
    print("🐘 Initializing PostgreSQL...")
    Base.metadata.create_all(engine)
    print("✅ PostgreSQL Scaled & Ready")

def setup_clickhouse():
    print("🏠 Initializing ClickHouse...")
    client = clickhouse_connect.get_client(
        host=settings.CLICKHOUSE_HOST,
        port=settings.CLICKHOUSE_PORT,
        username=settings.CLICKHOUSE_USER,
        database=settings.CLICKHOUSE_DB
    )
    
    # Create Database
    client.command(f"CREATE DATABASE IF NOT EXISTS {settings.CLICKHOUSE_DB}")
    
    # Create market_bars table
    client.command(f"""
    CREATE TABLE IF NOT EXISTS {settings.CLICKHOUSE_DB}.market_bars (
        symbol String,
        timeframe String,
        timestamp DateTime,
        open Float64,
        high Float64,
        low Float64,
        close Float64,
        volume Float64
    ) ENGINE = MergeTree()
    ORDER BY (symbol, timeframe, timestamp)
    """)
    
    # Create option_chain_snapshots table
    client.command(f"""
    CREATE TABLE IF NOT EXISTS {settings.CLICKHOUSE_DB}.option_chain_snapshots (
        underlying String,
        timestamp DateTime,
        expiry DateTime,
        strike Float64,
        option_type Enum8('CE' = 1, 'PE' = 2),
        bid Float64,
        ask Float64,
        last_price Float64,
        oi Int64,
        iv Float64,
        delta Float64,
        gamma Float64,
        theta Float64,
        vega Float64
    ) ENGINE = MergeTree()
    ORDER BY (underlying, timestamp, expiry, strike)
    """)
    
    print("✅ ClickHouse Clusters & Tables Ready")

if __name__ == "__main__":
    setup_postgres()
    setup_clickhouse()
