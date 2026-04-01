import pandas as pd
import clickhouse_connect
from datetime import datetime
from packages.common.config import settings
from packages.common.logging import get_logger

logger = get_logger("marketdata.ingestor")

class ClickHouseIngestor:
    def __init__(self):
        self.client = clickhouse_connect.get_client(
            host=settings.CLICKHOUSE_HOST,
            port=settings.CLICKHOUSE_PORT,
            username=settings.CLICKHOUSE_USER,
            password=settings.CLICKHOUSE_PASSWORD,
            database=settings.CLICKHOUSE_DB
        )

    def ingest_bars(self, df: pd.DataFrame, exchange: str, instrument_type: str):
        """
        Ingest OHLCV bars from a pandas DataFrame.
        Expected columns: [symbol, timeframe, timestamp, open, high, low, close, volume]
        """
        df['exchange'] = exchange
        df['instrument_type'] = instrument_type
        
        # Ensure timestamp is datetime64
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        
        self.client.insert_df('market_bars', df)
        logger.info(f"Ingested {len(df)} bars for {exchange}")

    def ingest_option_chain(self, df: pd.DataFrame, underlying: str):
        """
        Ingest option chain snapshots.
        """
        df['underlying'] = underlying
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        
        self.client.insert_df('option_chain_snapshots', df)
        logger.info(f"Ingested {len(df)} option snapshots for {underlying}")
