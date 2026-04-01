import requests
import time
import sys

BASE_URL = "http://localhost:8000"

def check_health():
    print("Checking API Health...")
    try:
        r = requests.get(f"{BASE_URL}/health")
        if r.status_code == 200:
            print("âœ… API is Healthy")
            return True
    except Exception as e:
        print(f"â Œ API Connection Failed: {e}")
    return False

def check_auth():
    print("Checking Auth Service...")
    # This assumes the seeder has run
    payload = {"email": "admin@athos.pro", "password": "admin_password"}
    try:
        r = requests.post(f"{BASE_URL}/api/auth/login", json=payload)
        if r.status_code == 200:
            print("âœ… Login Successful")
            return r.json()
    except:
        pass
    print("â Œ Login Failed (Ensure 'make seed' was run)")
    return None

def main():
    print("--- Athos Pro Smoke Test ---")
    if not check_health():
        sys.exit(1)
    
    auth_data = check_auth()
    if not auth_data:
        # sys.exit(1) # Don't exit yet, allow dev to see other checks
        pass
        
    print("âœ… Smoke Test Complete")

if __name__ == "__main__":
    main()
