"use client";

import React, { useEffect, useState } from 'react';
import { ShoppingCart, ArrowUpRight, ArrowDownRight, Filter, Download } from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/orders/')
      .then(res => res.json())
      .then(data => setOrders(data.orders || []))
      .catch(err => console.error("Failed to fetch orders", err));
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Order <span className="text-emerald-400">History</span></h1>
          <p className="text-slate-400 mt-2 font-medium">Real-time audit of all algorithm executions</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-3 bg-slate-900 border border-slate-800 text-slate-300 rounded-2xl font-bold hover:bg-slate-800 transition-all">
            <Filter size={18} />
            Filter
          </button>
          <button className="flex items-center gap-2 px-5 py-3 bg-slate-900 border border-slate-800 text-slate-300 rounded-2xl font-bold hover:bg-slate-800 transition-all">
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-800/30">
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Timestamp</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Asset</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Side</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Qty</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Price</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Status</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">PnL</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {orders.length > 0 ? orders.map((o: any) => (
              <tr key={o.id} className="hover:bg-slate-800/20 transition-colors group">
                <td className="px-6 py-4">
                  <p className="text-xs font-bold text-white mb-0.5">{new Date(o.created_at).toLocaleTimeString()}</p>
                  <p className="text-[10px] text-slate-500 font-medium tracking-tight">{new Date(o.created_at).toLocaleDateString()}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-black text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">{o.symbol}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${o.action === 'BUY' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    {o.action}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-bold text-slate-300">{o.quantity}</td>
                <td className="px-6 py-4 text-sm font-mono text-slate-300">₹{o.price.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider font-mono">{o.status}</span>
                  </div>
                </td>
                <td className={`px-6 py-4 text-sm font-bold text-right ${o.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {o.pnl ? (o.pnl >= 0 ? `+₹${o.pnl}` : `-₹${Math.abs(o.pnl)}`) : '--'}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={7} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3 opacity-40">
                    <ShoppingCart size={40} className="text-slate-600" />
                    <p className="text-sm font-medium text-slate-500">No recent orders found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
