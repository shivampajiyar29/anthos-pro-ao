import sys
import os
from sqlalchemy import create_engine
from packages.core.models import Base
from packages.core.database import DATABASE_URL

# Force SQLite for local testing if no Postgres is found
if "postgresql" in DATABASE_URL and ("localhost" in DATABASE_URL or "127.0.0.1" in DATABASE_URL):
    print("PostgreSQL not detected/accessible, falling back to SQLite for local run.")
    SQLITE_URL = "sqlite:///./trading_db.sqlite"
    os.environ["DATABASE_URL"] = SQLITE_URL
    engine = create_engine(SQLITE_URL)
else:
    engine = create_engine(DATABASE_URL)

def init_db():
    print(f"Initializing database at: {engine.url}")
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully.")

if __name__ == "__main__":
    init_db()
