from packages.core.models import User, Base, Strategy, Instrument, InstrumentType
from sqlalchemy import create_all
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://admin:admin_pass@localhost:5432/trading_db")

def seed():
    engine = create_engine(DATABASE_URL)
    Session = sessionmaker(bind=engine)
    session = Session()

    print("Seeding database...")
    
    # Create tables
    Base.metadata.create_all(engine)

    # Add Admin User
    if not session.query(User).filter_by(email="admin@athos.pro").first():
        admin = User(email="admin@athos.pro", full_name="Admin User", is_admin=True)
        session.add(admin)
        print("Added admin user.")

    # Add Sample Strategy
    if not session.query(Strategy).filter_by(name="NIFTY Straddle").first():
        strat = Strategy(name="NIFTY Straddle", market_type="NSE")
        session.add(strat)
        print("Added sample strategy.")
        
    # Add Sample Instrument
    if not session.query(Instrument).filter_by(tradingsymbol="NIFTY24MAR22000CE").first():
        instr = Instrument(
            tradingsymbol="NIFTY24MAR22000CE", 
            exchange="NFO", 
            instrument_type=InstrumentType.OPTION,
            strike=22000.0
        )
        session.add(instr)
        print("Added sample instrument.")

    session.commit()
    print("Seeding complete.")

if __name__ == "__main__":
    seed()
