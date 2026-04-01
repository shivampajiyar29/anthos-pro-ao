import json
from typing import Dict, Optional

class AIStrategyAssistant:
    def __init__(self, api_key: Optional[str] = None, provider: str = "openai"):
        self.api_key = api_key
        self.provider = provider

    def generate_strategy_from_text(self, text: str) -> Dict:
        """
        Mock implementation of AI-driven strategy generation.
        In a real scenario, this would call OpenAI/Anthropic with a system prompt
        containing the DSL schema.
        """
        # Mock logic based on keywords
        if "straddle" in text.lower():
            from packages.strategy_dsl.examples import get_sample_short_straddle
            return get_sample_short_straddle()
        
        return {
            "name": "AI Generated Strategy",
            "description": f"Generated from: {text}",
            "instruments": ["NIFTY"],
            "legs": [],
            "entry_rules": [],
            "exit_rules": []
        }

    def explain_strategy(self, dsl_json: Dict) -> str:
        """
        Explains a Strategy DSL in plain English.
        """
        name = dsl_json.get("name", "Unnamed Strategy")
        legs_count = len(dsl_json.get("legs", []))
        return f"This strategy '{name}' consists of {legs_count} legs. It targets {', '.join(dsl_json.get('instruments', []))}."

if __name__ == "__main__":
    assistant = AIStrategyAssistant()
    print(assistant.explain_strategy({"name": "Test", "instruments": ["NIFTY"], "legs": [{}, {}]}))
