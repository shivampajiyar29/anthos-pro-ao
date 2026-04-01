'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';

import { useWebSocket } from '@/hooks/useWebSocket';
import { TradingAgent, Metrics, Trade } from '@/lib/types';
import AgentArena from '@/components/maheshwara/AgentArena';
import ParticleBackground from '@/components/maheshwara/ParticleBackground';
import LiveTradeFeed from '@/components/maheshwara/LiveTradeFeed';
import AIInsights from '@/components/maheshwara/AIInsights';
import ThreeDPriceChart from '@/components/maheshwara/ThreeDPriceChart';
import { motion } from 'framer-motion';
import { Activity, Shield, Brain, Zap, Globe, Cpu } from 'lucide-react';

export default function MaheshwaraPage() {
    const [agents, setAgents] = useState<TradingAgent[]>([]);
    const [metrics, setMetrics] = useState<Metrics | null>(null);
    const [trades, setTrades] = useState<Trade[]>([]);
    const [loading, setLoading] = useState(true);

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000';
    const { lastMessage: tradeMessage } = useWebSocket(`${wsUrl}/ws/trades`);

    useEffect(() => {
        if (tradeMessage?.channel === 'trades' || tradeMessage?.data?.type === 'NEW_TRADE') {
            const trade = tradeMessage.data.trade || tradeMessage.data;
            setTrades(prev => [trade, ...prev].slice(0, 50));
        }
    }, [tradeMessage]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [agentsRes, portfolioRes] = await Promise.all([
                    api.get('/maheshwara/agents'),
                    api.get('/maheshwara/portfolio')
                ]);
                
                const mappedAgents = agentsRes.data.map((a: any, i: number) => ({
                    id: String(i),
                    name: a.agent_name,
                    role: a.role,
                    confidence: a.confidence,
                    lastAction: a.decision,
                    thinking: a.confidence > 0,
                    pnl: (Math.random() - 0.4) * 5, 
                    pnlHistory: Array.from({ length: 10 }, () => Math.random() * 5),
                    model: 'GPU Cluster Hybrid'
                }));

                setAgents(mappedAgents);
                setMetrics({
                    totalEquity: portfolioRes.data.total_equity,
                    dailyPnl: portfolioRes.data.daily_pnl,
                    winRate: portfolioRes.data.win_rate_24h,
                    sharpeRatio: portfolioRes.data.sharpe_ratio,
                    maxDrawdown: portfolioRes.data.max_drawdown,
                    tradesToday: portfolioRes.data.trades_today
                });
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch Maheshwara state", error);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, []);


    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                <div className="flex flex-col items-center gap-4">
                    <Brain className="text-[var(--purple)] animate-pulse" size={48} />
                    <span className="text-[var(--purple)] font-black uppercase tracking-[0.5em] text-xs">Initializing Neural Engine...</span>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-black text-white p-6 relative overflow-hidden">
            <ParticleBackground />
            
            <Header metrics={metrics} />

            <div className="relative z-10 space-y-8 max-w-[1600px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-3">
                        <ThreeDPriceChart symbol="NIFTY 50" currentPrice={22350.45} />
                    </div>
                    <div className="lg:col-span-1">
                        <AIInsights insight="NIFTY showing strong institutional accumulation. Neural consensus suggests a breakout above R1." />
                    </div>
                </div>

                <AgentArena 
                    agents={agents} 
                    onUpdateAgent={(id, updates) => {
                        setAgents(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
                    }} 
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <LiveTradeFeed trades={trades} />
                    </div>

                    <div className="space-y-6">
                        <div className="glass-panel p-6 border-l-4 border-l-[var(--purple)] border-r border-t border-b border-white/5">
                            <h3 className="section-label flex items-center gap-2 mb-4 text-[var(--purple)]">
                                <Shield size={14} />
                                Risk Sentinel
                            </h3>
                            <div className="space-y-4">
                                <RiskMetric label="Current Exposure" value="$42,500" percent={42} />
                                <RiskMetric label="Var (95%)" value="1.24%" percent={12} />
                                <RiskMetric label="Margin Health" value="OPTIMAL" percent={88} color="var(--green)" />
                            </div>
                        </div>

                        <div className="glass-panel p-6 border-l-4 border-l-[var(--cyan)] border-r border-t border-b border-white/5">
                            <h3 className="section-label flex items-center gap-2 mb-4 text-[var(--cyan)]">
                                <Globe size={14} />
                                Market Breadth
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-black/40 rounded-xl border border-white/5 text-center">
                                    <div className="text-[8px] text-gray-500 uppercase font-black">Sentiment</div>
                                    <div className="text-sm font-black text-[var(--green)] tracking-tighter">BULLISH</div>
                                </div>
                                <div className="p-3 bg-black/40 rounded-xl border border-white/5 text-center">
                                    <div className="text-[8px] text-gray-500 uppercase font-black">Volatility</div>
                                    <div className="text-sm font-black text-[var(--purple)] tracking-tighter">LOW</div>
                                </div>
                            </div>
                        </div>

                        <div className="glass-panel p-4 flex items-center gap-4 border border-white/5">
                            <div className="w-10 h-10 rounded-full bg-[var(--purple)]/20 flex items-center justify-center animate-pulse">
                                <Cpu size={20} className="text-[var(--purple)]" />
                            </div>
                            <div>
                                <div className="text-[10px] font-black uppercase text-white tracking-widest leading-none">Compute Node: AP-SOUTH-1</div>
                                <div className="text-[8px] text-gray-500 font-bold uppercase mt-1">LATENCY: 14MS | LOAD: 12.4%</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

function Header({ metrics }: { metrics: Metrics | null }) {
    return (
        <header className="relative z-10 flex items-center justify-between mb-10 border-b border-white/10 pb-6 max-w-[1600px] mx-auto">
            <div>
                <h1 className="text-2xl font-black italic tracking-tighter flex items-center gap-3">
                    MAHESHWARA
                    <span className="bg-[var(--purple)] text-white text-[10px] font-black px-2 py-0.5 rounded italic shadow-[0_0_10px_rgba(170,0,255,0.5)]">PRO 2.0</span>
                </h1>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Autonomous Neural Trading Terminal</p>
            </div>

            <div className="flex gap-8">
                <MetricBlock label="Daily PnL" value={`$${metrics?.dailyPnl.toLocaleString()}`} isPositive={(metrics?.dailyPnl || 0) >= 0} />
                <MetricBlock label="Win Rate" value={`${metrics?.winRate}%`} isPositive={true} />
                <MetricBlock label="Trades Today" value={String(metrics?.tradesToday)} isPositive={true} />
            </div>
        </header>
    );
}

function MetricBlock({ label, value, isPositive }: { label: string, value: string, isPositive: boolean }) {
    return (
        <div className="text-right">
            <div className="text-[9px] text-gray-500 uppercase font-black tracking-widest">{label}</div>
            <div className={`text-lg font-black italic tracking-tighter ${isPositive ? 'text-[var(--green)]' : 'text-[var(--red)]'}`}>{value}</div>
        </div>
    );
}

function RiskMetric({ label, value, percent, color = 'var(--purple)' }: { label: string, value: string, percent: number, color?: string }) {
    return (
        <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-bold">
                <span className="text-gray-500 uppercase">{label}</span>
                <span className="text-white">{value}</span>
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    className="h-full"
                    style={{ backgroundColor: color }}
                />
            </div>
        </div>
    );
}
