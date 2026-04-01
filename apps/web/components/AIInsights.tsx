'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, MessageSquareQuote, Cpu, ShieldAlert, Zap, RefreshCw, ThumbsUp, ThumbsDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MODELS = [
    { id: 'grok', name: 'Grok 4.20', icon: Sparkles, color: 'text-[var(--cyan)]', bg: 'bg-[var(--cyan)]/10', border: 'border-[var(--cyan)]/30', avatar: 'GK' },
    { id: 'claude', name: 'Claude 4.5', icon: ShieldAlert, color: 'text-purple-400', bg: 'bg-purple-900/20', border: 'border-purple-500/30', avatar: 'CL' },
    { id: 'nvidia', name: 'NVIDIA Qwen', icon: Cpu, color: 'text-[var(--green)]', bg: 'bg-[var(--green)]/10', border: 'border-[var(--green)]/30', avatar: 'NV' }
];

const NARRATIVE_POOL: Record<string, string[]> = {
    'grok': [
        "Bullish divergence detected on HTF. Order flow confirms institutional accumulation at lower boundaries.",
        "Volatility expansion imminent. Gamma exposure levels suggest a potential squeeze above current resistance.",
        "Macro sentiment shifting. Interest rate expectations being priced into tech sector outflow."
    ],
    'claude': [
        "Neural net confirms high-probability reversal zone. RSI oversold on 15m timeframe.",
        "Whale movement detected in derivative markets. Large-scale hedging observed on SPY/QQQ.",
        "Algorithmic buy pressure mounting. Liquidity gaps appearing on the sell side."
    ],
    'nvidia': [
        "Correlation breakdown between BTC and Equities. Crypto-native alpha emerging.",
        "Exhaustion markers identified on the 1h trend. Recommend defensive positioning.",
        "Delta neutral strategies showing optimal Sharpe ratios in current range-bound state.",
        "Black swan risk metrics trending neutral. Geopolitical factors providing temporary support."
    ]
};

export default function AIInsights({ insight }: { insight: string }) {
    const [activeModelId, setActiveModelId] = useState('grok');
    const [isRegenerating, setIsRegenerating] = useState(false);
    const [currentInsight, setCurrentInsight] = useState(insight);
    const [timestamp, setTimestamp] = useState<string | null>(null);

    useEffect(() => {
        setTimestamp(new Date().toLocaleTimeString());
    }, []);

    const currentModel = MODELS.find(m => m.id === activeModelId) || MODELS[0];

    const handleRegenerate = async () => {
        setIsRegenerating(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1200));
            const pool = NARRATIVE_POOL[activeModelId] || NARRATIVE_POOL['grok'];
            const randomIdx = Math.floor(Math.random() * pool.length);
            setCurrentInsight(pool[randomIdx]);
            setTimestamp(new Date().toLocaleTimeString());
        } catch (error) {
            console.error("Narrative generation failed", error);
        } finally {
            setIsRegenerating(false);
        }
    };

    // Change insight when model changes to give immediate feedback
    useEffect(() => {
        const pool = NARRATIVE_POOL[activeModelId] || NARRATIVE_POOL['grok'];
        setCurrentInsight(pool[0]);
        setTimestamp(new Date().toLocaleTimeString());
    }, [activeModelId]);

    return (
        <div className={`glass-panel p-6 relative overflow-hidden h-full flex flex-col transition-all duration-500 border-2 ${currentModel.border}`}>

            {/* Dynamic Background Glow */}
            <div className={`absolute top-0 right-0 w-32 h-32 blur-[80px] rounded-full opacity-20 transition-all ${currentModel.bg}`} />

            <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                    <motion.div
                        key={currentModel.id}
                        initial={{ scale: 0.8, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${currentModel.bg} ${currentModel.border}`}
                    >
                        <span className={`text-sm font-black ${currentModel.color}`}>{currentModel.avatar}</span>
                    </motion.div>
                    <div>
                        <h3 className="text-sm font-extrabold text-white uppercase tracking-widest flex items-center gap-2">
                            {currentModel.name}
                            <currentModel.icon size={14} className={currentModel.color} />
                        </h3>
                        <p className="text-[9px] text-gray-500 uppercase font-bold tracking-tighter" suppressHydrationWarning>LAST UPDATED: {timestamp || '--:--:--'}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleRegenerate}
                        disabled={isRegenerating}
                        className={`p-2 rounded-lg bg-black/40 border border-white/5 text-gray-400 hover:text-white transition-all ${isRegenerating ? 'animate-spin border-[var(--cyan)] text-[var(--cyan)]' : ''}`}
                        title="Regenerate Analysis"
                    >
                        <RefreshCw size={14} />
                    </button>

                    <div className="flex p-1 bg-black/40 rounded-xl border border-white/5">
                        {MODELS.map((m) => (
                            <button
                                key={m.id}
                                onClick={() => setActiveModelId(m.id)}
                                className={`px-3 py-1.5 rounded-lg text-[9px] font-black transition-all ${activeModelId === m.id ? `${m.bg} ${m.color} shadow-lg` : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                {m.id.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex-1 relative mb-6">
                <MessageSquareQuote className="absolute -top-4 -left-2 text-white/5" size={60} />
                <AnimatePresence mode="wait">
                    {!isRegenerating ? (
                        <motion.div
                            key={currentInsight + activeModelId}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="text-sm text-gray-300 leading-relaxed italic relative z-10 pl-8 font-medium"
                        >
                            "{currentInsight}"
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={`flex items-center gap-3 pl-8 text-sm ${currentModel.color} mono italic`}
                        >
                            <Zap size={14} className="animate-pulse" />
                            Neural refinement in progress...
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
                <div className="flex gap-4">
                    <button
                        onClick={() => alert("Feedback logged: System will prioritize this pattern.")}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/5 text-[10px] font-black text-gray-400 hover:text-[var(--green)] hover:bg-[var(--green)]/10 transition-all border border-transparent hover:border-[var(--green)]/30 group"
                    >
                        <ThumbsUp size={14} className="group-hover:scale-110 transition-transform" />
                        <span>USEFUL FEEDBACK</span>
                    </button>
                    <button
                        onClick={() => alert("Noise reported: Filtering similar signals.")}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/5 text-[10px] font-black text-gray-500 hover:text-[var(--red)] hover:bg-[var(--red)]/10 transition-all border border-transparent hover:border-[var(--red)]/30 group"
                    >
                        <ThumbsDown size={14} className="group-hover:scale-110 transition-transform" />
                        <span>REDUNDANT NOISE</span>
                    </button>
                </div>
                <div className="text-[9px] text-gray-600 font-bold uppercase tracking-[0.2em] hidden sm:block">
                    SOURCE Node: {currentModel.name.toUpperCase()}
                </div>
            </div>
        </div>
    );
}
