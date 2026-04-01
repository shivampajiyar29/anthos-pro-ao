import yfinance as yf
import json

def test_fetch(symbol, period='5d', interval='1m'):
    try:
        print(f"Fetching {symbol} ({period}, {interval})...")
        ticker = yf.Ticker(symbol)
        df = ticker.history(period=period, interval=interval).tail(5)
        print(f"Data found: {len(df)}")
        if not df.empty:
            print(df.tail(2))
    except Exception as e:
        print(f"Error: {e}")

test_fetch("RELIANCE.NS")
test_fetch("AAPL")
test_fetch("BTC-USD")
