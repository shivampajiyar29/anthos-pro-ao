from datetime import datetime, timedelta
from typing import Optional, Any, Union
from jose import jwt
from passlib.context import CryptContext
from packages.common.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

from fastapi import Depends, HTTPException, status, WebSocket

from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from packages.core.database import get_db
from packages.core.models import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except Exception:
        return None

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception
    email = payload.get("sub")
    if not email:
        raise credentials_exception
    user = db.query(User).filter(User.email == email).first()

    if user is None:
        raise credentials_exception
    return user

async def get_ws_user(websocket: WebSocket, db: Session = Depends(get_db)) -> Optional[User]:
    """
    Retrieves user for WebSocket connection.
    Supports token in query parameter 'token'.
    """
    token = websocket.query_params.get("token")
    if not token:
        return None
    
    payload = decode_access_token(token)
    if not payload:
        return None
        
    email = payload.get("sub")
    if not email:
        return None
        
    return db.query(User).filter(User.email == email).first()


