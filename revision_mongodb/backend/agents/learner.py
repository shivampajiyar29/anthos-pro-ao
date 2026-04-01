import asyncio
import json

class LearnerAgent:
    """
    The Learner Agent evaluates closed trades and prepares fine-tuning datasets.
    Operates the "Feedback & Learning Pipeline".
    """
    def __init__(self):
        self.name = "Learner"

    async def evaluate_trades(self, closed_trades: list):
        """
        Processes closed trades and assigns reward scores.
        """
        evaluation_data = []
        for trade in closed_trades:
            pnl = trade.get("pnl", 0)
            reward = 1.0 if pnl > 0 else -1.0
            evaluation_data.append({
                "prompt": trade.get("ai_reasoning"),
                "completion": trade.get("outcome"),
                "reward": reward
            })
        
        # In a real setup, this would save to a JSONL file for Axolotl fine-tuning
        print(f"[{self.name}] Processed {len(evaluation_data)} trades for learning.")
        return evaluation_data

    async def start_nightly_loop(self):
        while True:
            # Simulate waiting for 02:00 UTC
            print(f"[{self.name}] Awaiting nightly fine-tuning window...")
            await asyncio.sleep(3600) # Check every hour

learner = LearnerAgent()
