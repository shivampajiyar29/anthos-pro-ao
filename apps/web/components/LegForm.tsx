'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface LegProps {
    leg: any;
    index: number;
    onChange: (index: number, field: string, value: any) => void;
    onRemove: (index: number) => void;
}

export default function LegForm({ leg, index, onChange, onRemove }: LegProps) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-4 mb-4 border-l-4 border-[var(--purple)] bg-white/5"
        >
            <div className="flex justify-between items-center mb-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Leg #{index + 1}</h4>
                <button 
                    onClick={() => onRemove(index)}
                    className="text-[10px] text-red-500 hover:text-red-400 font-bold uppercase"
                >
                    Remove
                </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                    <label className="block text-[8px] font-black text-gray-500 uppercase mb-1">Instrument</label>
                    <select 
                        value={leg.instrument_type}
                        onChange={(e) => onChange(index, 'instrument_type', e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-[var(--purple)]"
                    >
                        <option value="EQUITY">EQUITY</option>
                        <option value="OPTIONS">OPTIONS</option>
                        <option value="FUTURES">FUTURES</option>
                    </select>
                </div>
                
                <div>
                    <label className="block text-[8px] font-black text-gray-500 uppercase mb-1">Side</label>
                    <div className="flex bg-black/40 border border-white/10 rounded overflow-hidden">
                        <button 
                            onClick={() => onChange(index, 'side', 'BUY')}
                            className={`flex-1 py-1 text-[10px] font-bold ${leg.side === 'BUY' ? 'bg-green-500/20 text-green-500' : 'text-gray-500'}`}
                        >
                            BUY
                        </button>
                        <button 
                            onClick={() => onChange(index, 'side', 'SELL')}
                            className={`flex-1 py-1 text-[10px] font-bold ${leg.side === 'SELL' ? 'bg-red-500/20 text-red-500' : 'text-gray-500'}`}
                        >
                            SELL
                        </button>
                    </div>
                </div>

                {leg.instrument_type === 'OPTIONS' && (
                    <>
                        <div>
                            <label className="block text-[8px] font-black text-gray-500 uppercase mb-1">Type</label>
                            <select 
                                value={leg.option_type}
                                onChange={(e) => onChange(index, 'option_type', e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none"
                            >
                                <option value="CE">CALL (CE)</option>
                                <option value="PE">PUT (PE)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[8px] font-black text-gray-500 uppercase mb-1">Strike</label>
                            <select 
                                value={leg.strike}
                                onChange={(e) => onChange(index, 'strike', e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none"
                            >
                                <option value="ATM">ATM</option>
                                <option value="OTM1">OTM +1</option>
                                <option value="OTM2">OTM +2</option>
                                <option value="ITM1">ITM -1</option>
                            </select>
                        </div>
                    </>
                )}
                
                <div>
                    <label className="block text-[8px] font-black text-gray-500 uppercase mb-1">Quantity</label>
                    <input 
                        type="number"
                        value={leg.quantity}
                        onChange={(e) => onChange(index, 'quantity', parseInt(e.target.value))}
                        className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none"
                    />
                </div>
            </div>
        </motion.div>
    );
}
