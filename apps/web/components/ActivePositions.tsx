'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, TrendingUp, TrendingDown, Target, DollarSign, XCircle, LogOut } from 'lucide-react';
import { Position } from '@/lib/types';

interface ActivePositionsProps {
    positions: Position[];
}

export default function ActivePositions({ positions }: ActivePositionsProps) {
    return (
        <div className="glass-panel p-6 border-l-4 border-l-[var(--purple)]">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[var(--purple)]/20 rounded-lg">
                        <Activity size={20} className="text-[var(--purple)]" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-white uppercase tracking-widest">Active Neural Positions</h3>
                        <p className="text-[8px] text-gray-500 font-bold uppercase tracking-tighter">LIVE PAPER TRADING EXPOSURE</p>
                    </div>
                </div>
                <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10">
                    <span className="text-[10px] mono text-white font-bold">{positions.length} ACTIVE</span>
                </div>
            </div>

            <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                    {positions.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="py-12 flex flex-col items-center justify-center gap-3 opacity-30"
                        >
                            <TrendingUp size={32} className="text-gray-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">No Active Positions</span>
                        </motion.div>
                    ) : (
                        positions.map((pos, idx) => (
                            <motion.div
                                key={`${pos.symbol}-${idx}`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="group relative bg-black/40 border border-white/5 rounded-xl p-4 hover:border-[var(--purple)]/50 transition-all overflow-hidden"
                            >
                                {/* PnL Background Gradient */}
                                <div className={`absolute inset-0 opacity-5 pointer-events-none bg-gradient-to-r ${pos.pnl >= 0 ? 'from-[var(--green)]' : 'from-[var(--red)]'} to-transparent`} />

                                <div className="flex items-center justify-between relative z-10">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-lg ${pos.side === 'BUY' ? 'bg-[var(--green)]/10 text-[var(--green)]' : 'bg-[var(--red)]/10 text-[var(--red)]'}`}>
                                            {pos.side === 'BUY' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-black text-white italic tracking-widest">{pos.symbol}</span>
                                                <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${pos.side === 'BUY' ? 'border-[var(--green)] text-[var(--green)] bg-[var(--green)]/5' : 'border-[var(--red)] text-[var(--red)] bg-[var(--red)]/5'}`}>
                                                    {pos.side === 'BUY' ? 'LONG' : 'SHORT'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-[10px] mono text-gray-400">Qty: {pos.quantity}</span>
                                                <span className="text-[10px] mono text-gray-400">@ ${pos.entry_price.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className={`text-sm font-black mono tracking-tighter ${pos.pnl >= 0 ? 'text-[var(--green)]' : 'text-[var(--red)]'}`}>
                                            {pos.pnl >= 0 ? '+' : ''}${Math.abs(pos.pnl).toLocaleString()}
                                        </div>
                                        <div className={`text-[10px] font-bold mono ${pos.pnl >= 0 ? 'text-[var(--green)]/70' : 'text-[var(--red)]/70'}`}>
                                            {pos.pnl >= 0 ? '+' : ''}{pos.pnl_percent}%
                                        </div>
                                        <button
                                            onClick={async (e) => {
                                                e.stopPropagation();
                                                if (confirm(`Close ${pos.symbol} position?`)) {
                                                    try {
                                                        const res = await fetch('http://localhost:8000/api/positions/close', {
                                                            method: 'POST',
                                                            headers: { 'Content-Type': 'application/json' },
                                                            body: JSON.stringify({ symbol: pos.symbol })
                                                        });
                                                        if (!res.ok) alert('Failed to close position');
                                                    } catch (err) {
                                                        console.error(err);
                                                    }
                                                }
                                            }}
                                            className="mt-2 p-1.5 rounded bg-white/5 hover:bg-[var(--red)]/20 text-gray-500 hover:text-[var(--red)] transition-all flex items-center gap-1.5 ml-auto group/close"
                                        >
                                            <LogOut size={10} />
                                            <span className="text-[8px] font-black uppercase">Close Position</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Progress toward Target */}
                                {pos.target_price && (
                                    <div className="mt-4 pt-4 border-t border-white/5 relative z-10">
                                        <div className="flex justify-between items-center mb-1.5">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-1.5">
                                                    <Target size={10} className="text-[var(--purple)]" />
                                                    <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Target: ${pos.target_price.toLocaleString()}</span>
                                                </div>
                                                {pos.stop_loss && (
                                                    <div className="flex items-center gap-1.5">
                                                        <XCircle size={10} className="text-[var(--red)]" />
                                                        <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Stop: ${pos.stop_loss.toLocaleString()}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-[8px] mono text-gray-500">Current: ${pos.current_price.toLocaleString()}</span>
                                        </div>
                                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${Math.min(100, Math.max(0, (pos.current_price / pos.target_price) * 100))}%` }}
                                                className="h-full bg-[var(--purple)]"
                                            />
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
