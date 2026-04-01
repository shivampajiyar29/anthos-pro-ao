'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, Cpu, Bell, Globe, Activity } from 'lucide-react';

interface AuditLog {
    id: string;
    timestamp: string;
    message: string;
    type: 'security' | 'neural' | 'broker' | 'alert' | 'system';
}

const LOG_TEMPLATES = [
    { type: 'security', msg: 'Sentinel adjusted hedge ratio for risk mitigation' },
    { type: 'neural', msg: 'Strategist weights rebalanced via backprop' },
    { type: 'broker', msg: 'Alpaca Node latency stabilized at 12ms' },
    { type: 'alert', msg: 'Volatility expansion detected in NIFTY50' },
    { type: 'system', msg: 'Global encryption keys rotated successfully' },
    { type: 'neural', msg: 'Tactician identifying buy-side liquidity gap' },
    { type: 'security', msg: 'Circuit breaker sensitivity auto-optimized' }
];

export default function AuditTrail() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            const template = LOG_TEMPLATES[Math.floor(Math.random() * LOG_TEMPLATES.length)];
            const newLog: AuditLog = {
                id: Math.random().toString(36).substr(2, 9),
                timestamp: new Date().toLocaleTimeString('en-US'),
                message: template.msg,
                type: template.type as any
            };
            setLogs(prev => [newLog, ...prev].slice(0, 8));
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    const getIcon = (type: string) => {
        switch (type) {
            case 'security': return <Shield size={12} className="text-red-400" />;
            case 'neural': return <Cpu size={12} className="text-purple-400" />;
            case 'broker': return <Globe size={12} className="text-cyan-400" />;
            case 'alert': return <Bell size={12} className="text-yellow-400" />;
            default: return <Activity size={12} className="text-green-400" />;
        }
    };

    return (
        <div className="glass-panel p-5 h-full relative overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                    System Audit Trail
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_green] animate-pulse" />
                </h3>
                <span className="text-[8px] text-gray-500 font-bold uppercase">Institutional Log</span>
            </div>

            <div className="flex-1 space-y-2 overflow-hidden" ref={containerRef}>
                <AnimatePresence initial={false}>
                    {logs.map((log) => (
                        <motion.div
                            key={log.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="flex items-start gap-3 p-2.5 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-all group"
                        >
                            <div className="mt-0.5">{getIcon(log.type)}</div>
                            <div className="flex-1 min-w-0">
                                <div className="text-[9px] text-gray-300 font-medium leading-relaxed group-hover:text-white transition-colors capitalize">
                                    {log.message}
                                </div>
                                <div className="text-[7px] text-gray-600 font-black mt-1 mono" suppressHydrationWarning>
                                    [{log.timestamp}] // NODE_SYNC: OK
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Decorative bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
        </div>
    );
}
