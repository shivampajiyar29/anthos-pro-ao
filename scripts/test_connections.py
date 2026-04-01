import redis
import pymongo
from influxdb_client import InfluxDBClient
import os
from dotenv import load_dotenv
import json

load_dotenv()

def test():
    # Helper to test URL with fallback
    def test_conn(name, default_url, test_func):
        url = os.getenv(f"{name.upper()}_URL", default_url)
        print(f"\nTesting {name} at {url}...")
        try:
            test_func(url)
            print(f"✅ {name} Success")
        except Exception as e:
            print(f"❌ {name} Failed: {e}")
            if "localhost" not in url and "127.0.0.1" not in url:
                print(f"Retrying {name} with localhost...")
                try:
                    local_url = url.replace("redis:", "127.0.0.1").replace("influxdb", "127.0.0.1").replace("mongodb", "127.0.0.1")
                    # Simplified fallback logic
                    if name == "Redis": test_func("redis://127.0.0.1:6379/0")
                    elif name == "MongoDB": test_func("mongodb://127.0.0.1:27017")
                    elif name == "InfluxDB": test_func("http://127.0.0.1:8086")
                    print(f"✅ {name} Success (Local Fallback)")
                except Exception as e2:
                    print(f"❌ {name} Local Fallback Failed: {e2}")

    # Redis
    def check_redis(url):
        r = redis.from_url(url, socket_timeout=2)
        r.ping()
    test_conn("Redis", "redis://127.0.0.1:6379/0", check_redis)

    # MongoDB
    def check_mongo(url):
        client = pymongo.MongoClient(url, serverSelectionTimeoutMS=2000)
        client.server_info()
    test_conn("MongoDB", "mongodb://127.0.0.1:27017", check_mongo)

    # InfluxDB
    def check_influx(url):
        token = os.getenv("INFLUXDB_TOKEN")
        org = os.getenv("INFLUXDB_ORG")
        client = InfluxDBClient(url=url, token=token, org=org, timeout=2000)
        if client.health().status != "pass": raise Exception("Health check failed")
    test_conn("InfluxDB", "http://127.0.0.1:8086", check_influx)

if __name__ == "__main__":
    test()
