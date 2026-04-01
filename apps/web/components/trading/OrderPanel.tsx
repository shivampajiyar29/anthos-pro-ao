"use client";

import React, { useState } from 'react';
import { X, ArrowUpRight, ArrowDownRight, Zap, Target, ShieldCheck } from 'lucide-react';

interface OrderPanelProps {
    stock: any;
    isOpen: boolean;
    onClose: () => void;
}

const OrderPanel: React.FC<OrderPanelProps> = ({ stock, isOpen, onClose }) => {
    const [side, setSide] = useState<'BUY' | 'SELL'>('BUY');
    const [orderType, setOrderType] = useState('MARKET');
    const [qty, setQty] = useState(1);

    if (!isOpen || !stock) return null;

    return (
        <div className="fixed inset-y-0 right-0 w-[400px] bg-slate-950 border-l border-slate-900 shadow-2xl z-50 transform transition-transform duration-300 ease-out flex flex-col">
            <div className="p-6 border-b border-slate-900 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${
                        stock.is_up ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                    }`}>
                        {stock.symbol.charAt(0)}
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-white leading-tight uppercase tracking-tight">{stock.name}</h3>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stock.symbol} • NSE</p>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
                    <X size={24} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
                <div className="grid grid-cols-2 gap-2 bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800/50">
                    <button 
                        onClick={() => setSide('BUY')}
                        className={`py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                            side === 'BUY' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' : 'text-slate-500 hover:text-white'
                        }`}
                    >
                        BUY
                    </button>
                    <button 
                        onClick={() => setSide('SELL')}
                        className={`py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                            side === 'SELL' ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/20' : 'text-slate-500 hover:text-white'
                        }`}
                    >
                        SELL
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Order Type</span>
                        <div className="flex gap-2">
                            {['MARKET', 'LIMIT', 'SL'].map((t) => (
                                <button 
                                    key={t}
                                    onClick={() => setOrderType(t)}
                                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${
                                        orderType === t ? 'border-blue-500 bg-blue-500/10 text-blue-400' : 'border-slate-800 text-slate-600'
                                    }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                             <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1">Quantity</label>
                             <input 
                                type="number" 
                                value={qty}
                                onChange={(e) => setQty(Number(e.target.value))}
                                className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500/50 rounded-xl py-3 px-4 text-white focus:outline-none font-bold"
                             />
                        </div>
                        <div className="space-y-2">
                             <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1">Price</label>
                             <input 
                                type="text" 
                                value={orderType === 'MARKET' ? 'Market' : stock.price}
                                disabled={orderType === 'MARKET'}
                                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 px-4 text-slate-500 font-bold cursor-not-allowed"
                             />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <OrderOption icon={Zap} label="Instant" active />
                    <OrderOption icon={Target} label="GTT" />
                    <OrderOption icon={ShieldCheck} label="IOC" />
                </div>

                <div className="bg-slate-900/40 border border-slate-800/50 rounded-2xl p-4 space-y-3">
                    <div className="flex justify-between text-[10px] uppercase font-black tracking-widest">
                        <span className="text-slate-500">Required Margin</span>
                        <span className="text-white">₹{(stock.price * qty * 0.2).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[10px] uppercase font-black tracking-widest">
                        <span className="text-slate-500">Available Funds</span>
                        <span className="text-emerald-500">₹4,25,000.00</span>
                    </div>
                </div>
            </div>

            <div className="p-6 border-t border-slate-900">
                <button className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-white transition-all shadow-2xl active:scale-[0.98] ${
                    side === 'BUY' ? 'bg-emerald-600 shadow-emerald-900/20' : 'bg-rose-600 shadow-rose-900/20'
                }`}>
                    EXECUTE {side} ORDER
                </button>
            </div>
        </div>
    );
};

const OrderOption = ({ icon: Icon, label, active }: any) => (
    <div className={`p-4 rounded-2xl border flex flex-col items-center gap-2 cursor-pointer transition-all ${
        active ? 'border-blue-500/50 bg-blue-500/5' : 'border-slate-800 bg-slate-900/30'
    }`}>
        <Icon size={16} className={active ? 'text-blue-500' : 'text-slate-600'} />
        <span className={`text-[9px] font-black uppercase tracking-widest ${active ? 'text-blue-400' : 'text-slate-600'}`}>{label}</span>
    </div>
);

export default OrderPanel;
