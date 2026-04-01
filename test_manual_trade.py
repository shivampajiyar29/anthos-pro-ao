import requests
import json

BASE_URL = "http://localhost:8000/api"

def test_manual_trade():
    print("Testing Manual Trade...")
    # 1. Place a BUY order
    order_data = {
        "symbol": "AAPL",
        "side": "BUY",
        "quantity": 10,
        "price": 185.50,
        "order_type": "MARKET"
    }
    # Note: Using auth header if needed, but for local test we might bypass if possible
    # Let's assume we need a token. I'll mock a login first.
    
    # Skip actual login for now and just check if the endpoint exists
    try:
        response = requests.post(f"{BASE_URL}/orders/", json=order_data)
        print(f"POST /orders/ Response: {response.status_code}")
        print(response.json())
        
        # 2. Check Orders list
        response = requests.get(f"{BASE_URL}/orders/")
        print(f"GET /orders/ Response: {response.status_code}")
        # print(response.json())
        
        # 3. Check Positions
        response = requests.get(f"{BASE_URL}/deployments/positions")
        print(f"GET /deployments/positions Response: {response.status_code}")
        print(response.json())
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_manual_trade()
