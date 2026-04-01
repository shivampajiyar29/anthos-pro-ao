import redis
import time
import json
import random
import os

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

def simulate_market():
    r = redis.from_url(REDIS_URL)
    print("Starting Market Simulator...")
    
    symbols = ["NIFTY", "BANKNIFTY", "RELIANCE", "TCS"]
    prices = {s: random.uniform(2000, 22000) for s in symbols}
    
    try:
        while True:
            for s in symbols:
                # Random walk
                prices[s] += random.uniform(-5, 5)
                tick = {
                    "symbol": s,
                    "price": round(prices[s], 2),
                    "timestamp": time.time()
                }
                r.set(f"tick:{s}", json.dumps(tick))
                r.publish("market_ticks", json.dumps(tick))
            
            time.sleep(1)
    except KeyboardInterrupt:
        print("Simulator stopped.")

if __name__ == "__main__":
    simulate_market()
