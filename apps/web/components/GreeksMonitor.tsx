'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface GreekProps {
    label: string;
    value: number;
    limit: number;
    unit?: string;
}

const GreekCard = ({ label, value, limit, unit = '' }: GreekProps) => {
    const pct = Math.min(Math.abs(value / limit) * 100, 100);
    const isWarning = pct > 80;
    
    return (
        <div className="glass-panel p-4 bg-white/5 border-white/5">
            <div className="flex justify-between items-end mb-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{label}</span>
                <span className={`text-xl font-black italic ${isWarning ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                    {value.toLocaleString()}{unit}
                </span>
            </div>
            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    className={`h-full ${isWarning ? 'bg-red-500' : 'bg-[var(--purple)]'}`}
                />
            </div>
            <div className="flex justify-between mt-1">
                <span className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">Exposure</span>
                <span className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">Limit: {limit}</span>
            </div>
        </div>
    );
};

export default function GreeksMonitor() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <GreekCard label="Delta" value={3450} limit={5000} />
            <GreekCard label="Gamma" value={120} limit={1000} />
            <GreekCard label="Vega" value={1850} limit={2000} />
            <GreekCard label="Theta" value={-450} limit={1000} unit="/day" />
        </div>
    );
}
