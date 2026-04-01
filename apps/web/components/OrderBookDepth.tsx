'use client';

import React, { useEffect, useState, useRef } from 'react';

interface DepthData {
    bids: [string, string][];
    asks: [string, string][];
    timestamp: string;
}

export default function OrderBookDepth({ symbol = 'BTCUSDT' }: { symbol?: string }) {
    const [depth, setDepth] = useState<DepthData | null>(null);
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket(`ws://localhost:8000/ws/depth/${symbol}`);
        ws.onmessage = (event) => {
            setDepth(JSON.parse(event.data));
        };
        wsRef.current = ws;
        return () => ws.close();
    }, [symbol]);

    if (!depth) return (
        <div className="glass-panel h-full flex items-center justify-center">
            <div className="text-[10px] mono text-gray-500 animate-pulse uppercase">Syncing LOB...</div>
        </div>
    );

    const maxVol = Math.max(
        ...depth.bids.map(b => parseFloat(b[1])),
        ...depth.asks.map(a => parseFloat(a[1]))
    );

    return (
        <div className="glass-panel p-4 h-full flex flex-col font-mono text-[10px]">
            <div className="flex justify-between mb-2 text-gray-500 uppercase tracking-widest text-[8px] font-bold">
                <span>Price (USDT)</span>
                <span>Amount</span>
            </div>

            {/* Asks (Sell Wall) - Reversed to show highest first */}
            <div className="flex-1 flex flex-col-reverse justify-end overflow-hidden mb-2">
                {depth.asks.slice(0, 10).map(([price, amount], i) => (
                    <div key={`ask-${i}`} className="relative flex justify-between py-0.5 group">
                        <div
                            className="absolute right-0 top-0 h-full bg-[var(--red)]/10"
                            style={{ width: `${(parseFloat(amount) / maxVol) * 100}%` }}
                        />
                        <span className="text-[var(--red)] z-10">{parseFloat(price).toFixed(2)}</span>
                        <span className="text-gray-400 z-10">{parseFloat(amount).toFixed(4)}</span>
                    </div>
                ))}
            </div>

            {/* Spread */}
            <div className="py-2 border-y border-white/5 my-1 text-center">
                <span className="text-white font-bold">
                    {Math.abs(parseFloat(depth.asks[0][0]) - parseFloat(depth.bids[0][0])).toFixed(2)}
                </span>
                <span className="text-[8px] text-gray-600 ml-2 uppercase">Spread</span>
            </div>

            {/* Bids (Buy Wall) */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {depth.bids.slice(0, 10).map(([price, amount], i) => (
                    <div key={`bid-${i}`} className="relative flex justify-between py-0.5 group">
                        <div
                            className="absolute left-0 top-0 h-full bg-[var(--cyan)]/10"
                            style={{ width: `${(parseFloat(amount) / maxVol) * 100}%` }}
                        />
                        <span className="text-[var(--cyan)] z-10">{parseFloat(price).toFixed(2)}</span>
                        <span className="text-gray-400 z-10">{parseFloat(amount).toFixed(4)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
