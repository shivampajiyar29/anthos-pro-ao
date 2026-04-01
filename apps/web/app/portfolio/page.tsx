'use client';

import React from 'react';
import { Wallet, TrendingUp, Activity } from 'lucide-react';

export default function PortfolioPage() {
    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-black italic text-white uppercase tracking-wider">Portfolio Management</h1>
                <div className="flex gap-4">
                    <div className="px-4 py-2 bg-brand-accent/10 border border-brand-accent/20 rounded-lg">
                        <span className="text-[10px] font-black text-brand-accent uppercase tracking-widest">Total Equity</span>
                        <div className="text-xl font-black text-white">₹1,235,672</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Placeholder for Assets */}
                <div className="col-span-2 bg-brand-panel border border-brand-border rounded-xl p-6 h-[400px] flex flex-col items-center justify-center text-center">
                    <Wallet size={48} className="text-brand-text-muted mb-4" />
                    <h3 className="text-lg font-bold text-white">Asset Allocation</h3>
                    <p className="text-sm text-brand-text-secondary mt-2">Connecting to Neural Engine for real-time asset breakdown...</p>
                </div>

                <div className="bg-brand-panel border border-brand-border rounded-xl p-6">
                    <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4">Performance Metrics</h3>
                    <div className="space-y-4">
                        <MetricRow label="Sharpe Ratio" value="1.29" />
                        <MetricRow label="Sortino Ratio" value="1.45" />
                        <MetricRow label="Max Drawdown" value="8.4%" />
                        <MetricRow label="Volatility" value="12.2%" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function MetricRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between items-center py-2 border-b border-brand-border/50">
            <span className="text-[10px] font-bold text-brand-text-secondary uppercase tracking-tighter">{label}</span>
            <span className="text-sm font-black text-brand-accent">{value}</span>
        </div>
    );
}
