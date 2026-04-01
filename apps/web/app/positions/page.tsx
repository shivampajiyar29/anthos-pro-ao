"use client";

import React, { useEffect, useState } from 'react';
import { PieChart, TrendingUp, TrendingDown, Target, Zap } from 'lucide-react';

export default function PositionsPage() {
  const [positions, setPositions] = useState([]);
  const [portfolio, setPortfolio] = useState<any>(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/positions/')
      .then(res => res.json())
      .then(data => setPositions(data))
      .catch(err => console.error("Failed to fetch positions", err));

    fetch('http://localhost:8000/api/orders/portfolio')
      .then(res => res.json())
      .then(data => setPortfolio(data))
      .catch(err => console.error("Failed to fetch portfolio", err));
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Active <span className="text-blue-400">Positions</span></h1>
          <p className="text-slate-400 mt-2 font-medium">Real-time P&L monitoring of open exposures</p>
        </div>
        {portfolio && (
          <div className="flex gap-10 bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl">
             <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Equity</p>
                <p className="text-2xl font-black text-white tracking-tight">₹{portfolio.total_equity.toLocaleString()}</p>
             </div>
             <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Today's P&L</p>
                <p className={`text-2xl font-black tracking-tight ${portfolio.daily_pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {portfolio.daily_pnl >= 0 ? '+' : ''}₹{portfolio.daily_pnl.toLocaleString()}
                </p>
             </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {positions.length > 0 ? positions.map((p: any) => (
          <div key={p.symbol} className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 hover:border-blue-500/30 transition-all group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[60px] rounded-full -mr-10 -mt-10" />
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight group-hover:text-blue-400 transition-colors">{p.symbol}</h3>
                <span className="text-[10px] font-black bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20">{p.side}</span>
              </div>
              <div className={`p-3 rounded-2xl border ${p.pnl >= 0 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                {p.pnl >= 0 ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-y-4 mb-6">
               <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Entry Price</p>
                  <p className="text-sm font-bold text-white font-mono">₹{p.entry_price.toLocaleString()}</p>
               </div>
               <div className="space-y-1 text-right">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">LTP</p>
                  <p className="text-sm font-bold text-white font-mono">₹{p.current_price.toLocaleString()}</p>
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Quantity</p>
                  <p className="text-sm font-bold text-white uppercase">{p.quantity} Units</p>
               </div>
               <div className="space-y-1 text-right">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Target/SL</p>
                  <p className="text-xs font-bold text-slate-400">{p.target_price || '--'} / {p.stop_loss || '--'}</p>
               </div>
            </div>

            <div className="pt-6 border-t border-slate-800/50 flex items-center justify-between">
               <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Unrealised P&L</p>
                  <p className={`text-xl font-black ${p.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {p.pnl >= 0 ? '+' : ''}₹{p.pnl.toLocaleString()} 
                    <span className="text-xs ml-2 opacity-70">({p.pnl_percent.toFixed(2)}%)</span>
                  </p>
               </div>
               <button className="p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl transition-all">
                  <Zap size={18} fill="currentColor" />
               </button>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-20 bg-slate-900/20 border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center space-y-4">
             <div className="p-4 bg-slate-800/50 rounded-full text-slate-600">
                <Target size={40} />
             </div>
             <div className="text-center">
                <p className="text-white font-bold text-lg">No Active Positions</p>
                <p className="text-slate-500 text-sm">Deploy a strategy to see your live trades here.</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
