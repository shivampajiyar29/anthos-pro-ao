'use client';

import React from 'react';
import { Zap } from 'lucide-react';
import QuantDashboard from '../page';

export default function PaperTradingPage() {
    return (
        <div className="relative">
            <div className="absolute top-4 left-8 z-10 flex items-center gap-2 px-3 py-1 bg-brand-accent/20 border border-brand-accent/50 rounded-full">
                <Zap size={14} className="text-brand-accent animate-pulse" />
                <span className="text-[10px] font-black text-brand-accent uppercase tracking-widest">Paper Mode Active</span>
            </div>
            <QuantDashboard />
        </div>
    );
}
