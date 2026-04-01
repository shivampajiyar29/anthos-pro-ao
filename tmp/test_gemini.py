import asyncio
import sys
import os
import json

# Add project root to path
sys.path.append(os.getcwd())
from packages.ai_assistant.gemini_engine import GeminiEngine
from packages.common.config import settings

async def test_gemini():
    print("🤖 Testing Gemini Engine...")
    if not settings.GEMINI_API_KEY:
        print("❌ GEMINI_API_KEY not found in settings!")
        return

    engine = GeminiEngine(settings.GEMINI_API_KEY)
    
    mock_candles = [
        {"t": 1711710000000, "o": 65000, "h": 65500, "l": 64800, "c": 65200, "v": 10},
        {"t": 1711710060000, "o": 65200, "h": 65800, "l": 65100, "c": 65700, "v": 15},
    ]
    
    signal = await engine.get_signal("BTCUSDT", 65750.0, mock_candles)
    print("--- AI SIGNAL ---")
    print(json.dumps(signal, indent=2))
    
    if signal.get("action") in ["BUY", "SELL", "HOLD"]:
        print("✅ Gemini Engine is functional!")
    else:
        print("❌ Unexpected output from Gemini")

if __name__ == "__main__":
    asyncio.run(test_gemini())
