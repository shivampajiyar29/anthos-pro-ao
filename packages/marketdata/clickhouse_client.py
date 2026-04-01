import clickhouse_connect
import os

CLICKHOUSE_HOST = os.getenv("CLICKHOUSE_HOST", "localhost")
CLICKHOUSE_PORT = int(os.getenv("CLICKHOUSE_PORT", 8123))

class ClickHouseClient:
    def __init__(self):
        self.client = clickhouse_connect.get_client(
            host=CLICKHOUSE_HOST, 
            port=CLICKHOUSE_PORT
        )

    def init_schema(self):
        # Market Bars Table
        self.client.command("""
            CREATE TABLE IF NOT EXISTS market_bars (
                symbol String,
                timeframe String,
                timestamp DateTime,
                open Float64,
                high Float64,
                low Float64,
                close Float64,
                volume Int64
            ) ENGINE = MergeTree()
            ORDER BY (symbol, timeframe, timestamp)
        """)

        # Option Chain Snapshots Table
        self.client.command("""
            CREATE TABLE IF NOT EXISTS option_chain_snapshots (
                symbol String,
                timestamp DateTime,
                expiry Date,
                strike Float64,
                option_type Enum8('CE' = 1, 'PE' = 2),
                price Float64,
                iv Float64,
                oi Int64,
                vbs Float64, -- bid-ask spread or other vol metrics
                delta Float64,
                gamma Float64,
                theta Float64,
                vega Float64
            ) ENGINE = MergeTree()
            ORDER BY (symbol, timestamp, expiry, strike)
        """)

    def insert_bars(self, bars):
        self.client.insert('market_bars', bars, column_names=['symbol', 'timeframe', 'timestamp', 'open', 'high', 'low', 'close', 'volume'])

    def get_bars(self, symbol, timeframe, start_time, end_time):
        query = f"""
            SELECT * FROM market_bars 
            WHERE symbol = '{symbol}' 
            AND timeframe = '{timeframe}'
            AND timestamp >= '{start_time}' 
            AND timestamp <= '{end_time}'
            ORDER BY timestamp ASC
        """
        return self.client.query(query).result_rows

if __name__ == "__main__":
    client = ClickHouseClient()
    client.init_schema()
    print("ClickHouse schema initialized.")
