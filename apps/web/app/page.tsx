'use client';

import React, { useState, useEffect } from 'react';
import {
    TrendingUp,
    TrendingDown,
    Activity,
    Shield,
    Zap,
    Cpu,
    History,
    Unplug,
    Search,
    MoreHorizontal,
    Play,
    Settings
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';

// Dynamic import for charts to avoid SSR issues
const Chart = dynamic(() => import('@/components/dashboard/MainChart'), { ssr: false });

export default function QuantDashboard() {
    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            {/* Top Summary Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <SummaryCard
                    label="Total Equity"
                    value="₹1,235,672"
                    icon={TrendingUp}
                    trend="+4.02%"
                    isPositive={true}
                />
                <SummaryCard
                    label="Daily PnL"
                    value="₹930"
                    icon={Activity}
                    trend="+1.2%"
                    isPositive={true}
                />
                <SummaryCard
                    label="Open Positions"
                    value="2"
                    icon={Zap}
                    subValue="4 active"
                />
                <SummaryCard
                    label="Market Regime"
                    value="Strong Uptrend"
                    icon={Shield}
                    isRegime={true}
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-12 gap-6">
                {/* Center Column: Chart & Bottom Widgets */}
                <div className="col-span-12 lg:col-span-8 space-y-6">
                    {/* Main Chart Card */}
                    <div className="bg-brand-panel border border-brand-border rounded-xl p-6 h-[500px] relative overflow-hidden group">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-4">
                                <span className="text-xs font-black text-brand-text-secondary uppercase tracking-[0.2em]">Live Market Perception</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
                                    <span className="text-[10px] font-black text-brand-accent uppercase tracking-widest">Active Sync</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 bg-black/20 rounded-lg p-1 border border-brand-border">
                                {['1m', '5m', '15m', '1h', '1d'].map(tf => (
                                    <button key={tf} className={cn(
                                        "px-3 py-1 text-[10px] font-black uppercase rounded transition-all",
                                        tf === '15m' ? "bg-brand-accent text-brand-bg shadow-lg shadow-brand-accent/20" : "text-brand-text-muted hover:text-white"
                                    )}>
                                        {tf}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="h-[400px] w-full">
                            <Chart />
                        </div>
                    </div>

                    {/* Bottom Split: Backtester & Logs */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-brand-panel border border-brand-border rounded-xl p-6">
                            <WidgetHeader title="Backtester" icon={History} />
                            <div className="mt-4 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <StatBox label="Net Profit" value="₹46,320" isPositive={true} />
                                    <StatBox label="Win Rate" value="58.35%" />
                                </div>
                                <div className="h-24 bg-black/20 rounded-lg border border-brand-border border-dashed flex items-center justify-center">
                                    <span className="text-[10px] font-black text-brand-text-muted uppercase italic tracking-widest">Equity Curve Projection</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-brand-panel border border-brand-border rounded-xl p-6">
                            <WidgetHeader title="System Logs" icon={Activity} />
                            <div className="mt-4 space-y-2 max-h-40 overflow-y-auto custom-scrollbar font-mono text-[9px]">
                                <LogEntry time="20:30:42" msg="Neural Handshake: [OK]" type="success" />
                                <LogEntry time="20:30:45" msg="Upstox API Connected: [LATENCY: 12ms]" type="info" />
                                <LogEntry time="20:31:02" msg="Order Execution: BUY AAPL @ 166.40" type="warning" />
                                <LogEntry time="20:31:15" msg="Risk Engine: Exposure updated [0.85x]" type="info" />
                                <LogEntry time="20:33:01" msg="WebSocket Sync: Heartbeat [ACTIVE]" type="success" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Widgets */}
                <div className="col-span-12 lg:col-span-4 space-y-6">
                    <div className="bg-brand-panel border border-brand-border rounded-xl p-6">
                        <WidgetHeader title="Strategy Builder" icon={Cpu} action="Deploy" />
                        <div className="mt-4 space-y-4">
                            <div className="p-4 bg-black/40 rounded-xl border border-brand-border">
                                <h4 className="text-xs font-black text-white italic tracking-tight">EMA Breakout with ATR Stop</h4>
                                <div className="mt-3 space-y-2">
                                    <ParamRow label="Timeframe" value="15m" />
                                    <ParamRow label="EMA Fast" value="20" />
                                    <ParamRow label="EMA Slow" value="50" />
                                    <ParamRow label="Breakout Lookback" value="50" />
                                    <ParamRow label="Sharpe Ratio" value="1.29" highlighted />
                                </div>
                            </div>
                            <button className="w-full py-3 bg-brand-accent text-brand-bg text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:scale-[1.02] transition-transform shadow-lg shadow-brand-accent/10">
                                Run Backtest
                            </button>
                        </div>
                    </div>

                    <div className="bg-brand-panel border border-brand-border rounded-xl p-6">
                        <WidgetHeader title="Paper Trading" icon={Zap} />
                        <div className="mt-4 space-y-2">
                            <div className="flex justify-between items-center px-2 py-1.5 border-b border-brand-border/50">
                                <span className="text-[10px] font-black text-white tracking-widest uppercase">AAPL</span>
                                <span className="text-[10px] font-bold text-brand-accent">+2.45%</span>
                            </div>
                            <div className="flex justify-between items-center px-2 py-1.5 border-b border-brand-border/50">
                                <span className="text-[10px] font-black text-white tracking-widest uppercase">BTCUSDT</span>
                                <span className="text-[10px] font-bold text-red-500">-0.12%</span>
                            </div>
                            <button className="w-full mt-2 py-2 border border-brand-border rounded-lg text-[9px] font-black text-brand-text-secondary uppercase tracking-widest hover:bg-white/5 transition-colors">
                                View Closed Trades
                            </button>
                        </div>
                    </div>

                    <div className="bg-brand-panel border border-brand-border rounded-xl p-6">
                        <WidgetHeader title="Connectors" icon={Unplug} />
                        <div className="mt-4 space-y-3">
                            <ConnectorRow label="CSV Data Adapter" status="Healthy" />
                            <ConnectorRow label="Mock Market Data" status="Live" />
                            <ConnectorRow label="Mock Broker" status="Connected" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SummaryCard({ label, value, icon: Icon, trend, isPositive, isRegime }: any) {
    return (
        <div className="bg-brand-panel border border-brand-border rounded-xl p-6 relative group hover:border-brand-accent/30 transition-colors shadow-2xl">
            <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-black text-brand-text-secondary uppercase tracking-[0.2em]">{label}</span>
                <div className={cn(
                    "p-2 rounded-lg bg-black/20 text-brand-text-muted transition-colors group-hover:text-brand-accent",
                    isRegime && "animate-pulse shadow-[0_0_10px_#17C7A1]"
                )}>
                    <Icon size={16} />
                </div>
            </div>
            <div className="flex items-baseline gap-3">
                <h2 className={cn(
                    "text-2xl font-black italic tracking-tighter text-white",
                    isRegime && "text-brand-accent"
                )}>
                    {value}
                </h2>
                {trend && (
                    <span className={cn(
                        "text-[10px] font-bold px-1.5 py-0.5 rounded",
                        isPositive ? "bg-brand-accent/10 text-brand-accent" : "bg-red-500/10 text-red-500"
                    )}>
                        {trend}
                    </span>
                )}
                {isRegime && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-brand-accent text-brand-bg rounded-lg shadow-lg shadow-brand-accent/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-bg animate-ping" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Active</span>
                    </div>
                )}
            </div>
        </div>
    );
}

function WidgetHeader({ title, icon: Icon, action }: any) {
    return (
        <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-black/40 border border-brand-border flex items-center justify-center text-brand-accent">
                    <Icon size={16} />
                </div>
                <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] italic">{title}</h3>
            </div>
            {action ? (
                <button className="text-[9px] font-bold text-brand-accent uppercase border border-brand-accent/30 px-2 py-1 rounded bg-brand-accent/5 hover:bg-brand-accent hover:text-brand-bg transition-all">
                    {action}
                </button>
            ) : (
                <MoreHorizontal size={14} className="text-brand-text-muted hover:text-white cursor-pointer" />
            )}
        </div>
    );
}

function StatBox({ label, value, isPositive }: any) {
    return (
        <div className="bg-black/20 border border-brand-border rounded-xl p-3">
            <p className="text-[8px] font-black text-brand-text-muted uppercase tracking-widest leading-none">{label}</p>
            <p className={cn(
                "text-sm font-black italic mt-1",
                isPositive ? "text-brand-accent" : "text-white"
            )}>{value}</p>
        </div>
    );
}

function ParamRow({ label, value, highlighted }: any) {
    return (
        <div className="flex justify-between items-center">
            <span className="text-[9px] font-bold text-brand-text-muted uppercase tracking-tighter">{label}</span>
            <span className={cn(
                "text-[10px] font-black",
                highlighted ? "text-brand-accent" : "text-white"
            )}>{value}</span>
        </div>
    );
}

function LogEntry({ time, msg, type }: any) {
    const colors = {
        success: 'text-brand-accent',
        info: 'text-brand-text-secondary',
        warning: 'text-orange-400',
        error: 'text-red-500'
    };
    return (
        <div className="flex gap-3 px-2 py-1 hover:bg-white/5 transition-colors rounded group">
            <span className="text-brand-text-muted group-hover:text-white shrink-0">[{time}]</span>
            <span className={cn("break-all", colors[type as keyof typeof colors])}>{msg}</span>
        </div>
    );
}

function ConnectorRow({ label, status }: any) {
    return (
        <div className="flex justify-between items-center bg-black/20 p-2 rounded-lg border border-brand-border/50 group hover:border-brand-accent/30 transition-all">
            <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-accent shadow-[0_0_8px_#17C7A1]" />
                <span className="text-[10px] font-bold text-brand-text-secondary group-hover:text-white uppercase tracking-tight">{label}</span>
            </div>
            <span className="text-[9px] font-black text-brand-accent uppercase tracking-widest">{status}</span>
        </div>
    );
}
