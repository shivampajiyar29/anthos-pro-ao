from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import asyncio
from apps.api.routers import (
    auth, users, broker_accounts, instruments, marketdata,
    strategies, backtests,
    deployments, orders, positions, risk, analytics,
    notifications, audit_logs, ai_assistant, admin, explore, maheshwara, realtime, health
)


from packages.core.database import MongoDB, InfluxDB, Redis

def create_app() -> FastAPI:
    app = FastAPI(
        title="Athos Pro Trading Platform",
        description="Production-grade Algorithmic Trading Platform API",
        version="1.0.0",
        docs_url="/docs",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.on_event("startup")
    async def startup_event():
        await asyncio.gather(
            MongoDB.connect(),
            InfluxDB.connect(),
            Redis.connect()
        )

    @app.on_event("shutdown")
    async def shutdown_event():
        await asyncio.gather(
            MongoDB.close(),
            InfluxDB.close(),
            Redis.close()
        )


    # Register Routers
    app.include_router(explore.router,           prefix="/api/explore",          tags=["Explore"])
    app.include_router(auth.router,             prefix="/api/auth",             tags=["Auth"])
    app.include_router(users.router,            prefix="/api/users",            tags=["Users"])
    app.include_router(broker_accounts.router,  prefix="/api/brokers",          tags=["Brokers"])
    app.include_router(instruments.router,      prefix="/api/instruments",      tags=["Instruments"])
    app.include_router(marketdata.router,       prefix="/api/marketdata",       tags=["Market Data"])
    app.include_router(strategies.router,       prefix="/api/strategies",      tags=["Strategies"])
    app.include_router(backtests.router,        prefix="/api/backtests",        tags=["Backtester"])
    app.include_router(deployments.router,      prefix="/api/deployments",      tags=["Deployments"])
    app.include_router(orders.router,           prefix="/api/orders",           tags=["Orders"])

    app.include_router(positions.router,        prefix="/api/positions",        tags=["Positions"])
    app.include_router(risk.router,             prefix="/api/risk",             tags=["Risk Engine"])
    app.include_router(analytics.router,        prefix="/api/analytics",        tags=["Analytics"])
    app.include_router(notifications.router,    prefix="/api/notifications",    tags=["Notifications"])
    app.include_router(audit_logs.router,       prefix="/api/audit-logs",       tags=["Audit Logs"])
    app.include_router(ai_assistant.router,     prefix="/api/ai-assistant",     tags=["AI Assistant"])
    app.include_router(admin.router,            prefix="/api/admin",            tags=["Admin"])
    app.include_router(maheshwara.router,       prefix="/api/maheshwara",       tags=["Maheshwara"])
    app.include_router(realtime.router,         prefix="",                      tags=["WebSockets"])
    app.include_router(health.router,           prefix="/api",                  tags=["Health"])



    @app.get("/")
    async def root():
        return {"message": "Athos Pro Trading API is running", "version": "1.0.0"}

    return app

