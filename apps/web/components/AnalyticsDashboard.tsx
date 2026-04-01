"use client";

import React from 'react';
import { BarChart3, PieChart, TrendingUp, Download, Filter } from 'lucide-react';

const AnalyticsDashboard = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Strategy Analytics</h2>
                    <p className="text-slate-400 mt-1 font-medium">Deep-dive into performance and risk attribution</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition-all border border-slate-700">
                        <Filter size={18} />
                        Filters
                    </button>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20">
                        <Download size={18} />
                        Export Report
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricBox label="Expectancy" value="1.42" sub="Avg Return per Trade" />
                <MetricBox label="Profit Factor" value="2.15" sub="Gains vs Losses" />
                <MetricBox label="Recovery Factor" value="8.4" sub="PnL / Max Drawdown" />
                <MetricBox label="Avg Hold Time" value="4h 12m" sub="Intraday Weighted" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 min-h-[450px] relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <TrendingUp size={120} className="text-blue-500" />
                   </div>
                   <div className="relative z-10 space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <BarChart3 size={20} className="text-blue-400" />
                                Cumulative Returns
                            </h3>
                            <div className="flex gap-2">
                                {['1D', '1W', '1M', 'ALL'].map(t => (
                                    <button key={t} className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-tighter ${t === '1M' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-white'}`}>{t}</button>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center justify-center h-[300px] border-2 border-dashed border-slate-800 rounded-3xl">
                            <p className="text-slate-600 font-bold uppercase tracking-widest text-xs">High-Fidelity TradingView Engine Hook</p>
                        </div>
                   </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 space-y-8">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <PieChart size={20} className="text-purple-400" />
                        Risk Attribution
                    </h3>
                    
                    <div className="space-y-6">
                        <RiskFactor label="Nifty Options" pct={65} color="bg-blue-500" />
                        <RiskFactor label="BankNifty Hedged" pct={25} color="bg-purple-500" />
                        <RiskFactor label="FinNifty Expiry" pct={10} color="bg-emerald-500" />
                    </div>

                    <div className="pt-6 border-t border-slate-800">
                        <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                            <p className="text-emerald-400 text-xs font-bold leading-tight">Everything looks healthy. Your risk-to-reward ratio is optimal for current volatility.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MetricBox = ({ label, value, sub }: any) => (
    <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem] hover:border-slate-700 transition-all shadow-xl shadow-black/20">
        <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mb-1">{label}</p>
        <p className="text-3xl font-black text-white">{value}</p>
        <p className="text-xs text-slate-600 font-medium mt-1">{sub}</p>
    </div>
);

const RiskFactor = ({ label, pct, color }: any) => (
    <div className="space-y-2">
        <div className="flex justify-between items-end">
            <span className="text-sm font-bold text-slate-400">{label}</span>
            <span className="text-xs font-black text-white">{pct}%</span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
        </div>
    </div>
);

export default AnalyticsDashboard;
