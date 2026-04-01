'use client';

import React from 'react';
import { Layers, Puzzle } from 'lucide-react';

export default function ModulesPage() {
    return (
        <div className="p-8 space-y-6">
            <h1 className="text-2xl font-black italic text-white uppercase tracking-wider">Module Manager</h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {['Data Ingestion', 'Risk Engine', 'Order Router', 'Sentiment AI'].map(m => (
                    <div key={m} className="bg-brand-panel border border-brand-border rounded-xl p-6 space-y-4">
                        <div className="flex justify-between items-start">
                            <div className="w-10 h-10 rounded-lg bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent">
                                <Layers size={20} />
                            </div>
                            <div className="px-2 py-0.5 rounded bg-brand-accent/10 text-brand-accent text-[8px] font-black uppercase">Active</div>
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-white italic tracking-tight">{m}</h3>
                            <p className="text-[10px] text-brand-text-secondary mt-1 uppercase font-bold tracking-widest leading-tight">Version 1.2.4-stable</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
