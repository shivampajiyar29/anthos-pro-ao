'use client';

import React, { useState } from 'react';
import {
    Search,
    Bell,
    Monitor,
    Settings,
    User,
    ChevronDown,
    Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import QuickTrade from '../dashboard/QuickTrade';

export default function QuantHeader() {
    const [showTrade, setShowTrade] = useState(false);

    return (
        <header className="h-16 bg-brand-panel border-b border-brand-border px-6 flex items-center justify-between sticky top-0 z-40">
            {/* Search */}
            <div className="flex-1 max-w-md">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-muted group-focus-within:text-brand-accent transition-colors" size={16} />
                    <input
                        type="text"
                        placeholder="Search markets..."
                        className="w-full bg-black/40 border border-brand-border rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-brand-accent/50 transition-all font-medium"
                    />
                </div>
            </div>

            {/* Right Side Tools */}
            <div className="flex items-center gap-6">
                {/* Ticker Selector */}
                <div className="flex items-center gap-2 bg-black/40 border border-brand-border rounded-lg px-3 py-1.5 h-10">
                    <div className="flex items-center gap-2 px-2 py-0.5 rounded bg-brand-accent/10 border border-brand-accent/20">
                        <LineIcon size={14} className="text-brand-accent" />
                        <span className="text-xs font-black text-brand-accent uppercase tracking-tighter">AAPL</span>
                    </div>
                    <div className="w-px h-4 bg-brand-border mx-1" />
                    <span className="text-[10px] font-bold text-brand-text-secondary uppercase">15m</span>
                    <ChevronDown size={14} className="text-brand-text-muted" />
                </div>

                {/* Mode Toggles */}
                <div className="flex items-center gap-2 h-10">
                    <button className="flex items-center gap-2 px-4 py-1.5 bg-black/40 border border-brand-border rounded-lg hover:bg-white/5 transition-colors">
                        <Zap size={14} className="text-brand-text-secondary" />
                        <span className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest leading-none">Paper</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-1.5 bg-brand-accent/10 border border-brand-accent/40 rounded-lg shadow-[0_0_15px_rgba(23,199,161,0.15)]">
                        <LineIcon size={14} className="text-brand-accent fill-brand-accent" />
                        <span className="text-[10px] font-black text-brand-accent uppercase tracking-widest leading-none">Paper</span>
                    </button>
                </div>

                {/* Icons */}
                <div className="flex items-center gap-4 text-brand-text-secondary">
                    <div className="relative">
                        <Zap
                            size={18}
                            onClick={() => setShowTrade(true)}
                            className="hover:text-brand-accent cursor-pointer transition-colors text-brand-text-secondary"
                        />
                    </div>
                    <div className="relative">
                        <Bell size={18} className="hover:text-white cursor-pointer transition-colors" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-brand-panel flex items-center justify-center text-[7px] text-white font-bold">1</div>
                    </div>
                    <Monitor size={18} className="hover:text-white cursor-pointer transition-colors" />
                    <Settings size={18} className="hover:text-white cursor-pointer transition-colors" />
                    <div className="w-px h-6 bg-brand-border" />
                    <User size={18} className="hover:text-white cursor-pointer transition-colors" />
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-500 flex items-center justify-center text-xs font-black">
                        P
                    </div>
                </div>
            </div>

            {showTrade && <QuickTrade onClose={() => setShowTrade(false)} />}
        </header>
    );
}

const LineIcon = ({ size, className }: any) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M3 3v18h18" />
        <path d="m19 9-5 5-4-4-3 3" />
    </svg>
);
