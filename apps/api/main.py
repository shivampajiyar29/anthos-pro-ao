from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from .routers import strategies, risk, backtests, deployments, orders, marketdata, ai
from .routers.auth import router as auth_router

app = FastAPI(
    title="Athos Pro Trading API",
    description="Production-grade AI Algorithmic Trading Platform API",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, set to specific dashboard URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth_router, prefix="/api/auth")
app.include_router(strategies.router, prefix="/api")
app.include_router(risk.router, prefix="/api")
app.include_router(backtests.router, prefix="/api")
app.include_router(deployments.router, prefix="/api")
app.include_router(orders.router, prefix="/api")
app.include_router(marketdata.router, prefix="/api")
app.include_router(ai.router, prefix="/api")

@app.get("/")
async def root():
    return {
        "status": "online",
        "system": "Athos Pro Trading",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
