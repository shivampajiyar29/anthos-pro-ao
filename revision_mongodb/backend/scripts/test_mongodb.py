import asyncio
import os
import sys

# Add backend to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from data_layer.db import db_manager
from models.schema import TradeRecord
from datetime import datetime

async def test_connection():
    print("--- MAHESHWARA MongoDB Atlas Verification ---")
    print(f"Connecting to: {os.getenv('MONGODB_URI')}")
    
    await db_manager.connect()
    
    if db_manager.db is not None:
        print("[SUCCESS] Connected to MongoDB!")
        
        # Test inserting a trade
        trades_col = await db_manager.get_collection("trades")
        
        test_trade = TradeRecord(
            symbol="BTC/USDT",
            market="CRYPTO",
            side="BUY",
            quantity=0.001,
            entry_price=45000.0,
            status="TEST",
            ai_reasoning="Verification trade for MongoDB migration."
        )
        
        result = await trades_col.insert_one(test_trade.model_dump())
        print(f"[SUCCESS] Inserted test trade with ID: {result.inserted_id}")
        
        # Test retrieving the trade
        retrieved = await trades_col.find_one({"_id": result.inserted_id})
        print(f"[SUCCESS] Retrieved trade symbol: {retrieved['symbol']}")
        
        # Cleanup
        # await trades_col.delete_one({"_id": result.inserted_id})
        # print("[INFO] Cleaned up test trade.")
    else:
        print("[ERROR] Failed to connect. Check your MONGODB_URI in .env")
    
    await db_manager.close()

if __name__ == "__main__":
    asyncio.run(test_connection())
