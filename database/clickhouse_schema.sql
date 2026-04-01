-- ClickHouse Schema for High-Volume Market Data

-- 1. Market Bars (OHLCV)
CREATE TABLE IF NOT EXISTS market_bars (
    symbol String,
    exchange String,
    timeframe String,
    timestamp DateTime64(3, 'UTC'),
    open Float64,
    high Float64,
    low Float64,
    close Float64,
    volume Float64,
    instrument_type Enum8('EQUITY'=1, 'FUTURE'=2, 'OPTION'=3, 'CRYPTO'=4)
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (exchange, symbol, timeframe, timestamp);

-- 2. Option Chain Snapshots
CREATE TABLE IF NOT EXISTS option_chain_snapshots (
    underlying String,
    timestamp DateTime64(3, 'UTC'),
    expiry DateTime,
    strike Float64,
    option_type Enum8('CE'=1, 'PE'=2),
    last_price Float64,
    bid_price Float64,
    ask_price Float64,
    open_interest UInt64,
    volume UInt64,
    implied_volatility Float64,
    delta Float64,
    gamma Float64,
    theta Float64,
    vega Float64
) ENGINE = MergeTree()
PARTITION BY toDate(timestamp)
ORDER BY (underlying, expiry, timestamp, strike);

-- 3. Execution Logs (Analytic)
CREATE TABLE IF NOT EXISTS execution_logs (
    deployment_id String,
    strategy_id String,
    timestamp DateTime64(3, 'UTC'),
    level Enum8('INFO'=1, 'WARN'=2, 'ERROR'=3),
    message String,
    metadata String -- JSON string
) ENGINE = MergeTree()
PARTITION BY toDate(timestamp)
ORDER BY (deployment_id, timestamp);
