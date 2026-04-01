import redis
import json
import time
import requests
import threading

def trigger_trade():
    time.sleep(2)
    try:
        requests.post('http://localhost:8000/api/trades/manual', json={
            'symbol': 'ETHUSDT', 'action': 'SELL', 'quantity': 1.0, 
            'price': 3500, 'target_price': 3400, 'stop_loss': 3600
        })
        print("Trade triggered")
    except Exception as e:
        print(f"Trigger failed: {e}")

r = redis.Redis(decode_responses=True)
p = r.pubsub()
p.subscribe('live_updates')

threading.Thread(target=trigger_trade).start()

print("Monitoring live_updates for 5s...")
start = time.time()
while time.time() - start < 5:
    m = p.get_message(ignore_subscribe_messages=True)
    if m:
        data = json.loads(m['data'])
        if data.get('type') == 'TRADE_UPDATE':
            print(f"SUCCESS: Received TRADE_UPDATE for {data['symbol']}")
            break
        else:
            print(f"Ignored: {data.get('type')}")
    time.sleep(0.1)
