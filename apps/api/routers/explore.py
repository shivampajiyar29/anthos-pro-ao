from fastapi import APIRouter
import random

router = APIRouter()

@router.get("/indices")
async def get_indices():
    return [
        {"name": "NIFTY 50", "price": 22096.75, "change": 172.85, "percent": 0.79, "is_up": True},
        {"name": "SENSEX", "price": 72831.94, "change": 190.75, "percent": 0.26, "is_up": True},
        {"name": "BANK NIFTY", "price": 46600.20, "change": -152.10, "percent": -0.33, "is_up": False},
        {"name": "FINNIFTY", "price": 20650.45, "change": 42.30, "percent": 0.21, "is_up": True}
    ]

@router.get("/top-gainers")
async def get_top_gainers():
    return [
        {"symbol": "TATASTEEL", "name": "Tata Steel", "price": 149.85, "change": 8.45, "percent": 5.98, "is_up": True},
        {"symbol": "RELIANCE", "name": "Reliance Ind.", "price": 2987.40, "change": 102.30, "percent": 3.55, "is_up": True},
        {"symbol": "HDFCBANK", "name": "HDFC Bank", "price": 1445.20, "change": 25.40, "percent": 1.79, "is_up": True},
        {"symbol": "INFY", "name": "Infosys", "price": 1542.10, "change": 18.20, "percent": 1.19, "is_up": True}
    ]

@router.get("/most-bought")
async def get_most_bought():
    return [
        {"symbol": "ZOMATO", "name": "Zomato", "price": 160.45, "change": 4.20, "percent": 2.69, "is_up": True},
        {"symbol": "TATASTEEL", "name": "Tata Steel", "price": 149.85, "change": 8.45, "percent": 5.98, "is_up": True},
        {"symbol": "IRFC", "name": "IRFC", "price": 145.20, "change": -2.40, "percent": -1.63, "is_up": False},
        {"symbol": "WIPRO", "name": "Wipro", "price": 482.30, "change": 5.15, "percent": 1.08, "is_up": True}
    ]

@router.get("/news")
async def get_stocks_in_news():
    return [
        {
            "id": 1,
            "title": "Reliance Industries hits record high after quarterly results",
            "source": "Financial Express",
            "time": "2 hours ago",
            "image_url": "https://placehold.co/100x100?text=RELI",
            "stocks": [{"symbol": "RELIANCE", "name": "Reliance"}]
        },
        {
            "id": 2,
            "title": "HDFC Bank launches new global digital platform",
            "source": "Economic Times",
            "time": "4 hours ago",
            "image_url": "https://placehold.co/100x100?text=HDFC",
            "stocks": [{"symbol": "HDFCBANK", "name": "HDFC Bank"}]
        }
    ]
