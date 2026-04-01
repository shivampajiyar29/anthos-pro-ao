"use client";

import React, { useState, useEffect, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Activity, Shield, TrendingUp, BookOpen, Settings, Zap, Terminal, Globe, HeartPulse, History, Cpu, Gauge } from 'lucide-react';

const mockPriceData = [
    { time: '09:00', price: 172.5 },
    { time: '10:00', price: 173.2 },
    { time: '11:00', price: 175.8 },
    { time: '12:00', price: 174.5 },
    { time: '13:00', price: 176.2 },
    { time: '14:00', price: 178.4 },
    { time: '15:00', price: 177.9 },
];

const perfData = [
    { name: 'Mon', profit: 4000 },
    { name: 'Tue', profit: -1000 },
    { name: 'Wed', profit: 2000 },
    { name: 'Thu', profit: 6000 },
    { name: 'Fri', profit: 4500 },
];

export default function MaheshwaraDashboard() {
    const [activeTab, setActiveTab] = useState('terminal');
    const [messages, setMessages] = useState<string[]>([]);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [hasMounted, setHasMounted] = useState(false);
    const [tradingMode, setTradingMode] = useState<'PAPER' | 'LIVE'>('PAPER');
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        setHasMounted(true);
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        // Initialize WebSocket connection
        socketRef.current = new WebSocket('ws://localhost:8000/ws');
        socketRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'MODE_CHANGE') {
                setTradingMode(data.mode);
            }
            setMessages(prev => [event.data, ...prev].slice(0, 50));
        };
        return () => socketRef.current?.close();
    }, []);

    const toggleMode = async () => {
        try {
            const res = await fetch('http://localhost:8000/mode/toggle', { method: 'POST' });
            const data = await res.json();
            setTradingMode(data.mode);
        } catch (err) {
            console.error("Failed to toggle mode", err);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30">
            {/* Sidebar Navigation */}
            <nav className="fixed left-0 top-0 h-full w-20 bg-slate-900 border-r border-slate-800 flex flex-col items-center py-8 gap-8 z-[60] glass">
                <div className="w-12 h-12 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/20 mb-4 cursor-pointer hover:rotate-12 transition-transform">
                    <Zap className="text-white fill-white" size={24} />
                </div>

                {[
                    { id: 'terminal', icon: Terminal, label: 'Terminal' },
                    { id: 'insights', icon: BookOpen, label: 'AI Insights' },
                    { id: 'performance', icon: TrendingUp, label: 'Analytics' },
                    { id: 'risk', icon: Shield, label: 'Risk' },
                    { id: 'journal', icon: History, label: 'Journal' },
                    { id: 'health', icon: HeartPulse, label: 'Health' },
                ].map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`p-3 rounded-xl transition-all group relative ${activeTab === item.id ? 'bg-cyan-500/10 text-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.15)] shadow-inner' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <item.icon size={24} />
                        <span className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                            {item.label}
                        </span>
                    </button>
                ))}

                <div className="mt-auto">
                    <button className="p-3 text-slate-500 hover:text-slate-300"><Settings size={24} /></button>
                </div>
            </nav>

            {/* Main Content Area */}
            <div className="pl-20">
                {/* Header */}
                <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 glass">
                    <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-8">
                            <div>
                                <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                                    MAHESHWARA Intelligence
                                </h1>
                                <p className="text-[10px] text-cyan-500 font-mono tracking-widest uppercase">Autonomous Multi-Market Ecosystem</p>
                            </div>
                            <div className="h-8 w-[1px] bg-slate-800" />
                            <div className="flex flex-col">
                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">
                                    {hasMounted ? currentTime.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '---'}
                                </span>
                                <span className="text-sm font-mono font-bold text-cyan-400">
                                    {hasMounted ? currentTime.toLocaleTimeString() : '--:--:--'}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-4 px-4 py-2 bg-slate-800/50 rounded-2xl border border-slate-700 glass-vibrant">
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] text-slate-500 font-bold uppercase">Net Equity</span>
                                    <span className="text-sm font-black">$124,560.80</span>
                                </div>
                                <div className="w-[1px] h-8 bg-slate-700 mx-2" />
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] text-slate-500 font-bold uppercase">Daily P&L</span>
                                    <span className="text-sm font-black text-green-400">+$2,450.00</span>
                                </div>
                            </div>
                            <button
                                onClick={toggleMode}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${tradingMode === 'LIVE' ? 'bg-red-500/10 border-red-500/50 text-red-500' : 'bg-green-500/10 border-green-500/50 text-green-500'}`}
                            >
                                <div className={`w-2 h-2 rounded-full animate-pulse ${tradingMode === 'LIVE' ? 'bg-red-500' : 'bg-green-500'}`} />
                                <span className="text-[10px] font-black uppercase tracking-widest">{tradingMode}</span>
                            </button>
                        </div>
                    </div>
                </header>

                <main className="max-w-[1600px] mx-auto p-6">
                    {activeTab === 'terminal' && (
                        <div className="grid grid-cols-12 gap-6 scale-in-center">
                            {/* Left Column - Market View */}
                            <div className="col-span-12 lg:col-span-8 space-y-6">
                                <div className="grid grid-cols-4 gap-4">
                                    {[
                                        { label: 'AAPL', price: '$175.42', change: '+1.2%', up: true },
                                        { label: 'BTC', price: '$67,890', change: '-0.3%', up: false },
                                        { label: 'RELIANCE', price: '₹2,540.0', change: '+0.5%', up: true },
                                        { label: 'ETH', price: '$3,420', change: '+2.1%', up: true }
                                    ].map((ticker, i) => (
                                        <div key={i} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl hover:border-slate-700 transition-all glass">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="text-xs font-semibold text-slate-400">{ticker.label}</span>
                                                <span className={`text-[10px] font-bold ${ticker.up ? 'text-green-400' : 'text-red-400'}`}>
                                                    {ticker.change}
                                                </span>
                                            </div>
                                            <div className="text-lg font-bold">{ticker.price}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative glass">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                            <TrendingUp size={14} className="text-cyan-500" /> Neural Price Projection
                                        </h3>
                                        <div className="flex gap-2">
                                            {['1H', '4H', '1D', '1W'].map(t => (
                                                <button key={t} className="px-2 py-1 text-[10px] font-bold rounded-lg border border-slate-800 hover:bg-slate-800">{t}</button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="h-[400px] w-full mt-4">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={mockPriceData}>
                                                <defs>
                                                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                                                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                                <XAxis dataKey="time" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                                                <YAxis stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }} />
                                                <Area type="monotone" dataKey="price" stroke="#06b6d4" strokeWidth={3} fill="url(#colorPrice)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Bayesian Belief Network */}
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 glass">
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-6 flex items-center gap-2">
                                            <Cpu size={14} className="text-purple-500" /> Bayesian Regime Beliefs
                                        </h3>
                                        <div className="space-y-6">
                                            {[
                                                { label: 'Bullish Momentum', prob: 0.72, color: 'bg-green-500' },
                                                { label: 'Mean Reversion', prob: 0.18, color: 'bg-yellow-500' },
                                                { label: 'High Volatility/Tail Risk', prob: 0.10, color: 'bg-red-500' }
                                            ].map((belief, i) => (
                                                <div key={i} className="space-y-2">
                                                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter">
                                                        <span className="text-slate-400">{belief.label}</span>
                                                        <span className="text-slate-200">P(H|E) = {(belief.prob * 100).toFixed(1)}%</span>
                                                    </div>
                                                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                        <div className={`h-full ${belief.color} rounded-full transition-all duration-1000`} style={{ width: `${belief.prob * 100}%` }} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden aspect-video relative glass">
                                        <div className="border-b border-slate-800 p-4 bg-slate-800/20 flex items-center gap-2">
                                            <Terminal size={14} className="text-cyan-500" />
                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Agent Perception Stream</span>
                                        </div>
                                        <div className="p-4 font-mono text-[11px] space-y-2 overflow-y-auto h-[160px]">
                                            {messages.length === 0 ? (
                                                <div className="text-slate-600 animate-pulse">Awaiting neural handshake... [UP: OK | REDIS: CONNECTED]</div>
                                            ) : (
                                                messages.map((msg, i) => (
                                                    <div key={i} className="flex gap-4 border-l border-slate-800 pl-4 py-1">
                                                        <span className="text-cyan-500 shrink-0">[{hasMounted ? new Date().toLocaleTimeString() : '--:--:--'}]</span>
                                                        <span className="text-slate-400 break-all">{msg}</span>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Orders & Active Signal */}
                            <div className="col-span-12 lg:col-span-4 space-y-6">
                                <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-6 text-white shadow-xl group hover:shadow-cyan-500/10 transition-shadow transition-transform hover:-translate-y-1 relative overflow-hidden">
                                    <div className="absolute -right-8 -bottom-8 opacity-10 rotate-12">
                                        <Cpu size={160} />
                                    </div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-2 mb-4 opacity-80">
                                            <Cpu size={16} fill="white" />
                                            <span className="text-[10px] font-bold tracking-widest uppercase">Quantum Signal: CRITICAL</span>
                                        </div>
                                        <h2 className="text-4xl font-black mb-1">BUY AAPL</h2>
                                        <p className="text-indigo-100 text-xs mb-6 font-medium">Breakout confirmation by 4/5 Agents</p>
                                        <div className="space-y-3 mb-8">
                                            <div className="flex justify-between text-xs border-b border-white/10 pb-2">
                                                <span className="opacity-70 uppercase tracking-tighter">Confidence</span>
                                                <span className="font-bold">92.4%</span>
                                            </div>
                                            <div className="flex justify-between text-xs">
                                                <span className="opacity-70 uppercase tracking-tighter">Model Cluster</span>
                                                <span className="font-bold">QWEN-2.5-ENSEMBLE</span>
                                            </div>
                                        </div>
                                        <button className="w-full py-4 bg-white text-blue-700 font-bold rounded-2xl hover:scale-[1.02] transition-transform active:scale-95 shadow-lg">
                                            APPROVE EXECUTION
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 glass">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
                                        <Activity size={14} /> Active Positions
                                    </h3>
                                    <div className="space-y-3">
                                        {[{ ticker: 'AAPL', side: 'LONG', pnl: '+1,240.00' }, { ticker: 'NVDA', side: 'LONG', pnl: '-120.50' }].map((pos, i) => (
                                            <div key={i} className="p-4 bg-slate-800/30 rounded-2xl border border-slate-800/50 flex justify-between items-center group hover:bg-slate-800/50 transition-colors glass-vibrant">
                                                <div>
                                                    <p className="text-sm font-bold">{pos.ticker}</p>
                                                    <p className="text-[10px] text-slate-500 font-mono italic">{pos.side}</p>
                                                </div>
                                                <span className={`text-sm font-black ${pos.pnl.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                                                    {pos.pnl}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 glass">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
                                        <Zap size={14} className="text-yellow-500" /> Arbitrage Opportunities
                                    </h3>
                                    <div className="text-[11px] text-slate-400 font-mono space-y-2">
                                        <div className="flex justify-between p-2 rounded bg-slate-800/50 border border-slate-700">
                                            <span>INFY (NSE/NYSE)</span>
                                            <span className="text-green-400">+0.42%</span>
                                        </div>
                                        <div className="flex justify-between p-2 rounded">
                                            <span>RELIANCE (NSE/BSE)</span>
                                            <span className="text-slate-600">0.02%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'insights' && (
                        <div className="max-w-[1200px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <section className="bg-slate-900 border border-slate-800 rounded-[40px] p-12 relative overflow-hidden glass">
                                <div className="absolute top-0 right-0 p-8 transform rotate-12 opacity-5">
                                    <BookOpen size={200} />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-500 text-[10px] font-bold uppercase tracking-widest">
                                            Daily Intelligence Report
                                        </div>
                                        <span className="text-slate-600 text-[10px] font-mono">HASH: 0x8a7b...4e21</span>
                                    </div>
                                    <h2 className="text-5xl font-serif italic mb-10 text-slate-200 leading-tight">
                                        "The current market rotation signifies a transition from growth-at-any-price to disciplined value extraction..."
                                    </h2>
                                    <div className="prose prose-invert max-w-none prose-slate">
                                        <p className="text-xl text-slate-400 leading-relaxed font-light mb-8">
                                            In the spirit of Ray Dalio's principles, we observe a shifting debt cycle. Our neural cores identify a 0.72 correlation between inflation surprises and sector rotation into industrials. We recommend a balanced posture while maintaining core tech exposures where the moat remains deep.
                                        </p>

                                        <div className="mt-12 p-8 bg-blue-500/5 border border-blue-500/20 rounded-3xl border-l-[6px] border-l-blue-500">
                                            <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                <Shield size={14} /> Counterfactual Reasoning
                                            </h4>
                                            <p className="text-sm text-slate-400 italic mb-4">"If the interest rate delta had been +25bps higher, the current long position on NVDA would have been truncated by 40%. We chose to maintain size because the labor market print was softer than the baseline projection."</p>
                                            <div className="flex gap-4">
                                                <div className="bg-slate-800 px-3 py-1 rounded text-[10px] text-slate-300 font-mono">SCENARIO_B: REJECTED</div>
                                                <div className="bg-slate-800 px-3 py-1 rounded text-[10px] text-slate-300 font-mono">CONFIDENCE_DELTA: -12.4%</div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-12 mt-12 py-10 border-t border-slate-800/50">
                                            <div>
                                                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 italic">The Buffett Perspective</h4>
                                                <p className="text-sm text-slate-300 italic">"Price is what you pay, value is what you get. Our AI has found 4 companies currently trading significantly below their intrinsic neural valuation."</p>
                                            </div>
                                            <div>
                                                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 italic">The Dalio Perspective</h4>
                                                <p className="text-sm text-slate-300 italic">"The beautiful deleveraging continues. Monitor the treasury spreads as a leading indicator for our next macro shift."</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}

                    {activeTab === 'performance' && (
                        <div className="grid grid-cols-12 gap-6 animate-in zoom-in-95 duration-300">
                            <div className="col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-8 glass">
                                <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                                    <TrendingUp className="text-cyan-500" /> Weekly Alpha Production
                                </h3>
                                <div className="h-[400px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={perfData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                            <XAxis dataKey="name" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                                            <YAxis stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                                            <Tooltip cursor={{ fill: '#1e293b' }} contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }} />
                                            <Bar dataKey="profit" fill="#06b6d4" radius={[6, 6, 0, 0]} barSize={40} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            <div className="col-span-4 space-y-6">
                                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 glass">
                                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">Agent Efficiency Heatmap</h4>
                                    <div className="space-y-4">
                                        {['Strategist', 'Arbitrageur', 'Analyst'].map((agent, i) => (
                                            <div key={i} className="flex flex-col gap-2">
                                                <div className="flex justify-between text-xs">
                                                    <span className="font-bold">{agent}</span>
                                                    <span className="text-cyan-400">{85 + i * 4}%</span>
                                                </div>
                                                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                    <div className="h-full bg-cyan-500 rounded-full shadow-[0_0_10px_#06b6d4]" style={{ width: `${85 + i * 4}%` }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'risk' && (
                        <div className="grid grid-cols-12 gap-8 max-w-[1200px] mx-auto animate-in scale-95 duration-500">
                            <div className="col-span-12 flex justify-center py-12">
                                <div className="relative w-80 h-80 flex items-center justify-center">
                                    <div className="absolute inset-0 rounded-full border-[16px] border-slate-800" />
                                    <div className="absolute inset-0 rounded-full border-[16px] border-cyan-500 border-t-transparent border-r-transparent transform -rotate-45" />
                                    <div className="text-center">
                                        <Gauge size={48} className="text-cyan-500 mx-auto mb-2" />
                                        <div className="text-5xl font-black">12.4%</div>
                                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Portfolio Var</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-8 glass">
                                <h3 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-slate-800 pb-4">Sentinel Guard Logs</h3>
                                <div className="space-y-4">
                                    {[
                                        "Volatility expansion detected in BTC/USDT. SL tightened to 1.5%",
                                        "Exposure gap in IN ADRs detected. Rebalancing initiated.",
                                        "Black swan monitor: Delta neutral posture maintained."
                                    ].map((log, i) => (
                                        <p key={i} className="text-xs text-slate-400 italic">[{hasMounted ? new Date().toLocaleTimeString() : '--:--:--'}] - {log}</p>
                                    ))}
                                </div>
                            </div>
                            <div className="col-span-6 bg-red-500/5 border border-red-500/10 rounded-3xl p-8 glass">
                                <h3 className="text-sm font-bold text-red-500 uppercase tracking-widest mb-6">Kill Switch Matrix</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <button className="p-4 bg-red-500/20 border border-red-500/30 rounded-2xl text-red-500 text-[10px] font-black hover:bg-red-500 hover:text-white transition-all">TERMINATE ALL</button>
                                    <button className="p-4 bg-slate-800 border border-slate-700 rounded-2xl text-slate-400 text-[10px] font-black">STAY FLAT</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'journal' && (
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-[1200px] mx-auto overflow-hidden glass">
                            <h3 className="text-lg font-bold mb-8 flex items-center gap-3">
                                <History className="text-cyan-500" /> Historical Trade Ledger
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead>
                                        <tr className="text-slate-500 border-b border-slate-800 font-bold">
                                            <th className="py-4">TIMESTAMP</th>
                                            <th className="py-4">ASSET</th>
                                            <th className="py-4">ENTRY</th>
                                            <th className="py-4">OUTCOME</th>
                                            <th className="py-4">REASONING EXTRACT</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/50">
                                        {[
                                            { time: '2026-02-11 14:20', asset: 'AAPL', entry: '174.20', pnl: '+1.2%', msg: 'Confirmed bull flag on 15m cluster...' },
                                            { time: '2026-02-11 11:05', asset: 'BTC', entry: '68,100', pnl: '-0.4%', msg: 'Whale wall detected at 68.5k, stop hit.' },
                                        ].map((row, i) => (
                                            <tr key={i} className="group hover:bg-slate-800/20 transition-colors">
                                                <td className="py-4 font-mono text-slate-500">{row.time}</td>
                                                <td className="py-4 font-bold">{row.asset}</td>
                                                <td className="py-4 font-mono">${row.entry}</td>
                                                <td className={`py-4 font-black ${row.pnl.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>{row.pnl}</td>
                                                <td className="py-4 text-slate-400 italic">"{row.msg}"</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'health' && (
                        <div className="grid grid-cols-3 gap-6 animate-in fade-in zoom-in duration-300">
                            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col items-center group hover:border-cyan-500/30 transition-colors glass">
                                <Globe className="text-cyan-500 mb-4 group-hover:scale-110 transition-transform" size={40} />
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">API Latency</h4>
                                <div className="text-3xl font-black">24ms</div>
                                <span className="text-[10px] text-green-500 mt-1 font-bold">OPTIMAL</span>
                            </div>
                            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col items-center group hover:border-purple-500/30 transition-colors glass">
                                <Cpu className="text-purple-500 mb-4 group-hover:scale-110 transition-transform" size={40} />
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">GPU Queue</h4>
                                <div className="text-3xl font-black">2.4%</div>
                                <span className="text-[10px] text-slate-500 mt-1 font-bold italic">NVIDIA CF ACTIVE</span>
                            </div>
                            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col items-center group hover:border-green-500/30 transition-colors glass">
                                <HeartPulse className="text-green-500 mb-4 group-hover:scale-110 transition-transform" size={40} />
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Neural Heartbeat</h4>
                                <div className="text-3xl font-black">99.9%</div>
                                <span className="text-[10px] text-slate-400 mt-1 font-bold uppercase">Uptime Perfect</span>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
