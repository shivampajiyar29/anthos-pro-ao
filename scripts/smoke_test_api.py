import requests
import time
import sys

BASE_URL = "http://localhost:8000"

endpoints = [
    "/api/explore/indices",
    "/api/explore/top-gainers",
    "/api/explore/most-bought",
    "/api/brokers/",
    "/api/orders/",
    "/api/positions/",
    "/api/risk/rules",
    "/api/deployments/",
    "/api/audit-logs/"
]

def test_api():
    success_count = 0
    for ep in endpoints:
        try:
            url = f"{BASE_URL}{ep}"
            print(f"Testing {url}...", end=" ")
            res = requests.get(url, timeout=5)
            if res.status_code == 200:
                print("✅ OK")
                success_count += 1
            else:
                print(f"❌ Failed (Status: {res.status_code})")
        except Exception as e:
            print(f"❌ Error: {e}")
    
    print(f"\nSummary: {success_count}/{len(endpoints)} passed.")
    if success_count == len(endpoints):
        sys.exit(0)
    else:
        sys.exit(1)

if __name__ == "__main__":
    test_api()
