import asyncio
import sys
import os
from sqlalchemy import create_engine, text
from motor.motor_asyncio import AsyncIOMotorClient
import redis.asyncio as redis
from influxdb_client.client.influxdb_client_async import InfluxDBClientAsync

# Add project root to path
sys.path.append(os.getcwd())
from packages.common.config import settings

async def test_postgres():
    print("🐘 Testing PostgreSQL...")
    try:
        from packages.core.database import _make_db_url
        db_url = _make_db_url(settings.DATABASE_URL)
        connect_args = {"sslmode": "require"} if "postgresql" in db_url else {}
        engine = create_engine(db_url, connect_args=connect_args)
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        print("✅ PostgreSQL Connected!")
    except Exception as e:
        print(f"❌ PostgreSQL Failed: {e}")

async def test_mongo():
    print("🍃 Testing MongoDB...")
    try:
        client = AsyncIOMotorClient(settings.MONGO_URL, serverSelectionTimeoutMS=5000)
        await client.admin.command('ping')
        print("✅ MongoDB Connected!")
    except Exception as e:
        print(f"❌ MongoDB Failed: {e}")

async def test_redis():
    print("📦 Testing Redis...")
    try:
        client = redis.from_url(settings.REDIS_URL, decode_responses=True)
        await client.ping()
        print("✅ Redis Connected!")
    except Exception as e:
        print(f"❌ Redis Failed: {e}")

async def test_influx():
    print("📈 Testing InfluxDB...")
    try:
        client = InfluxDBClientAsync(
            url=settings.INFLUXDB_URL,
            token=settings.INFLUXDB_TOKEN,
            org=settings.INFLUXDB_ORG
        )
        ready = await client.ping()
        if ready:
            print("✅ InfluxDB Connected!")
        else:
            print("❌ InfluxDB Ping Failed")
    except Exception as e:
        print(f"❌ InfluxDB Failed: {e}")

async def main():
    print(f"--- Production Connectivity Test (ENV: {settings.ENV}) ---")
    await test_postgres()
    await test_mongo()
    await test_redis()
    await test_influx()

if __name__ == "__main__":
    asyncio.run(main())
