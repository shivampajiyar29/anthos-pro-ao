import redis
import pymongo
from influxdb_client import InfluxDBClient
import os
from dotenv import load_dotenv
import json

load_dotenv()

def test():
    redis_url = os.getenv("REDIS_URL", "redis://127.0.0.1:6379")
    print(f"Testing Redis at {redis_url}...")
    try:
        r = redis.from_url(redis_url, socket_timeout=5)
        print(f"Redis Ping: {r.ping()}")
    except Exception as e:
        print(f"Redis Failed: {e}")

    print("\nTesting MongoDB...")
    try:
        url = os.getenv("MONGO_URL")
        client = pymongo.MongoClient(url, serverSelectionTimeoutMS=5000)
        print(f"Mongo Server Info: {client.server_info()['version']}")
    except Exception as e:
        print(f"Mongo Failed: {e}")

    print("\nTesting InfluxDB...")
    try:
        url = os.getenv("INFLUXDB_URL", "http://127.0.0.1:8086")
        token = os.getenv("INFLUXDB_TOKEN")
        org = os.getenv("INFLUXDB_ORG")
        client = InfluxDBClient(url=url, token=token, org=org, timeout=5000)
        print(f"Influx Health: {client.health().status}")
    except Exception as e:
        print(f"Influx Failed: {e}")

if __name__ == "__main__":
    test()
