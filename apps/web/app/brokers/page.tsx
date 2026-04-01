"use client";

import React, { useEffect, useState } from 'react';
import { Plus, Shield, Globe, Pencil, Trash2, Power } from 'lucide-react';

export default function BrokersPage() {
  const [brokers, setBrokers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/brokers/')
      .then(res => res.json())
      .then(data => setBrokers(data))
      .catch(err => console.error("Failed to fetch brokers", err));
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Broker <span className="text-blue-400">Accounts</span></h1>
          <p className="text-slate-400 mt-2 font-medium">Link your trading accounts to Athos Pro</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-900/20">
          <Plus size={20} />
          Link New Broker
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brokers.length > 0 ? brokers.map((b: any) => (
          <div key={b.id} className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 group transition-all hover:border-blue-500/30">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-blue-400">
                <Globe size={24} />
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-xl transition-all">
                  <Pencil size={18} />
                </button>
                <button className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-400/10 rounded-xl transition-all">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            
            <div className="space-y-1 mb-6">
              <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">{b.broker_name}</h3>
              <p className="text-sm text-slate-500 font-medium">Account ID: XXXX{b.id}</p>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-slate-800/50">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${b.is_active ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                <span className={`text-[10px] font-black uppercase tracking-widest ${b.is_active ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {b.is_active ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <button className={`p-2 rounded-xl border transition-all ${b.is_active ? 'border-emerald-500/20 text-emerald-400 hover:bg-emerald-400/10' : 'border-slate-800 text-slate-500'}`}>
                <Power size={18} />
              </button>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-20 bg-slate-900/20 border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center space-y-4">
             <div className="p-4 bg-slate-800/50 rounded-full text-slate-600">
                <Shield size={40} />
             </div>
             <div className="text-center">
                <p className="text-white font-bold text-lg">No Broker Accounts Linked</p>
                <p className="text-slate-500 text-sm">Start by connecting your Zerodha or Binance account.</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
