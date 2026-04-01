'use client';

import React, { useState } from 'react';
import { Send, X, TrendingUp, TrendingDown } from 'lucide-react';
import api from '@/lib/api';

export default function QuickTrade({ onClose }: { onClose: () => void }) {
    const [symbol, setSymbol] = useState('AAPL');
    const [quantity, setQuantity] = useState(1);
    const [price, setPrice] = useState(185.50);
    const [side, setSide] = useState<'BUY' | 'SELL'>('BUY');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<string | null>(null);

    const handleExecute = async () => {
        setLoading(true);
        setStatus('Executing Order...');
        try {
            const response = await api.post('/orders/', {
                symbol,
                side,
                quantity,
                price,
                order_type: 'MARKET'
            });
            setStatus(`Order Filled! ID: ${response.data.id}`);
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (error) {
            console.error(error);
            setStatus('Execution Failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-brand-panel border border-brand-accent/30 rounded-2xl shadow-2xl p-6 relative overflow-hidden">
                {/* Glow layer */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-accent/10 rounded-full blur-[80px]" />

                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-xl font-black italic text-white uppercase tracking-wider">Execute Trade</h3>
                        <p className="text-[10px] text-brand-text-secondary font-black uppercase tracking-widest mt-1">Manual Neuro-Terminal v2.4</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-brand-text-secondary transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => setSide('BUY')}
                            className={`py-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${side === 'BUY' ? 'bg-brand-accent/20 border-brand-accent text-brand-accent' : 'bg-white/5 border-transparent text-brand-text-secondary hover:bg-white/10'}`}
                        >
                            <TrendingUp size={24} />
                            <span className="text-xs font-black uppercase tracking-widest">BUY / LONG</span>
                        </button>
                        <button
                            onClick={() => setSide('SELL')}
                            className={`py-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${side === 'SELL' ? 'bg-red-500/20 border-red-500 text-red-500' : 'bg-white/5 border-transparent text-brand-text-secondary hover:bg-white/10'}`}
                        >
                            <TrendingDown size={24} />
                            <span className="text-xs font-black uppercase tracking-widest">SELL / SHORT</span>
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest ml-1">Asset Symbol</label>
                            <input
                                type="text"
                                value={symbol}
                                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                                className="w-full bg-black/40 border border-brand-border rounded-xl px-4 py-3 text-white font-bold tracking-widest focus:border-brand-accent outline-none transition-colors"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest ml-1">Quantity</label>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                    className="w-full bg-black/40 border border-brand-border rounded-xl px-4 py-3 text-white font-bold focus:border-brand-accent outline-none transition-colors"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest ml-1">Price (Limit)</label>
                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(Number(e.target.value))}
                                    className="w-full bg-black/40 border border-brand-border rounded-xl px-4 py-3 text-white font-bold focus:border-brand-accent outline-none transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    {status && (
                        <div className="p-3 bg-brand-accent/10 border border-brand-accent/20 rounded-lg text-center">
                            <span className="text-[10px] font-black text-brand-accent uppercase animate-pulse">{status}</span>
                        </div>
                    )}

                    <button
                        onClick={handleExecute}
                        disabled={loading}
                        className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-brand-bg transition-all shadow-xl flex items-center justify-center gap-3 ${side === 'BUY' ? 'bg-brand-accent shadow-brand-accent/20' : 'bg-red-500 shadow-red-500/20'} ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'}`}
                    >
                        {loading ? 'Processing...' : (
                            <>
                                <Send size={18} />
                                Confirm Order
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
