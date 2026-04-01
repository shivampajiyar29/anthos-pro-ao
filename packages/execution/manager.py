import asyncio
from typing import Dict, Any
from packages.common.logging import get_logger

logger = get_logger("execution.manager")

class DeploymentManager:
    """
    Manages the lifecycle of active strategy deployments.
    """
    def __init__(self):
        self.active_deployments = {}

    async def start_deployment(self, deployment_id: str, config: Dict[str, Any]):
        if deployment_id in self.active_deployments:
            logger.warning(f"Deployment {deployment_id} already active")
            return

        logger.info(f"Starting deployment: {deployment_id}")
        # Logic to launch background thread/task for the strategy loop
        self.active_deployments[deployment_id] = {
            "status": "RUNNING",
            "start_time": asyncio.get_event_loop().time()
        }

    async def stop_deployment(self, deployment_id: str):
        if deployment_id not in self.active_deployments:
            return

        logger.info(f"Stopping deployment: {deployment_id}")
        del self.active_deployments[deployment_id]

    async def get_status(self, deployment_id: str) -> str:
        return self.active_deployments.get(deployment_id, {}).get("status", "INACTIVE")
