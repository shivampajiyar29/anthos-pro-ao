"use client";

import React, { useState, useEffect } from 'react';
import { Activity, Play, StopCircle, RefreshCw } from 'lucide-react';

export default function DeploymentMonitor() {
  const [deployments, setDeployments] = useState([
    { id: 1, strategy: "Nifty Short Straddle", mode: "PAPER", status: "ACTIVE", pnl: 4500.0, orders: 2 },
    { id: 2, strategy: "BankNifty Iron Fly", mode: "PAPER", status: "STOPPED", pnl: -1200.0, orders: 4 },
  ]);

  const [orders, setOrders] = useState([
    { id: 'o1', symbol: 'NIFTY 20MAR CE 22000', side: 'SELL', qty: 50, price: 124.5, status: 'FILLED', time: '09:20:01' },
    { id: 'o2', symbol: 'NIFTY 20MAR PE 22000', side: 'SELL', qty: 50, price: 98.2, status: 'FILLED', time: '09:20:02' },
  ]);

  return (
    <div className="p-6 bg-slate-900 min-h-screen text-white">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-600 bg-clip-text text-transparent">
              Deployment Monitor
            </h1>
            <p className="text-slate-400">Track and manage your live/paper strategies</p>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition-colors border border-slate-700">
              <RefreshCw size={18} /> Refresh
            </button>
            <button className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 px-4 py-2 rounded-lg font-semibold transition-colors">
              <Activity size={18} /> New Deployment
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {deployments.map((d) => (
            <div key={d.id} className="bg-slate-800 rounded-xl p-5 border border-slate-700 shadow-xl">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${d.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
                  {d.status}
                </span>
                <span className="text-xs text-slate-500 font-mono">{d.mode}</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{d.strategy}</h3>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm text-slate-400">Current P&L</p>
                  <p className={`text-2xl font-mono font-bold ${d.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {d.pnl >= 0 ? '+' : ''}{d.pnl.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                  </p>
                </div>
                <div className="flex gap-2">
                  {d.status === 'ACTIVE' ? (
                    <button className="p-2 bg-slate-700 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-all border border-slate-600">
                      <StopCircle size={20} />
                    </button>
                  ) : (
                    <button className="p-2 bg-slate-700 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-all border border-slate-600">
                      <Play size={20} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <section className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
          <div className="p-4 border-b border-slate-700 bg-slate-800/50">
            <h2 className="text-lg font-semibold">Live Orders</h2>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900/50 text-slate-400 text-sm uppercase">
                <th className="px-6 py-3 font-semibold">Time</th>
                <th className="px-6 py-3 font-semibold">Symbol</th>
                <th className="px-6 py-3 font-semibold">Side</th>
                <th className="px-6 py-3 font-semibold">Qty</th>
                <th className="px-6 py-3 font-semibold">Price</th>
                <th className="px-6 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono">{order.time}</td>
                  <td className="px-6 py-4 font-bold">{order.symbol}</td>
                  <td className={`px-6 py-4 font-bold ${order.side === 'BUY' ? 'text-brand-400' : 'text-amber-400'}`}>{order.side}</td>
                  <td className="px-6 py-4">{order.qty}</td>
                  <td className="px-6 py-4 font-mono">₹{order.price.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded text-xs font-bold bg-brand-500/10 text-brand-400 border border-brand-500/20">
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
