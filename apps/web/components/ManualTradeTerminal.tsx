'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, ArrowUpRight, ArrowDownRight, DollarSign, Activity, Percent } from 'lucide-react';
import { useDashboard } from '../lib/DashboardContext';
import { useMarket } from '../lib/MarketContext';

interface ManualTradeTerminalProps {
    isOpen?: boolean;
    onClose?: () => void;
    isInline?: boolean;
}

export default function ManualTradeTerminal({ isOpen = true, onClose = () => { }, isInline = false }: ManualTradeTerminalProps) {
    const { selectedSymbol } = useDashboard();
    const { tick } = useMarket(selectedSymbol); // Use selectedSymbol by default
    const [symbol, setSymbol] = useState(selectedSymbol);
    const [quantity, setQuantity] = useState('1.0');
    const [price, setPrice] = useState('52000.0');
    const [targetPrice, setTargetPrice] = useState('55000.0');
    const [stopLoss, setStopLoss] = useState('48000.0');
    const [isExecuting, setIsExecuting] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    // Sync symbol when dashboard symbol changes
    React.useEffect(() => {
        setSymbol(selectedSymbol);
        if (tick) setPrice(tick.price.toString());
    }, [selectedSymbol, tick]);

    const handleExecution = async (action: 'BUY' | 'SELL') => {
        setIsExecuting(true);
        setStatus(null);
        try {
            const response = await fetch('http://localhost:8000/api/trades/manual', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    symbol,
                    action,
                    quantity: parseFloat(quantity),
                    price: parseFloat(price),
                    target_price: parseFloat(targetPrice),
                    stop_loss: parseFloat(stopLoss)
                })
            });

            if (!response.ok) throw new Error('Execution failed');

            setStatus({ type: 'success', message: `${action} Order Executed Successfully` });
            setTimeout(() => {
                setStatus(null);
                onClose();
            }, 2000);
        } catch (error) {
            setStatus({ type: 'error', message: 'Execution Error: Check API Connection' });
        } finally {
            setIsExecuting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className={!isInline ? "fixed inset-0 z-[100] flex items-center justify-center p-4" : "relative w-full h-full"}>
                    {!isInline && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                    )}

                    <motion.div
                        initial={!isInline ? { opacity: 0, scale: 0.9, y: 20 } : { opacity: 1 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className={`relative w-full ${isInline ? 'h-full border-none shadow-none' : 'max-w-md border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]'} bg-[#0a0a0c] rounded-3xl overflow-hidden`}
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-[var(--purple)]/10 to-transparent">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[var(--purple)]/20 rounded-lg">
                                    <Zap size={20} className="text-[var(--purple)]" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-white uppercase tracking-widest">Manual Trade Terminal</h3>
                                    <p className="text-[8px] text-gray-500 font-bold uppercase tracking-tighter">DIRECT NEURAL EXECUTION INTERFACE</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                <X size={20} className="text-gray-400" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            {/* Live Price Badge */}
                            <div className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5">
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Market Price</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--cyan)] animate-pulse" />
                                        <span className="text-xl font-black text-white mono">${tick?.price.toLocaleString() || '---'}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">24h Change</span>
                                    <div className={`text-xs font-black ${tick && tick.change_pct >= 0 ? 'text-[var(--green)]' : 'text-[var(--red)]'}`}>
                                        {tick && tick.change_pct >= 0 ? '+' : ''}{tick?.change_pct.toFixed(2)}%
                                    </div>
                                </div>
                            </div>

                            {status && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    className={`p-3 rounded-xl text-[10px] font-bold text-center uppercase tracking-widest ${status.type === 'success' ? 'bg-[var(--green)]/10 text-[var(--green)] border border-[var(--green)]/20' : 'bg-[var(--red)]/10 text-[var(--red)] border border-[var(--red)]/20'}`}
                                >
                                    {status.message}
                                </motion.div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Symbol</label>
                                    <div className="relative group">
                                        <Activity size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[var(--cyan)] transition-colors" />
                                        <input
                                            type="text"
                                            value={symbol}
                                            onChange={(e) => setSymbol(e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs font-bold text-white outline-none focus:border-[var(--cyan)]/50 transition-all uppercase"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Quantity</label>
                                    <div className="relative group">
                                        <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[var(--purple)] transition-colors" />
                                        <input
                                            type="number"
                                            value={quantity}
                                            onChange={(e) => setQuantity(e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs font-bold text-white outline-none focus:border-[var(--purple)]/50 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Execution Price (Limit)</label>
                                <div className="relative group">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 font-bold">$</span>
                                    <input
                                        type="number"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Target Price</label>
                                    <div className="relative group">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 font-bold">$</span>
                                        <input
                                            type="number"
                                            value={targetPrice}
                                            onChange={(e) => setTargetPrice(e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs font-bold text-white outline-none focus:border-[var(--purple)]/50 transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Stop Loss</label>
                                    <div className="relative group">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 font-bold">$</span>
                                        <input
                                            type="number"
                                            value={stopLoss}
                                            onChange={(e) => setStopLoss(e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs font-bold text-white outline-none focus:border-[var(--red)]/50 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4">
                                <button
                                    disabled={isExecuting}
                                    onClick={() => handleExecution('BUY')}
                                    className="relative group bg-[var(--green)] hover:bg-[var(--green)]/90 disabled:opacity-50 text-black py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all overflow-hidden flex items-center justify-center gap-2"
                                >
                                    <ArrowUpRight size={16} />
                                    BUY LONG
                                    {isExecuting && <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20 animate-loading" />}
                                </button>
                                <button
                                    disabled={isExecuting}
                                    onClick={() => handleExecution('SELL')}
                                    className="relative group bg-[var(--red)] hover:bg-[var(--red)]/80 disabled:opacity-50 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all overflow-hidden flex items-center justify-center gap-2"
                                >
                                    <ArrowDownRight size={16} />
                                    SELL SHORT
                                    {isExecuting && <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20 animate-loading" />}
                                </button>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 bg-white/5 flex items-center justify-center gap-4 border-t border-white/5">
                            <div className="flex items-center gap-1">
                                <div className="w-1 h-1 rounded-full bg-green-500" />
                                <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Encrypted Stream</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-1 h-1 rounded-full bg-[var(--purple)]" />
                                <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Institutional Mode</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
