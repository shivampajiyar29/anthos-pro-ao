'use client';

import React from 'react';
import { Trophy, Crown } from 'lucide-react';
import { motion } from 'framer-motion';

function Sparkline({ data, color }: { data: number[]; color: string }) {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min;
    const width = 60;
    const height = 20;
    const points = data.map((v, i) => ({
        x: (i / (data.length - 1)) * width,
        y: height - ((v - min) / range) * height
    }));
    const pathData = `M ${points.map(p => `${p.x} ${p.y}`).join(' L ')}`;

    return (
        <svg width={width} height={height} className="overflow-visible">
            <path
                d={pathData}
                fill="none"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export default function Leaderboard({ data, agents = [] }: { data: [string, number][], agents?: any[] }) {
    return (
        <div className="glass-panel p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                    Competition Leaderboard
                    <Trophy size={14} className="text-yellow-500" />
                </h3>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {data.map(([name, pnl], index) => {
                    const agent = agents.find(a => a.name === name);
                    const sparklineData = agent?.pnlHistory || [pnl - 0.5, pnl - 0.2, pnl + 0.1, pnl];

                    return (
                        <motion.div
                            key={name}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`flex items-center justify-between p-3 rounded-lg border transition-all ${index === 0 ? 'bg-gradient-to-r from-yellow-500/10 to-transparent border-yellow-500/30' : 'bg-white/5 border-white/5'}`}
                        >
                            <div className="flex items-center gap-3">
                                <span className={`text-xs font-black mono w-4 ${index === 0 ? 'text-yellow-500' : 'text-gray-500'}`}>
                                    #{index + 1}
                                </span>
                                <div className="relative">
                                    <span className="text-xs font-bold text-white uppercase tracking-tight">{name}</span>
                                    {index === 0 && <Crown size={10} className="absolute -top-3 -right-3 text-yellow-500 animate-bounce" />}
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <Sparkline data={sparklineData} color={pnl >= 0 ? 'var(--green)' : 'var(--red)'} />
                                <span className={`mono text-xs font-black ${pnl >= 0 ? 'text-[var(--green)]' : 'text-[var(--red)]'}`} suppressHydrationWarning>
                                    {pnl > 0 ? '+' : ''}{pnl.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%
                                </span>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
