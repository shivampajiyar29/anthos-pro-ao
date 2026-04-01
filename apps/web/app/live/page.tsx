'use client';

import React from 'react';
import { Globe, Lock } from 'lucide-react';

export default function LiveTradingPage() {
    return (
        <div className="p-8 h-full flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                <Lock size={32} />
            </div>
            <h1 className="text-2xl font-black italic text-white uppercase tracking-wider">Live Trading Locked</h1>
            <p className="text-brand-text-secondary max-w-sm">Neural Sync v2 is required for local live execution. Please complete the Know Your Bot (KYB) verification in settings.</p>
            <button className="px-6 py-2 bg-brand-accent text-brand-bg text-[10px] font-black uppercase rounded-lg shadow-lg shadow-brand-accent/10">Start Verification</button>
        </div>
    );
}
