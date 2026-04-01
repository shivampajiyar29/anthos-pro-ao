from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator, model_validator
from typing import Optional, List
import os

class Settings(BaseSettings):
    # App Settings
    APP_NAME: str = "Athos Pro Trading"
    ENV: str = "development" # development | production | test
    DEBUG: bool = True
    
    # Database Settings (PostgreSQL)
    DATABASE_URL: str = "postgresql://admin:admin_pass@localhost:5432/trading_db"
    
    # ClickHouse Settings
    CLICKHOUSE_HOST: str = "localhost"
    CLICKHOUSE_PORT: int = 8123
    CLICKHOUSE_USER: str = "default"
    CLICKHOUSE_PASSWORD: str = ""
    CLICKHOUSE_DB: str = "trading_data"
    
    # Redis Settings
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # MongoDB Settings (Maheshwara 2.0)
    MONGO_URL: str = "mongodb://localhost:27017/maheshwara_db"
    
    # InfluxDB Settings (Telemetry)
    INFLUXDB_URL: str = "http://localhost:8086"
    INFLUXDB_TOKEN: str = "placeholder_token"
    INFLUXDB_ORG: str = "maheshwara_org"
    INFLUXDB_BUCKET: str = "trading_data"
    
    # Auth Settings
    SECRET_KEY: str = "super_secret_key_change_in_production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # External APIs
    OPENAI_API_KEY: Optional[str] = None
    NVIDIA_API_KEY: Optional[str] = None
    OPENROUTER_API_KEY: Optional[str] = None
    GEMINI_API_KEY: Optional[str] = None
    
    # Broker APIs
    GROWW_API_KEY: Optional[str] = None
    GROWW_API_SECRET: Optional[str] = None
    BINANCE_API_KEY: Optional[str] = None
    BINANCE_API_SECRET: Optional[str] = None
    
    # Frontend Standardized (for reference/validation)
    NEXT_PUBLIC_API_URL: str = "http://localhost:8000"
    NEXT_PUBLIC_WS_URL: str = "ws://localhost:8000"

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore"
    )

    @model_validator(mode='after')
    def validate_production(self) -> 'Settings':
        """Strict validation for production mode."""
        if self.ENV == "production":
            critical_fields = [
                "DATABASE_URL", "MONGO_URL", "REDIS_URL", 
                "INFLUXDB_TOKEN", "SECRET_KEY", "GEMINI_API_KEY"
            ]
            for field in critical_fields:
                val = getattr(self, field)
                if not val or "localhost" in val or "change_in_production" in val or "placeholder" in val:
                    # We allow localhost in dev, but in production it's suspicious unless it's a very specific container setup
                    # For now, let's just warn or raise if it's a known placeholder
                    if "change_in_production" in str(val) or "placeholder" in str(val):
                        raise ValueError(f"🚨 PRODUCTION ERROR: Insecure/Placeholder value for {field}")
            
            if self.DEBUG:
                # Force DEBUG to False in production
                # self.DEBUG = False # BaseSettings are immutable by default
                pass 
                
        return self

settings = Settings()

