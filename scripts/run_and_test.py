import subprocess
import requests
import time
import os
import sys

def run_tests():
    os.environ["PYTHONPATH"] = "."
    print("Starting API...")
    # Using sys.executable to ensure we use the same python that is running this script
    proc = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "apps.api.main:app", "--host", "127.0.0.1", "--port", "8008"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    
    # Wait for API to be ready
    max_retries = 15
    url = "http://127.0.0.1:8008/api/explore/indices"
    for i in range(max_retries):
        try:
            time.sleep(2)
            res = requests.get(url, timeout=2)
            if res.status_code == 200:
                print("API is ready!")
                break
        except Exception:
            # Check if process is still running
            poll = proc.poll()
            if poll is not None:
                print(f"API process died with code {poll}")
                out, err = proc.communicate()
                print("STDOUT:", out)
                print("STDERR:", err)
                return False
            print(f"Waiting for API... ({i+1}/{max_retries})")
    else:
        print("API failed to respond within time.")
        proc.terminate()
        return False

    # Test Endpoints
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
    
    success_count = 0
    for ep in endpoints:
        try:
            full_url = f"http://127.0.0.1:8008{ep}"
            print(f"Testing {full_url}...", end=" ")
            res = requests.get(full_url, timeout=5)
            if res.status_code == 200:
                print("✅ OK")
                success_count += 1
            else:
                print(f"❌ Failed (Status: {res.status_code})")
        except Exception as e:
            print(f"❌ Error: {e}")
    
    print(f"\nSummary: {success_count}/{len(endpoints)} passed.")
    proc.terminate()
    return success_count == len(endpoints)

if __name__ == "__main__":
    if run_tests():
        sys.exit(0)
    else:
        sys.exit(1)
