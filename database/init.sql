CREATE TABLE IF NOT EXISTS trades (
    id SERIAL PRIMARY KEY,
    symbol VARCHAR(20) NOT NULL,
    price DECIMAL(18, 8) NOT NULL,
    quantity DECIMAL(18, 8) NOT NULL,
    side VARCHAR(4) NOT NULL, -- BUY or SELL
    agent_id VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS agent_performance (
    agent_name VARCHAR(50) NOT NULL,
    cycle_id UUID NOT NULL,
    pnl DECIMAL(18, 8) DEFAULT 0,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- TimescaleDB specific optimization (if extension exists)
-- SELECT create_hypertable('trades', 'timestamp');
