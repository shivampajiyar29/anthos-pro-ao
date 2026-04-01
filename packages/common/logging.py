import logging
import sys
import json
from datetime import datetime
from typing import Any, Dict

class StructuredLogger:
    def __init__(self, name: str, level: int = logging.INFO):
        self.logger = logging.getLogger(name)
        self.logger.setLevel(level)
        
        if not self.logger.handlers:
            handler = logging.StreamHandler(sys.stdout)
            self.logger.addHandler(handler)

    def _format_log(self, level: str, msg: str, extra: Dict[str, Any] = None) -> str:
        log_data = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": level,
            "module": self.logger.name,
            "message": msg
        }
        if extra:
            log_data.update(extra)
        return json.dumps(log_data)

    def info(self, msg: str, extra: Dict[str, Any] = None):
        print(self._format_log("INFO", msg, extra))

    def error(self, msg: str, extra: Dict[str, Any] = None):
        print(self._format_log("ERROR", msg, extra))

    def warning(self, msg: str, extra: Dict[str, Any] = None):
        print(self._format_log("WARNING", msg, extra))

    def debug(self, msg: str, extra: Dict[str, Any] = None):
        print(self._format_log("DEBUG", msg, extra))

def get_logger(name: str):
    return StructuredLogger(name)
