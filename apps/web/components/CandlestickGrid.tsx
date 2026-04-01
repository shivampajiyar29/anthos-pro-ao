'use client';

import React from 'react';
import CandleChart from './CandleChart';

export default function CandlestickGrid() {
    const assets = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT'];
    const intervals = ['1m', '5m', '15m', '1h'];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[var(--purple)] rounded-full animate-ping" />
                    <h2 className="text-sm font-bold uppercase tracking-widest text-white">Quantum Matrix: Multi-Timeframe View</h2>
                </div>
                <div className="flex gap-4 text-[8px] mono font-bold text-gray-500 uppercase tracking-tighter">
                    <span>Engine: Maheshwara Neural-1</span>
                    <span>Latency: &lt;50ms</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {assets.map(asset => (
                    intervals.map(interval => (
                        <div key={`${asset}-${interval}`} className="glass-panel p-2 hover:border-[var(--purple)]/50 transition-colors">
                            <CandleChart
                                symbol={asset}
                                interval={interval}
                                height={120}
                            />
                        </div>
                    ))
                ))}
            </div>
        </div>
    );
}
