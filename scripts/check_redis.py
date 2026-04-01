import redis
import json

def check_redis():
    try:
        r = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)
        if r.ping():
            print("Successfully connected to Redis.")
            keys = r.keys("tick:*")
            print(f"Found {len(keys)} tick keys.")
            for key in keys[:5]:
                val = r.get(key)
                print(f"{key}: {val[:100]}...")
            
            # Check for live_updates channel or other activity
            # (Just keys is enough to prove LiveDataProvider is working)
        else:
            print("Failed to ping Redis.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_redis()
