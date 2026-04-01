'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DashboardData, TradingAgent, Trade, Position } from '@/lib/types';
import { INITIAL_DATA, generateUpdate } from '@/lib/mockData';

interface DashboardContextType {
    history: DashboardData[];
    historyIndex: number;
    setHistoryIndex: (idx: number) => void;
    isPaused: boolean;
    setIsPaused: (paused: boolean) => void;
    timeframe: string;
    setTimeframe: (tf: string) => void;
    isLiveMode: boolean;
    setIsLiveMode: (live: boolean) => void;
    apiKeys: Record<string, string>;
    setApiKeys: (keys: Record<string, string>) => void;
    handleAgentUpdate: (agentId: string, updates: Partial<TradingAgent>) => void;
    handleCircuitBreaker: () => void;
    displayData: DashboardData;
    maxIndex: number;
    selectedSymbol: string;
    setSelectedSymbol: (symbol: string) => void;
    activeView: 'ALGO' | 'MANUAL';
    setActiveView: (view: 'ALGO' | 'MANUAL') => void;
    manualPower: boolean;
    setManualPower: (power: boolean) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
    // Add positions to the data structure
    const [history, setHistory] = useState<DashboardData[]>([{ ...INITIAL_DATA, positions: [] }]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [timeframe, setTimeframe] = useState('5m');
    const [isLiveMode, setIsLiveMode] = useState(INITIAL_DATA.isLiveMode);
    const [apiKeys, setApiKeys] = useState(INITIAL_DATA.apiKeys);
    const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');
    const [activeView, setActiveView] = useState<'ALGO' | 'MANUAL'>('ALGO');
    const [manualPower, setManualPower] = useState(true);

    // Initial Data Fetch
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const results = await Promise.allSettled([
                    fetch('http://localhost:8000/api/portfolio').then(res => res.json()),
                    fetch('http://localhost:8000/api/agents').then(res => res.json()),
                    fetch('http://localhost:8000/api/trades').then(res => res.json()),
                    fetch('http://localhost:8000/api/positions').then(res => res.json())
                ]);

                const portfolio = results[0].status === 'fulfilled' ? results[0].value : INITIAL_DATA.portfolio;
                const agents = results[1].status === 'fulfilled' ? results[1].value : INITIAL_DATA.agents;
                const trades = results[2].status === 'fulfilled' ? results[2].value : INITIAL_DATA.trades;
                const positions = results[3].status === 'fulfilled' ? results[3].value : [];

                const initial: DashboardData = {
                    ...INITIAL_DATA,
                    metrics: {
                        totalEquity: portfolio.total_equity,
                        dailyPnl: portfolio.daily_pnl,
                        winRate: portfolio.win_rate_24h,
                        sharpeRatio: portfolio.sharpe_ratio,
                        maxDrawdown: portfolio.max_drawdown,
                        tradesToday: portfolio.trades_today
                    },
                    portfolio: {
                        ...INITIAL_DATA.portfolio,
                        equity: portfolio.total_equity,
                        dailyPnl: portfolio.daily_pnl
                    },
                    agents: agents.map((a: any, i: number) => ({
                        id: String(i + 1),
                        name: a.agent_name,
                        model: a.agent_name === 'WithMyself' ? 'Human Intelligence' :
                            i === 0 ? 'NVIDIA Qwen' :
                                i === 1 ? 'Llama 3 70B' : 'Claude 3 Opus',
                        pnl: 0,
                        lastAction: 'INITIALIZING...',
                        confidence: a.confidence * 100,
                        thinking: false,
                        role: a.role,
                        aggressiveness: a.aggressiveness
                    })),
                    trades: trades.map((t: any, i: number) => ({
                        id: `t-${i}`,
                        time: new Date(t.timestamp).toLocaleTimeString('en-US', { hour12: false }),
                        symbol: t.symbol,
                        agent: t.agent_name,
                        action: t.action,
                        quantity: t.quantity,
                        price: t.price,
                        pnl: t.pnl,
                        status: t.status || 'CLOSED',
                        target_price: t.target_price,
                        stop_loss: t.stop_loss
                    })),
                    positions: positions
                };
                setHistory([initial]);
            } catch (err) {
                console.error("Failed to fetch initial dashboard data:", err);
            }
        };

        fetchInitialData();

        // Sync positions periodically for live PnL
        const syncInterval = setInterval(async () => {
            if (isPaused) return;
            try {
                const res = await fetch('http://localhost:8000/api/positions');
                if (res.ok) {
                    const positions = await res.json();
                    setHistory(prev => {
                        const current = prev[prev.length - 1];
                        return [...prev, { ...current, positions }].slice(-100);
                    });
                }
            } catch (e) {
                console.error("Position sync failed:", e);
            }
        }, 5000);

        return () => clearInterval(syncInterval);
    }, [isPaused]);

    // WebSocket Integration
    useEffect(() => {
        if (isPaused) return;

        let portfolioWs: WebSocket;
        let tradesWs: WebSocket;

        const connectWebSockets = () => {
            portfolioWs = new WebSocket('ws://localhost:8000/ws/portfolio');
            tradesWs = new WebSocket('ws://localhost:8000/ws/trades');

            portfolioWs.onmessage = (event) => {
                const data = JSON.parse(event.data);
                setHistory(prev => {
                    const current = prev[prev.length - 1];
                    const updated: DashboardData = {
                        ...current,
                        metrics: {
                            ...current.metrics,
                            totalEquity: data.total_equity,
                            dailyPnl: data.daily_pnl,
                            winRate: data.daily_pnl_percent > 0 ? current.metrics.winRate + 0.01 : current.metrics.winRate - 0.01
                        },
                        portfolio: {
                            ...current.portfolio,
                            equity: data.total_equity,
                            dailyPnl: data.daily_pnl,
                            dailyPnlPercent: data.daily_pnl_percent
                        }
                    };
                    return [...prev, updated].slice(-100);
                });
            };

            tradesWs.onmessage = (event) => {
                const trade = JSON.parse(event.data);
                setHistory(prev => {
                    const current = prev[prev.length - 1];
                    const newTrade: Trade = {
                        id: Math.random().toString(36).substr(2, 9),
                        time: new Date(trade.timestamp).toLocaleTimeString('en-US', { hour12: false }),
                        symbol: trade.symbol,
                        agent: trade.agent_name,
                        action: trade.action,
                        quantity: trade.quantity,
                        price: trade.price,
                        pnl: trade.pnl,
                        status: 'CLOSED'
                    };
                    return [...prev, { ...current, trades: [newTrade, ...current.trades].slice(0, 50) }].slice(-100);
                });
            };

            portfolioWs.onclose = () => {
                console.log("Portfolio WS closed. Reconnecting...");
                setTimeout(connectWebSockets, 3000);
            };
        };

        connectWebSockets();

        return () => {
            portfolioWs?.close();
            tradesWs?.close();
        };
    }, [isPaused]);

    // Simulated updates
    useEffect(() => {
        if (isPaused || isLiveMode) return;

        const interval = setInterval(() => {
            setHistory(prev => {
                const current = prev[prev.length - 1];
                const nextData = generateUpdate(current);

                const syncedAgents = nextData.agents.map(a => {
                    const existing = current.agents.find(ea => ea.id === a.id);
                    return existing ? { ...a, disabled: existing.disabled, aggressiveness: existing.aggressiveness } : a;
                });

                return [...prev, { ...nextData, agents: syncedAgents }].slice(-100);
            });
        }, 3000);
        return () => clearInterval(interval);
    }, [isPaused, isLiveMode]);

    useEffect(() => {
        if (!isPaused) {
            setHistoryIndex(history.length - 1);
        }
    }, [history.length, isPaused]);

    const handleAgentUpdate = (agentId: string, updates: Partial<TradingAgent>) => {
        setHistory(prev => {
            const newHistory = [...prev];
            const lastIndex = newHistory.length - 1;
            const updatedAgents = newHistory[lastIndex].agents.map(a =>
                a.id === agentId ? { ...a, ...updates } : a
            );
            newHistory[lastIndex] = { ...newHistory[lastIndex], agents: updatedAgents };
            return newHistory;
        });
    };

    const handleCircuitBreaker = () => {
        setIsPaused(true);
        setHistory(prev => {
            const newHistory = [...prev];
            const lastIndex = newHistory.length - 1;
            const stoppedAgents = newHistory[lastIndex].agents.map(a => ({ ...a, disabled: true }));
            newHistory[lastIndex] = { ...newHistory[lastIndex], agents: stoppedAgents };
            return newHistory;
        });
        alert("🚨 CIRCUIT BREAKER TRIGGERED: All trading operations halted.");
    };

    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    const displayData = history[historyIndex] || history[history.length - 1];

    if (!mounted) return null;

    return (
        <DashboardContext.Provider value={{
            history,
            historyIndex,
            setHistoryIndex,
            isPaused,
            setIsPaused,
            timeframe,
            setTimeframe,
            isLiveMode,
            setIsLiveMode,
            apiKeys,
            setApiKeys,
            handleAgentUpdate,
            handleCircuitBreaker,
            displayData,
            maxIndex: history.length - 1,
            selectedSymbol,
            setSelectedSymbol,
            activeView,
            setActiveView,
            manualPower,
            setManualPower
        }}>
            {children}
        </DashboardContext.Provider>
    );
}

export function useDashboard() {
    const context = useContext(DashboardContext);
    if (context === undefined) {
        throw new Error('useDashboard must be used within a DashboardProvider');
    }
    return context;
}
