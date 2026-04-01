from typing import List, Dict, Any

class StrategyLinter:
    """
    Lints Strategy DSL for potential risks and logical flaws.
    """
    @staticmethod
    def lint(dsl: Dict[str, Any]) -> List[Dict[str, str]]:
        warnings = []
        
        # 1. Check for Stop Loss
        legs = dsl.get('legs', [])
        for i, leg in enumerate(legs):
            if not leg.get('stop_loss'):
                warnings.append({
                    "level": "CRITICAL",
                    "message": f"Leg {i+1} has no stop-loss defined. This is high risk."
                })
        
        # 2. Complex Structure Warning
        if len(legs) > 4:
            warnings.append({
                "level": "INFO",
                "message": "Strategy has many legs. Execution slippage may be significantly higher."
            })
            
        return warnings
