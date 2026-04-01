'use client';

import React from 'react';
import { LineChart, Activity } from 'lucide-react';

export default function LogsPage() {
    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center px-4 py-2 border-b border-brand-border">
                <h1 className="text-xl font-black italic text-white uppercase tracking-widest">Neural System Logs</h1>
                <div className="flex gap-2">
                    {['ALL', 'ORDERS', 'SYSTEM', 'AI', 'RISK'].map(t => (
                        <button key={t} className="px-3 py-1 text-[9px] font-black uppercase border border-brand-border rounded hover:bg-white/5">{t}</button>
                    ))}
                </div>
            </div>

            <div className="bg-brand-panel border border-brand-border rounded-xl p-4 font-mono text-[10px] h-[600px] overflow-y-auto custom-scrollbar">
                <div className="space-y-1">
                    {Array.from({ length: 50 }).map((_, i) => (
                        <div key={i} className="flex gap-4 p-1 hover:bg-white/5 rounded">
                            <span className="text-brand-text-muted shrink-0">[20:44:{10 + i}]</span>
                            <span className="text-brand-accent shrink-0 uppercase">[INFO]</span>
                            <span className="text-white">Neural Handshake successful. Agent-0{i % 4} heartbeat detected.</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
