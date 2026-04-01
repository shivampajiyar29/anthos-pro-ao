import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

class MongoDBManager:
    """
    Manages MongoDB Atlas connection using Motor (async driver).
    """
    def __init__(self):
        self.client = None
        self.db = None
        self.uri = os.getenv("MONGODB_URI")
        self.db_name = os.getenv("MONGODB_DB_NAME", "maheshwara_db")

    async def connect(self):
        if not self.uri:
            print("[ERROR] MONGODB_URI not found in environment.")
            return
        
        try:
            self.client = AsyncIOMotorClient(self.uri)
            self.db = self.client[self.db_name]
            # Verify connection
            await self.client.admin.command('ping')
            print(f"[SUCCESS] Connected to MongoDB Atlas: {self.db_name}")
        except Exception as e:
            print(f"[ERROR] Could not connect to MongoDB: {e}")

    async def close(self):
        if self.client:
            self.client.close()
            print("[INFO] MongoDB connection closed.")

    async def get_collection(self, name: str):
        if self.db is None:
            await self.connect()
        return self.db[name]

db_manager = MongoDBManager()
