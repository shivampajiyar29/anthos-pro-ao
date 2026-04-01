import httpx
import os
from typing import List, Dict, Any

class NVIDIAAIClient:
    """
    Client for NVIDIA AI Foundation models.
    Provides unlimited free inference for supported models like Qwen.
    """
    def __init__(self):
        self.api_key = os.getenv("NVIDIA_API_KEY")
        self.base_url = "https://integrate.api.nvidia.com/v1"
        self.default_model = "qwen/qwen-2.5-72b-instruct" # Placeholder for Qwen model

    async def generate_response(self, messages: List[Dict[str, str]], model: str = None) -> str:
        if not self.api_key:
            return "NVIDIA_API_KEY not set. Using rule-based fallback."

        async with httpx.AsyncClient() as client:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            payload = {
                "model": model or self.default_model,
                "messages": messages,
                "temperature": 0.7,
                "max_tokens": 1024
            }
            try:
                response = await client.post(f"{self.base_url}/chat/completions", headers=headers, json=payload)
                response.raise_for_status()
                data = response.json()
                return data["choices"][0]["message"]["content"]
            except Exception as e:
                return f"Error calling NVIDIA AI: {str(e)}"

nvidia_client = NVIDIAAIClient()
