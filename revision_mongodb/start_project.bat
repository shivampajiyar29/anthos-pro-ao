@echo off
echo ==========================================
echo   MAHESHWARA: Starting Ecosystem...
echo ==========================================

REM Check if .env exists, if not copy from .env.example
if not exist .env (
    echo [INFO] .env file not found. Copying from .env.example...
    copy .env.example .env
)

echo [1/3] Pulling/Building Docker Containers...
docker-compose build

echo [2/3] Starting Infrastructure (Redis)...
docker-compose up -d redis

echo [3/3] Starting Backend and Dashboard...
docker-compose up -d backend dashboard

echo ==========================================
echo   SUCCESS: MAHESHWARA is running!
echo   Dashboard: http://localhost:3000
echo   API:       http://localhost:8000
echo ==========================================
pause
