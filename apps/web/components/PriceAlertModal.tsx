'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Zap, Info, ChevronDown } from 'lucide-react';

interface PriceAlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    symbol: string;
    currentPrice: number;
    onSave: (alert: any) => void;
}

export default function PriceAlertModal({ isOpen, onClose, symbol, currentPrice, onSave }: PriceAlertModalProps) {
    const [criteria, setCriteria] = useState<'Target Price' | 'Movement Amount'>('Target Price');
    const [targetPrice, setTargetPrice] = useState(currentPrice.toString());
    const [platform, setPlatform] = useState('In-app, Email, and Mobile');
    const [defaultQuery, setDefaultQuery] = useState(`Explain the factors driving the latest movement of ${symbol}, including its recent rise/fall to $${targetPrice}. Contextualize this price movement within the last few weeks of price movement and investor narrative.`);
    const [additionalInstructions, setAdditionalInstructions] = useState('');

    const handleSave = () => {
        onSave({
            symbol,
            target_price: parseFloat(targetPrice),
            alert_criteria: criteria,
            notification_platform: platform,
            default_query: defaultQuery,
            additional_instructions: additionalInstructions,
            is_active: true
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-md"
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="glass-panel w-full max-w-xl border-[var(--glass-border)] shadow-2xl p-6"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            Price alert
                        </h2>
                        <button onClick={onClose} className="p-2 text-gray-500 hover:text-white transition-all">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Criteria & Target Price */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">
                                    Alert criteria
                                </label>
                                <div className="flex bg-black/40 rounded-lg p-1 border border-white/5">
                                    <button
                                        onClick={() => setCriteria('Target Price')}
                                        className={`flex-1 py-2 text-[10px] font-bold rounded-md transition-all ${criteria === 'Target Price' ? 'bg-[var(--cyan)]/10 text-[var(--cyan)] border border-[var(--cyan)]/20 shadow-[0_0_15px_rgba(0,255,255,0.1)]' : 'text-gray-500'}`}
                                    >
                                        Target Price
                                    </button>
                                    <button
                                        onClick={() => setCriteria('Movement Amount')}
                                        className={`flex-1 py-2 text-[10px] font-bold rounded-md transition-all ${criteria === 'Movement Amount' ? 'bg-[var(--cyan)]/10 text-[var(--cyan)] border border-[var(--cyan)]/20 shadow-[0_0_15px_rgba(0,255,255,0.1)]' : 'text-gray-500'}`}
                                    >
                                        Movement Amount
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                                    Target Price (currently ${currentPrice.toLocaleString()})
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={`$${targetPrice}`}
                                        onChange={(e) => setTargetPrice(e.target.value.replace('$', ''))}
                                        className="w-full bg-black/60 border border-white/10 rounded-lg py-2.5 px-4 text-white text-lg font-bold focus:border-[var(--cyan)] outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Notification Platform */}
                        <div>
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">
                                Notification platform
                            </label>
                            <div className="relative">
                                <select
                                    value={platform}
                                    onChange={(e) => setPlatform(e.target.value)}
                                    className="w-full bg-black/60 border border-white/10 rounded-lg py-3 px-4 text-gray-300 text-sm font-bold appearance-none focus:border-[var(--cyan)] outline-none transition-all cursor-pointer"
                                >
                                    <option>In-app, Email, and Mobile</option>
                                    <option>In-app only</option>
                                    <option>Mobile Push</option>
                                </select>
                                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                            </div>
                        </div>

                        {/* Default Query */}
                        <div>
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">
                                Default query
                            </label>
                            <textarea
                                value={defaultQuery}
                                onChange={(e) => setDefaultQuery(e.target.value)}
                                className="w-full bg-black/60 border border-white/10 rounded-lg py-3 px-4 text-gray-400 text-sm leading-relaxed focus:border-[var(--cyan)] outline-none transition-all resize-none h-24"
                            />
                        </div>

                        {/* Additional Instructions */}
                        <div>
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block flex items-center gap-1">
                                Additional Instructions <span className="text-gray-600 font-medium">(optional)</span>
                            </label>
                            <textarea
                                placeholder="Check news and social media sentiment to assess consensus or controversy"
                                value={additionalInstructions}
                                onChange={(e) => setAdditionalInstructions(e.target.value)}
                                className="w-full bg-black/60 border border-white/10 rounded-lg py-3 px-4 text-gray-300 text-sm focus:border-[var(--cyan)] outline-none transition-all resize-none h-24 placeholder:text-gray-700"
                            />
                        </div>

                        {/* Footer Buttons */}
                        <div className="flex gap-3 pt-4">
                            <button
                                onClick={onClose}
                                className="flex-1 py-3 rounded-lg bg-white/5 text-gray-400 font-bold hover:bg-white/10 transition-all uppercase tracking-widest text-[10px]"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex-[2] py-3 rounded-lg bg-white text-black font-black hover:bg-[var(--cyan)] transition-all uppercase tracking-widest text-[10px] shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(0,255,255,0.2)]"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
