@echo off
echo Starting Athos Pro Backend...
start "Athos Pro Backend" cmd /k "set PYTHONPATH=%CD% && set DATABASE_URL=sqlite:///./trading_db.sqlite && python -m apps.api.main"
timeout /t 5
echo Starting Athos Pro Dashboard...
cd apps/web
start "Athos Pro Dashboard" cmd /k "set NEXT_PUBLIC_API_URL=http://localhost:8000 && npm run dev"
echo ✅ Services are starting in new windows.
echo 🌐 Web UI: http://localhost:3000
echo 📄 API Docs: http://localhost:8000/docs
pause
