import random
from typing import Dict, Any

class StrategyGenome:
    def __init__(self, prompt_template=None, temperature=None, risk_factor=None):
        self.prompt_template = prompt_template or self.random_prompt()
        self.temperature = temperature if temperature is not None else round(random.uniform(0.1, 0.9), 2)
        self.risk_factor = risk_factor if risk_factor is not None else round(random.uniform(0.5, 2.0), 2)
        self.fitness = 0.0  # PnL

    def random_prompt(self):
        templates = [
            "You are a Conservative Trader. Market Data: {data}. Minimize risk.",
            "You are an Aggressive Speculator. Market Data: {data}. Seek alpha.",
            "You are a Mean Reversion Algo. Market Data: {data}. Fade moves.",
            "You are a Momentum Chaser. Market Data: {data}. Follow trends."
        ]
        return random.choice(templates)

    def mutate(self):
        """Randomly alter genes"""
        if random.random() < 0.2:
            self.temperature = max(0.1, min(1.0, self.temperature + random.uniform(-0.1, 0.1)))
        if random.random() < 0.2:
            self.risk_factor = max(0.5, min(3.0, self.risk_factor + random.uniform(-0.2, 0.2)))
        if random.random() < 0.1:
            self.prompt_template = self.random_prompt()

    @classmethod
    def crossover(cls, parent1, parent2):
        """Create offspring from two parents"""
        child = cls(
            prompt_template=random.choice([parent1.prompt_template, parent2.prompt_template]),
            temperature=(parent1.temperature + parent2.temperature) / 2,
            risk_factor=(parent1.risk_factor + parent2.risk_factor) / 2
        )
        return child

class EvolutionEngine:
    def __init__(self, population_size=10):
        self.population = [StrategyGenome() for _ in range(population_size)]
        self.generation = 1

    def evolve(self):
        """
        Run one generation of evolution.
        1. Select best (Tournament)
        2. Crossover
        3. Mutate
        """
        # Sort by fitness (Descending)
        self.population.sort(key=lambda x: x.fitness, reverse=True)
        
        # Elitism: Keep top 2
        next_gen = self.population[:2]
        
        while len(next_gen) < len(self.population):
            # Tournament Selection
            p1 = random.choice(self.population[:5]) # Top 50%
            p2 = random.choice(self.population[:5])
            
            child = StrategyGenome.crossover(p1, p2)
            child.mutate()
            next_gen.append(child)
            
        self.population = next_gen
        self.generation += 1
        return self.population[0] # Return best genome
