'use client';

import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Mic, Bell, Search, X, Zap, ArrowRight, MousePointer2, Cpu, Terminal, Power } from 'lucide-react';
import { DashboardData } from '../lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import ManualTradeTerminal from './ManualTradeTerminal';
import { useDashboard } from '../lib/DashboardContext';

interface HeaderProps {
    data: DashboardData;
    setSearchQuery: (query: string) => void;
}

export default function Header({ data, setSearchQuery }: HeaderProps) {
    const [timestamp, setTimestamp] = useState<string | null>(null);
    const [connected, setConnected] = useState(true);
    const [showVoiceModal, setShowVoiceModal] = useState(false);
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [voiceText, setVoiceText] = useState('Listening for commands...');
    const [searchInput, setSearchInput] = useState('');
    const [showManualTrade, setShowManualTrade] = useState(false);
    const { setSelectedSymbol, activeView, setActiveView, manualPower, setManualPower } = useDashboard();

    const popularSymbols = ['BTC/USD', 'ETH/USD', 'AAPL', 'TSLA', 'NIFTY50', 'RELIANCE'];

    useEffect(() => {
        setTimestamp(new Date().toLocaleTimeString());
        const timer = setInterval(() => setTimestamp(new Date().toLocaleTimeString()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleMicClick = () => {
        setShowVoiceModal(true);
        setTimeout(() => {
            setVoiceText('Command recognized: "Show APPL Chart"');
            setTimeout(() => {
                setShowVoiceModal(false);
                setVoiceText('Listening for commands...');
                setSearchQuery('AAPL');
            }, 1500);
        }, 2000);
    };

    const handleSearchSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (searchInput.trim()) {
            const sym = searchInput.toUpperCase();
            setSearchQuery(sym);
            setSelectedSymbol(sym);
            setShowSearchModal(false);
            setSearchInput('');
        }
    };

    return (
        <header className="h-16 border-b border-[var(--glass-border)] bg-[var(--background)]/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50">
            <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold tracking-wider text-[var(--cyan)]">MAHESHWARA <span className="text-[var(--purple)]">2.0</span></h1>
                <div className="h-4 w-[1px] bg-[var(--glass-border)] mx-2" />
                <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="mono" suppressHydrationWarning>{timestamp || '--:--:--'}</span>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--glass)] border border-[var(--glass-border)]">
                        <div className={`h-2 w-2 rounded-full ${connected ? 'bg-[var(--green)] shadow-[0_0_8px_var(--green)] animate-pulse' : 'bg-[var(--red)]'}`} />
                        <span className="text-[10px] font-bold uppercase tracking-tighter">{connected ? 'Live Sync' : 'Offline'}</span>
                    </div>
                </div>
            </div>


            <div className="flex items-center gap-8">
                <div className="hidden md:flex items-center gap-4 mr-4">
                    <button
                        onClick={() => setShowSearchModal(true)}
                        className="p-2 text-gray-400 hover:text-[var(--cyan)] transition-colors rounded-full hover:bg-white/5"
                    >
                        <Search size={18} />
                    </button>
                    <button
                        onClick={handleMicClick}
                        className="p-2 text-gray-400 hover:text-[var(--purple)] transition-colors rounded-full hover:bg-white/5 group"
                    >
                        <Mic size={18} className="group-hover:scale-110 transition-transform" />
                    </button>
                    <button
                        onClick={() => console.log("Notification: System Integrity Check Complete")}
                        className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5"
                    >
                        <Bell size={18} />
                    </button>
                    <button
                        onClick={() => setManualPower(!manualPower)}
                        className={`flex items-center gap-2 px-3 py-1.5 border rounded-full transition-all ${manualPower ? 'border-[var(--green)] text-[var(--green)] bg-[var(--green)]/10 shadow-[0_0_10px_rgba(0,255,100,0.2)]' : 'border-[var(--red)] text-[var(--red)] bg-[var(--red)]/10'}`}
                    >
                        <Power size={14} />
                        <span className="text-[9px] font-black uppercase tracking-widest">{manualPower ? 'MANUAL ON' : 'MANUAL OFF'}</span>
                    </button>
                    <button
                        onClick={() => setShowManualTrade(true)}
                        disabled={!manualPower}
                        className={`flex items-center gap-2 px-4 py-1.5 bg-[var(--purple)] hover:bg-[var(--purple)]/80 text-white rounded-full transition-all group shadow-[0_0_15px_rgba(170,0,255,0.3)] hover:shadow-[0_0_25px_rgba(170,0,255,0.5)] ${!manualPower ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <MousePointer2 size={14} className="group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Quick Trade</span>
                    </button>
                </div>

                <div className="flex flex-col items-end">
                    <span className="text-[9px] text-gray-500 uppercase tracking-tighter font-bold font-mono">Total Balance</span>
                    <motion.span
                        key={data?.portfolio?.equity}
                        initial={{ y: 5, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="mono text-lg font-black text-white"
                        suppressHydrationWarning
                    >
                        ${data?.portfolio?.equity?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                    </motion.span>
                </div>

                <div className="flex flex-col items-end min-w-[80px]">
                    <span className="text-[9px] text-gray-500 uppercase tracking-tighter font-bold">Daily P&L</span>
                    <motion.span
                        key={data?.portfolio?.dailyPnl}
                        initial={{ y: -5, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className={`mono text-lg font-black ${data?.portfolio?.dailyPnl >= 0 ? 'text-[var(--green)]' : 'text-[var(--red)]'}`}
                        suppressHydrationWarning
                    >
                        {data?.portfolio?.dailyPnl >= 0 ? '+' : ''}{data?.portfolio?.dailyPnlPercent?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}%
                    </motion.span>
                </div>
            </div>

            {/* Voice Modal Overhead */}
            <AnimatePresence>
                {showVoiceModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="glass-panel p-12 flex flex-col items-center gap-8 max-w-lg w-full border-[var(--purple)]/50"
                        >
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full bg-[var(--purple)]/20 flex items-center justify-center border-4 border-[var(--purple)] shadow-[0_0_30px_rgba(170,0,255,0.4)]">
                                    <Mic size={40} className="text-white animate-pulse" />
                                </div>
                            </div>

                            <div className="text-center space-y-4">
                                <h2 className="text-2xl font-black text-white uppercase tracking-widest italic">{voiceText}</h2>
                                <div className="flex justify-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            animate={{ height: [8, 24, 8] }}
                                            transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                                            className="w-1 bg-[var(--cyan)] rounded-full"
                                        />
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={() => setShowVoiceModal(false)}
                                className="mt-4 px-6 py-2 rounded-full border border-[var(--glass-border)] text-[10px] font-black text-gray-500 hover:text-white hover:bg-white/5 transition-all uppercase tracking-widest"
                            >
                                Cancel Command
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Search Modal */}
            <AnimatePresence>
                {showSearchModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-start justify-center bg-black/80 backdrop-blur-md pt-[15vh]"
                    >
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            className="glass-panel p-8 w-full max-w-2xl border-[var(--glass-border)] shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-lg font-black text-white uppercase tracking-[0.2em]">Neural Search Engine</h2>
                                <button onClick={() => setShowSearchModal(false)} className="p-2 text-gray-500 hover:text-white transition-all">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSearchSubmit} className="relative group">
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Search Stocks, Crypto, Indices (e.g. NIFTY50, BTC)..."
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    className="w-full bg-black/60 border-2 border-[var(--glass-border)] focus:border-[var(--cyan)] rounded-xl px-12 py-4 text-lg text-white outline-none transition-all placeholder:text-gray-600 font-bold"
                                />
                                <Search size={24} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[var(--cyan)] transition-colors" />
                                <button className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-[var(--glass)] text-[var(--cyan)] hover:bg-[var(--cyan)] hover:text-black transition-all">
                                    <ArrowRight size={20} />
                                </button>
                            </form>

                            <div className="mt-8">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Institutional Favorites</p>
                                <div className="flex flex-wrap gap-3">
                                    {popularSymbols.map(sym => (
                                        <button
                                            key={sym}
                                            onClick={() => {
                                                const newSym = sym.toUpperCase();
                                                setSearchQuery(newSym);
                                                setSelectedSymbol(newSym);
                                                setSearchInput('');
                                                setShowSearchModal(false);
                                            }}
                                            className="px-4 py-2 rounded-lg bg-white/5 border border-white/5 text-xs font-bold text-gray-300 hover:bg-[var(--cyan)] hover:text-black hover:border-[var(--cyan)] transition-all"
                                        >
                                            {sym}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-8 p-4 rounded-xl bg-[var(--purple)]/10 border border-[var(--purple)]/20">
                                <div className="flex items-center gap-3">
                                    <Zap size={16} className="text-[var(--purple)]" />
                                    <p className="text-[10px] font-bold text-gray-400 uppercase leading-none">AI Insight: NIFTY50 currently testing key resistance at 22,140. Neural sentiment is neutral-bullish.</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <ManualTradeTerminal
                isOpen={showManualTrade}
                onClose={() => setShowManualTrade(false)}
            />
        </header>
    );
}
