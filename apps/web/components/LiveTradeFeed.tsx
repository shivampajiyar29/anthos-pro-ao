'use client';

import React, { useState } from 'react';
import { ShoppingCart, Filter } from 'lucide-react';
import { Trade } from '../lib/types';
import { motion, AnimatePresence } from 'framer-motion';

export default function LiveTradeFeed({ trades }: { trades: Trade[] }) {
    const [filter, setFilter] = useState('ALL');
    const [showFullHistory, setShowFullHistory] = useState(false);

    const sortedTrades = [...trades].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

    const filteredTrades = filter === 'ALL'
        ? sortedTrades
        : sortedTrades.filter(t => t.agent?.toUpperCase() === filter);

    const displayTrades = showFullHistory ? filteredTrades : filteredTrades.slice(0, 10);

    const agents = ['ALL', ...Array.from(new Set(trades.map(t => t.agent?.toUpperCase()).filter(Boolean) as string[]))];

    return (
        <div className={`glass-panel p-6 overflow-hidden flex flex-col ${showFullHistory ? 'h-auto min-h-[400px]' : 'h-[400px]'}`}>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                        Institutional Order Flow
                        <ShoppingCart size={14} className="text-[var(--cyan)]" />
                    </h3>
                    <button
                        onClick={() => setShowFullHistory(!showFullHistory)}
                        className={`px-3 py-1 rounded bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest transition-all ${showFullHistory ? 'text-[var(--purple)] border-[var(--purple)]/50' : 'text-gray-500'}`}
                    >
                        {showFullHistory ? 'Hide History' : 'View Full History'}
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <Filter size={12} className="text-gray-500" />
                    <div className="flex p-0.5 bg-black/40 rounded-lg border border-[var(--glass-border)]">
                        {agents.map((a) => (
                            <button
                                key={a}
                                onClick={() => setFilter(a)}
                                className={`px-2 py-1 rounded-md text-[9px] font-black transition-all ${filter === a ? 'bg-[var(--glass)] text-white' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                {a}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin">
                <AnimatePresence mode="popLayout">
                    {displayTrades.map((trade, index) => (
                        <motion.div
                            key={`${trade.time}-${index}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="grid grid-cols-6 gap-4 p-3 rounded-lg bg-white/5 border border-white/5 hover:border-[var(--glass-border)] transition-all group items-center"
                        >
                            <div className="col-span-1 text-[9px] mono text-gray-500 font-bold">
                                {trade.time}
                            </div>
                            <div className="col-span-1">
                                <div className="text-[10px] font-black text-white">{trade.symbol}</div>
                                <div className="text-[8px] text-[var(--cyan)] font-bold">{trade.agent}</div>
                            </div>
                            <div className="col-span-1">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-black ${trade.action === 'BUY' ? 'bg-[var(--green)]/10 text-[var(--green)]' : 'bg-[var(--red)]/10 text-[var(--red)]'}`}>
                                    {trade.action}
                                </span>
                            </div>
                            <div className="col-span-1 text-[10px] mono text-white font-bold">
                                {trade.quantity}
                            </div>
                            <div className="col-span-1 text-[10px] mono text-gray-400" suppressHydrationWarning>
                                <div className="flex flex-col">
                                    <span>${trade.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    <div className="flex gap-2 mt-0.5">
                                        {trade.target_price && <span className="text-[7px] text-[var(--purple)]/70 font-bold">T: ${trade.target_price}</span>}
                                        {trade.stop_loss && <span className="text-[7px] text-[var(--red)]/70 font-bold">S: ${trade.stop_loss}</span>}
                                    </div>
                                </div>
                            </div>
                            <div className={`col-span-1 text-right mono text-[10px] font-black ${trade.pnl === undefined ? 'text-gray-500' : trade.pnl >= 0 ? 'text-[var(--green)]' : 'text-[var(--red)]'}`} suppressHydrationWarning>
                                {trade.status === 'OPEN' ? (
                                    <span className="px-1.5 py-0.5 rounded bg-[var(--cyan)]/20 text-[var(--cyan)] text-[8px] animate-pulse">ACTIVE</span>
                                ) : (
                                    trade.pnl === undefined ? '--' : `${trade.pnl >= 0 ? '+' : ''}$${trade.pnl.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
