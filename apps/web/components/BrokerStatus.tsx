'use client';

import React from 'react';
import { Signal, Globe, Zap, Activity, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const BROKERS = [
    { name: 'MetaTrader 5', type: 'Forex/CFD', latency: '12ms', status: 'optimal' },
    { name: 'Alpaca', type: 'Equities', latency: '24ms', status: 'optimal' },
    { name: 'Upstox', type: 'NSE/BSE', latency: '48ms', status: 'optimal' },
    { name: 'Binance', type: 'Crypto', latency: '42ms', status: 'optimal' }
];

export default function BrokerStatus({ isLiveMode = false }: { isLiveMode?: boolean }) {
    return (
        <div className="glass-panel p-6 h-full relative overflow-hidden">
            {isLiveMode && (
                <div className="absolute top-0 right-0 px-3 py-1 bg-red-600/20 border-b border-l border-red-500/30 text-[8px] font-black text-red-500 uppercase tracking-[0.2em] z-20 animate-pulse">
                    Live Production Mode
                </div>
            )}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                    Broker Connectivity
                    <Signal size={14} className="text-[var(--cyan)]" />
                </h3>
                <div className="text-[10px] text-gray-500 font-bold">4 ACTIVE NODES</div>
            </div>

            <div className="grid grid-cols-1 gap-3">
                {BROKERS.map((broker) => (
                    <div
                        key={broker.name}
                        className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-[var(--glass-border)] transition-all group"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${broker.status === 'optimal' ? 'bg-[var(--green)]/10 text-[var(--green)]' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                <Globe size={14} />
                            </div>
                            <div>
                                <div className="text-[11px] font-black text-white uppercase">{broker.name}</div>
                                <div className="text-[9px] text-gray-500 font-bold">{broker.type}</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <div className="text-[10px] mono font-bold text-gray-400 group-hover:text-white transition-colors">{broker.latency}</div>
                                <div className="text-[8px] font-bold uppercase tracking-tighter text-gray-600">Last Sync: {new Date().toLocaleTimeString()}</div>
                            </div>
                            <div className={`h-1.5 w-1.5 rounded-full ${broker.status === 'optimal' ? 'bg-[var(--green)] shadow-[0_0_8px_var(--green)] animate-pulse' : 'bg-yellow-500 shadow-[0_0_8px_gold]'}`} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
