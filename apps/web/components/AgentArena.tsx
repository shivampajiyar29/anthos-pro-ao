'use client';

import React, { useState, useEffect } from 'react';
import { TradingAgent } from '../lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Zap, TrendingUp, TrendingDown, MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';

function Sparkline({ data, color }: { data: number[]; color: string }) {
    if (!data || data.length < 2) return null;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max === min ? 1 : max - min;
    const width = 40;
    const height = 15;
    const points = data.map((v, i) => ({
        x: (i / (data.length - 1)) * width,
        y: height - ((v - min) / range) * height
    }));
    const pathData = `M ${points.map(p => `${p.x} ${p.y}`).join(' L ')}`;

    return (
        <svg width={width} height={height} className="overflow-visible">
            <path
                d={pathData}
                fill="none"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export default function AgentArena({ agents, onUpdateAgent }: { agents: TradingAgent[], onUpdateAgent: (id: string, updates: Partial<TradingAgent>) => void }) {
    const [chatter, setChatter] = useState<{ agentId: string, text: string } | null>(null);
    const [feedback, setFeedback] = useState<Record<string, 'up' | 'down'>>({});

    useEffect(() => {
        const interval = setInterval(() => {
            if (Math.random() > 0.7) {
                const agent = agents[Math.floor(Math.random() * agents.length)];
                const messages = [
                    "Analyzing buy-side pressure...",
                    "Neural pathways synced.",
                    "Sentiment drift detected.",
                    "Hedge ratio adjusted.",
                    "Order book cleared."
                ];
                setChatter({ agentId: agent.id, text: messages[Math.floor(Math.random() * messages.length)] });
                setTimeout(() => setChatter(null), 3000);
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [agents]);

    const handleFeedback = async (agentId: string, type: 'up' | 'down') => {
        setFeedback(prev => ({ ...prev, [agentId]: type }));

        try {
            await fetch('/api/agents/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ agent_id: agentId, feedback: type })
            });
        } catch (error) {
            console.error("Feedback sync failed", error);
        }

        const agent = agents.find(a => a.id === agentId);
        setChatter({
            agentId,
            text: type === 'up'
                ? `System feedback acknowledged. Prioritizing ${agent?.role}'s current strategy.`
                : `Anomaly reported. Recalibrating ${agent?.role}'s risk threshold.`
        });
        setTimeout(() => setChatter(null), 3000);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                        Neural Agent Arena
                        <div className="flex gap-1">
                            <span className="w-1 h-1 rounded-full bg-[var(--cyan)] animate-ping" />
                            <span className="w-1 h-1 rounded-full bg-[var(--purple)] animate-ping delay-75" />
                        </div>
                    </h2>
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">CROSS-MODEL DISTRIBUTED EXECUTION</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {agents.map((agent) => (
                    <motion.div
                        key={agent.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`glass-panel p-4 relative group hover:border-[var(--cyan)]/50 transition-all border-2 ${agent.thinking ? 'border-[var(--purple)]/30' : 'border-white/5'} ${agent.disabled ? 'opacity-50 grayscale' : ''}`}
                    >
                        {/* Thinking Overlay */}
                        <AnimatePresence>
                            {(agent.thinking && !agent.disabled) && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 bg-black/40 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-xl"
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <Brain size={24} className="text-[var(--purple)] animate-pulse" />
                                        <span className="text-[8px] font-black text-[var(--purple)] uppercase tracking-widest">Synthesizing...</span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-800 to-black flex items-center justify-center border border-white/10 group-hover:border-[var(--cyan)]/30 transition-all">
                                <Brain size={20} className={agent.disabled ? 'text-gray-600' : (agent.pnl >= 0 ? 'text-[var(--cyan)]' : 'text-[var(--red)]')} />
                            </div>
                            <div className="text-right">
                                <div className={`text-xs font-black mono ${agent.pnl >= 0 ? 'text-[var(--green)]' : 'text-[var(--red)]'}`} suppressHydrationWarning>
                                    <div className="flex items-center gap-2">
                                        <Sparkline data={agent.pnlHistory || []} color={agent.pnl >= 0 ? 'var(--green)' : 'var(--red)'} />
                                        <span>{agent.pnl >= 0 ? '+' : ''}{agent.pnl.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%</span>
                                    </div>
                                </div>
                                <div className="text-[8px] text-gray-500 uppercase font-black">{agent.model}</div>
                            </div>
                        </div>

                        <div className="space-y-1 mb-4">
                            <div className="flex justify-between items-center">
                                <h4 className="text-[10px] font-black text-white uppercase tracking-wider">{agent.name}</h4>
                                <button
                                    onClick={() => onUpdateAgent(agent.id, { disabled: !agent.disabled })}
                                    className={`w-8 h-4 rounded-full relative transition-colors ${agent.disabled ? 'bg-gray-700' : 'bg-[var(--green)]'}`}
                                >
                                    <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${agent.disabled ? 'left-0.5' : 'left-4.5'}`} />
                                </button>
                            </div>
                            <p className="text-[9px] text-gray-400 font-bold truncate italic">"{agent.lastAction}"</p>
                        </div>

                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-2">
                                <div className="p-2 rounded bg-black/40 border border-white/5">
                                    <div className="text-[8px] text-gray-500 uppercase font-black">Confidence</div>
                                    <div className="text-[10px] text-white mono font-bold" suppressHydrationWarning>{agent.confidence?.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%</div>
                                </div>
                                <div className="p-2 rounded bg-black/40 border border-white/5">
                                    <div className="text-[8px] text-gray-500 uppercase font-black">Role</div>
                                    <div className="text-[10px] text-[var(--cyan)] font-bold">{agent.role}</div>
                                </div>
                            </div>

                            <div className="px-1">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-[8px] text-gray-500 font-bold uppercase">Aggressiveness</span>
                                    <span className="text-[8px] text-[var(--purple)] font-black">{agent.aggressiveness || 50}%</span>
                                </div>
                                <input
                                    type="range"
                                    className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[var(--purple)]"
                                    value={agent.aggressiveness || 50}
                                    onChange={(e) => onUpdateAgent(agent.id, { aggressiveness: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>

                        {/* RLHF Feedback Mini-Buttons */}
                        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                            <div className="flex gap-1.5">
                                <button
                                    onClick={() => handleFeedback(agent.id, 'up')}
                                    className={`p-1.5 rounded-md border transition-all ${feedback[agent.id] === 'up' ? 'bg-[var(--green)]/20 border-[var(--green)] text-[var(--green)] shadow-[0_0_10px_rgba(0,255,0,0.2)]' : 'bg-white/5 border-transparent text-gray-500 hover:text-white'}`}
                                >
                                    <ThumbsUp size={10} />
                                </button>
                                <button
                                    onClick={() => handleFeedback(agent.id, 'down')}
                                    className={`p-1.5 rounded-md border transition-all ${feedback[agent.id] === 'down' ? 'bg-[var(--red)]/20 border-[var(--red)] text-[var(--red)] shadow-[0_0_10px_rgba(255,0,0,0.2)]' : 'bg-white/5 border-transparent text-gray-500 hover:text-white'}`}
                                >
                                    <ThumbsDown size={10} />
                                </button>
                            </div>
                            <div className="flex items-center gap-1.5 text-gray-600">
                                <MessageSquare size={10} />
                                <span className="text-[8px] font-bold">RLHF</span>
                            </div>
                        </div>

                        {/* Chatter Pop-up */}
                        <AnimatePresence>
                            {chatter?.agentId === agent.id && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="absolute -top-12 left-0 right-0 z-20 flex justify-center"
                                >
                                    <div className="px-3 py-1.5 bg-[var(--purple)] text-white text-[9px] font-black rounded-lg shadow-xl flex items-center gap-2 whitespace-nowrap">
                                        <Zap size={10} className="text-yellow-400" />
                                        {chatter.text}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
