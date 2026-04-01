'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import LegForm from './LegForm';

export default function StrategyBuilder() {
    const [strategy, setStrategy] = useState({
        name: 'New Alpha Strategy',
        description: '',
        timeframe: '5m',
        legs: [
            { id: Date.now(), instrument_type: 'EQUITY', symbol: 'BTCUSDT', side: 'BUY', quantity: 1, order_type: 'MARKET' }
        ]
    });

    const addLeg = () => {
        setStrategy({
            ...strategy,
            legs: [...strategy.legs, { id: Date.now(), instrument_type: 'OPTIONS', symbol: 'NIFTY', option_type: 'CE', strike: 'ATM', side: 'BUY', quantity: 50, order_type: 'MARKET' } as any]
        });
    };

    const removeLeg = (index: number) => {
        const newLegs = [...strategy.legs];
        newLegs.splice(index, 1);
        setStrategy({ ...strategy, legs: newLegs });
    };

    const updateLeg = (index: number, field: string, value: any) => {
        const newLegs = [...strategy.legs];
        newLegs[index] = { ...newLegs[index], [field]: value };
        setStrategy({ ...strategy, legs: newLegs });
    };

    const handleSave = () => {
        console.log('Saving Strategy DSL:', strategy);
        alert('Strategy Generated Successfully! DSL saved to Neural Vault.');
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-xl font-black uppercase tracking-tighter text-white">Visual Strategy Designer</h2>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Architect custom multi-leg exposure cycles</p>
                </div>
                <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-[var(--purple)] text-black text-[10px] font-black uppercase tracking-widest rounded hover:bg-white transition-colors"
                >
                    Deploy to Vault
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <div className="glass-panel p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase mb-2">Strategy Name</label>
                                <input
                                    type="text"
                                    value={strategy.name}
                                    onChange={(e) => setStrategy({ ...strategy, name: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded px-4 py-2 text-sm text-white focus:outline-none focus:border-[var(--purple)]"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase mb-2">Timeframe</label>
                                <select
                                    value={strategy.timeframe}
                                    onChange={(e) => setStrategy({ ...strategy, timeframe: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded px-4 py-2 text-sm text-white focus:outline-none"
                                >
                                    <option value="1m">1 MINUTE</option>
                                    <option value="5m">5 MINUTES</option>
                                    <option value="15m">15 MINUTES</option>
                                    <option value="1h">1 HOUR</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center px-2">
                            <h3 className="text-[10px] font-black text-[var(--purple)] uppercase tracking-[0.3em]">Execution Legs</h3>
                            <button
                                onClick={addLeg}
                                className="text-[10px] font-black text-white hover:text-[var(--purple)] uppercase tracking-widest"
                            >
                                + Add Component
                            </button>
                        </div>

                        {strategy.legs.map((leg, idx) => (
                            <LegForm
                                key={leg.id}
                                index={idx}
                                leg={leg}
                                onChange={updateLeg}
                                onRemove={removeLeg}
                            />
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="glass-panel p-6">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--purple)] mb-4">DSL Preview</h3>
                        <div className="bg-black/60 rounded p-4 h-[400px] overflow-auto">
                            <pre className="text-[10px] text-green-400 mono">
                                {JSON.stringify(strategy, null, 2)}
                            </pre>
                        </div>
                    </div>

                    <div className="glass-panel p-6 border-dashed border-white/10">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-4">Margin Estimate</h3>
                        <div className="flex justify-between items-end">
                            <span className="text-2xl font-black text-white">₹ 1,45,200</span>
                            <span className="text-[8px] font-bold text-gray-500 uppercase">Estimated required</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
