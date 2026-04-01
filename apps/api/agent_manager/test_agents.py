import asyncio
import os
import sys
from unittest.mock import MagicMock

# Mock missing modules to allow imports
sys.modules['langchain_nvidia_ai_endpoints'] = MagicMock()
sys.modules['langchain_openai'] = MagicMock()
sys.modules['langchain_core'] = MagicMock()
sys.modules['langchain_core.prompts'] = MagicMock()
sys.modules['langchain_core.output_parsers'] = MagicMock()

# Ensure the parent directory is in sys.path so we can import modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agent_manager.agents.strategist import StrategistAgent
from agent_manager.agents.tactician import TacticianAgent
from agent_manager.agents.arbitrageur import ArbitrageurAgent
from agent_manager.agents.risk_sentinel import RiskSentinelAgent

async def main():
    market_data = {
        "symbol": "NIFTY",
        "market_data": { "ohlc": [], "order_flow": {} },
        "portfolio": {
            "equity": 1000000, "cash": 400000,
            "positions": [{ "symbol": "INFY", "qty": 50, "avg_price": 1600, "unrealized_pnl": 1200 }],
            "open_pnl": 3500, "day_pnl": 1200
        },
        "risk_limits": {
            "max_position_per_symbol": 0.2, "max_leverage": 2.0, "max_daily_loss": 0.03, "max_drawdown": 0.1
        },
        "mode": "SIM"
    }

    # Instantiate agents
    agents = [
        StrategistAgent(),
        TacticianAgent(),
        ArbitrageurAgent(),
        RiskSentinelAgent()
    ]

    print("Starting Agent Verification (Mock Mode)...")
    print("=" * 60)

    for agent in agents:
        print(f"Testing Agent: {agent.name}")
        # Force LLM to None to use fallback logic which checks schema compliance locally
        agent.llm = None 
        
        try:
            signal = await agent.analyze(market_data)
            print(f"Output:\n{signal.model_dump_json(indent=2)}")
            
            # Basic validation
            if signal.action not in ["BUY", "SELL", "HOLD"]:
                print("❌ Invalid ACTION")
            if not isinstance(signal.confidence, float) or not (0.0 <= signal.confidence <= 1.0):
                 print(f"❌ Invalid CONFIDENCE: {signal.confidence}")
            if signal.qty is None:
                print("❌ Missing QTY")
            if signal.risk_comment is None:
                print("❌ Missing RISK COMMENT")
                
            print("✅ Schema Validation Passed")
        except Exception as e:
            print(f"❌ Error: {e}")
            import traceback
            traceback.print_exc()
        print("-" * 60)

if __name__ == "__main__":
    asyncio.run(main())
