import httpx
import os
from typing import List, Dict, Any

class OpenRouterClient:
    """
    Client for OpenRouter to access premium models like Grok-4.20.
    """
    def __init__(self):
        self.api_key = os.getenv("OPENROUTER_API_KEY")
        self.base_url = "https://openrouter.ai/api/v1"
        self.default_model = "x-ai/grok-4.20" # Placeholder for expected model ID

    async def generate_response(self, messages: List[Dict[str, str]], model: str = None) -> str:
        if not self.api_key:
            return "OPENROUTER_API_KEY not set. Cannot access Grok."

        async with httpx.AsyncClient() as client:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "HTTP-Referer": "https://maheshwara-ai.com", # Required by OpenRouter
                "X-Title": "MAHESHWARA Trading System",
                "Content-Type": "application/json"
            }
            payload = {
                "model": model or self.default_model,
                "messages": messages
            }
            try:
                response = await client.post(f"{self.base_url}/chat/completions", headers=headers, json=payload)
                response.raise_for_status()
                data = response.json()
                return data["choices"][0]["message"]["content"]
            except Exception as e:
                return f"Error calling OpenRouter: {str(e)}"

open_router_client = OpenRouterClient()
