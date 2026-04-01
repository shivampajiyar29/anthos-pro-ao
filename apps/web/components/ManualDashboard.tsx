'use client';

import React from 'react';
import CandleChart from './CandleChart';
import MarketHeatmap from './MarketHeatmap';
import OrderBookDepth from './OrderBookDepth';
import PerformanceMetrics from './PerformanceMetrics';
import TimeMachine from './TimeMachine';
import CandlestickGrid from './CandlestickGrid';
import LiveTradeFeed from './LiveTradeFeed';
import { useDashboard } from '@/lib/DashboardContext';
import { motion } from 'framer-motion';
import { Terminal, Send, ShieldCheck, Activity, TrendingUp, TrendingDown, DollarSign, Zap, MousePointer2 } from 'lucide-react';
import ManualTradeTerminal from './ManualTradeTerminal';

import ActivePositions from './ActivePositions';

export default function ManualDashboard() {
    const {
        selectedSymbol,
        manualPower,
        displayData,
        historyIndex,
        maxIndex,
        setHistoryIndex,
        isPaused,
        setIsPaused,
        isLiveMode
    } = useDashboard();

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            {/* ... rest of the file ... */}
            {/* Top Metrics Sync (Mirroring Algo Dashboard) */}
            <PerformanceMetrics metrics={displayData.metrics} />

            {/* Time Machine Sync (Mirroring Algo Dashboard) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-8">
                    <TimeMachine
                        currentIndex={historyIndex}
                        maxIndex={maxIndex}
                        onIndexChange={setHistoryIndex}
                        isPaused={isPaused}
                        setIsPaused={setIsPaused}
                    />
                </div>
                <div className="lg:col-span-4 hidden lg:block">
                    <div className={`glass-panel px-4 py-2 flex items-center justify-between border-dashed ${manualPower ? 'border-[var(--green)]/30' : 'border-[var(--red)]/30'}`}>
                        <div className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full ${manualPower ? 'bg-[var(--green)] animate-pulse' : 'bg-[var(--red)]'}`} />
                            <span className={`text-[10px] font-black uppercase tracking-widest ${manualPower ? 'text-[var(--green)]' : 'text-[var(--red)]'}`} suppressHydrationWarning>
                                {manualPower ? 'Manual Execution Authorized' : 'Manual Execution Locked'}
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            {isLiveMode && (
                                <div className="flex items-center gap-2 px-2 py-0.5 bg-red-600/20 border border-red-500/50 rounded text-[8px] font-black text-red-500 animate-pulse" suppressHydrationWarning>
                                    LIVE PORTFOLIO
                                </div>
                            )}
                            <span className="text-[10px] mono text-gray-500 font-bold">MODE: OWNER</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Main Control Column */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="glass-panel p-4">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--cyan)] mb-4 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-[var(--cyan)] rounded-full animate-pulse" />
                            {selectedSymbol} Professional Terminal • Direct Feed
                        </h3>
                        <div className="h-[450px]">
                            <CandleChart symbol={selectedSymbol} interval="1m" showIndicators={true} height={450} />
                        </div>
                    </div>

                    <div className="h-[300px]">
                        <MarketHeatmap />
                    </div>

                    {/* Manual Trade Arena (Replacing Agent Arena) */}
                    <div className="glass-panel p-6 border-l-4 border-l-[var(--cyan)]">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-[var(--cyan)]/10 text-[var(--cyan)] border border-[var(--cyan)]/20">
                                    <Terminal size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black uppercase tracking-widest text-white italic">Direct Trading Arena</h3>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">Manual Execution Layer • Zero AI Interference</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <ShieldCheck size={20} className={manualPower ? 'text-[var(--green)]' : 'text-gray-600'} />
                                <span className={`text-xs font-black mono ${manualPower ? 'text-white' : 'text-gray-600'}`}>
                                    {manualPower ? 'ENCRYPTED • ON' : 'LOCKED • OFF'}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {manualPower ? (
                                <ManualTradeTerminal isInline={true} />
                            ) : (
                                <div className="p-12 flex flex-col items-center justify-center gap-4 bg-white/5 border border-dashed border-white/10 rounded-2xl opacity-40">
                                    <ShieldCheck size={48} className="text-gray-600" />
                                    <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">Security Interlock Active</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Secondary Data Column */}
                <div className="lg:col-span-4 space-y-6 flex flex-col">
                    <div className="h-[400px]">
                        <OrderBookDepth symbol={selectedSymbol} />
                    </div>

                    <ActivePositions positions={displayData.positions || []} />

                    {/* Manual Portfolio/History (Replacing Risk Hologram) */}
                    <div className="glass-panel p-5 space-y-4 bg-gradient-to-br from-[var(--cyan)]/10 to-transparent">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-white mb-2 flex items-center gap-2">
                            <Activity size={12} className="text-[var(--cyan)]" />
                            Owner Analytics
                        </h3>
                        <div className="space-y-4">
                            <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                                <span className="text-[10px] font-black text-gray-500 uppercase block mb-1">Exposure Ratio</span>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-[var(--cyan)] w-[35%]" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                                    <span className="text-[10px] font-black text-gray-500 uppercase block mb-1">Trades</span>
                                    <span className="mono text-white text-lg font-black">12/Day</span>
                                </div>
                                <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                                    <span className="text-[10px] font-black text-gray-500 uppercase block mb-1">Accuracy</span>
                                    <span className="mono text-[var(--green)] text-lg font-black">82%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="flex-1 glass-panel p-4 flex flex-col justify-center gap-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Zap size={18} className="text-[var(--cyan)]" />
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">Latency</span>
                            </div>
                            <span className="mono text-[var(--green)] text-[10px] font-bold">1.2 MS</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <DollarSign size={18} className="text-[var(--purple)]" />
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">Fees Saved</span>
                            </div>
                            <span className="mono text-white text-[10px] font-bold">$245.12</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="glass-panel p-6">
                <CandlestickGrid />
            </div>

            <LiveTradeFeed trades={displayData.trades} />
        </motion.div>
    );
}
