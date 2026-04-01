'use client';

import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface HeatmapItem {
    s: string; // symbol
    c: number; // close
    o: number; // open
    v: number; // volume
}

export default function MarketHeatmap() {
    const [data, setData] = useState<HeatmapItem[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const res = await fetch('http://localhost:8000/api/heatmap');
            const json = await res.json();
            // Sort by volume descending and take top 50
            const sorted = json.sort((a: any, b: any) => b.v - a.v).slice(0, 48);
            setData(sorted);
            setLoading(false);
        } catch (e) {
            console.error("Heatmap fetch error:", e);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return (
        <div className="glass-panel h-[400px] flex items-center justify-center">
            <div className="text-[10px] mono text-[var(--purple)] animate-pulse uppercase tracking-[0.5em]">Scanning Biosignals...</div>
        </div>
    );

    return (
        <div className="glass-panel p-4 h-full relative overflow-hidden group">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-1 h-3 bg-[var(--purple)] rounded-full animate-pulse" />
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-200">Global Neural Network</h3>
                </div>
                <div className="text-[8px] mono text-gray-500 uppercase font-black">24H PERFORMANCE SECTOR</div>
            </div>

            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 overflow-y-auto max-h-[320px] scrollbar-hide">
                {data.map((item) => {
                    const change = ((item.c - item.o) / item.o) * 100;
                    const isPositive = change >= 0;
                    // Determine color intensity based on change
                    const intensity = Math.min(Math.abs(change) * 20, 100);
                    const bgColor = isPositive
                        ? `rgba(0, 255, 255, ${0.05 + intensity / 300})`
                        : `rgba(255, 0, 0, ${0.05 + intensity / 300})`;
                    const borderColor = isPositive
                        ? `rgba(0, 255, 255, ${0.1 + intensity / 200})`
                        : `rgba(255, 0, 0, ${0.1 + intensity / 200})`;

                    return (
                        <div
                            key={item.s}
                            className="aspect-square flex flex-col items-center justify-center p-1 rounded border transition-all hover:scale-105 hover:z-10 cursor-pointer"
                            style={{ backgroundColor: bgColor, borderColor: borderColor }}
                        >
                            <span className="text-[8px] font-black text-gray-300 mb-0.5 truncate w-full text-center">
                                {item.s.replace('USDT', '')}
                            </span>
                            <div className={`flex items-center gap-0.5 ${isPositive ? 'text-[var(--cyan)]' : 'text-[var(--red)]'}`}>
                                {isPositive ? <TrendingUp size={8} /> : <TrendingDown size={8} />}
                                <span className="text-[7px] font-bold mono">
                                    {Math.abs(change).toFixed(1)}%
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="absolute bottom-2 right-4 flex gap-4 text-[7px] mono font-bold text-gray-600">
                <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--cyan)]" /> POSITIVE FLOW
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--red)]" /> NEGATIVE OUTFLOW
                </div>
            </div>
        </div>
    );
}
