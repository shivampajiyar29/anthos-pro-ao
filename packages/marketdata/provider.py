from .clickhouse_client import ClickHouseClient
import pandas as pd

class DataProvider:
    def __init__(self):
        self.ch_client = ClickHouseClient()

    def get_historical_candles(self, symbol, timeframe, start_date, end_date):
        rows = self.ch_client.get_bars(symbol, timeframe, start_date, end_date)
        df = pd.DataFrame(rows, columns=['symbol', 'timeframe', 'timestamp', 'open', 'high', 'low', 'close', 'volume'])
        return df

    def get_option_chain(self, symbol, timestamp):
        # Placeholder for option chain retrieval
        pass
