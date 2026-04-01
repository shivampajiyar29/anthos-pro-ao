from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from packages.core.database import get_db, MongoDB, Redis, InfluxDB
import time

router = APIRouter()

@router.get("/health")
async def health_check():
    """
    Basic liveness probe.
    """
    return {
        "status": "healthy",
        "timestamp": time.time(),
        "service": "athos-api"
    }

@router.get("/ready")
async def readiness_check(db: Session = Depends(get_db)):
    """
    Full readiness probe checking all dependencies.
    """
    checks = {}
    
    # 1. PostgreSQL
    try:
        db.execute("SELECT 1")
        checks["postgres"] = "connected"
    except Exception as e:
        checks["postgres"] = f"error: {str(e)}"
        
    # 2. Redis
    try:
        if Redis.client:
            await Redis.client.ping()
            checks["redis"] = "connected"
        else:
            checks["redis"] = "not_initialized"
    except Exception as e:
        checks["redis"] = f"error: {str(e)}"
        
    # 3. MongoDB
    try:
        if MongoDB.client:
            await MongoDB.client.admin.command('ping')
            checks["mongodb"] = "connected"
        else:
            checks["mongodb"] = "not_initialized"
    except Exception as e:
        checks["mongodb"] = f"error: {str(e)}"

    # 4. InfluxDB
    try:
        if InfluxDB.client:
            ready = await InfluxDB.client.ping()
            checks["influxdb"] = "connected" if ready else "not_ready"
        else:
            checks["influxdb"] = "not_initialized"
    except Exception as e:
        checks["influxdb"] = f"error: {str(e)}"
        
    overall_status = "ready" if all(v == "connected" for v in checks.values()) else "partially_ready"
    
    return {
        "status": overall_status,
        "checks": checks,
        "timestamp": time.time()
    }
