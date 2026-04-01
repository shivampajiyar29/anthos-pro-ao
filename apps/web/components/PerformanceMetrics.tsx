'use client';

import React from 'react';
import { Target, BarChart3, ArrowDownToLine, Zap } from 'lucide-react';

interface MetricProps {
    label: string;
    value: string;
    subValue: string;
    icon: React.ElementType;
    color: string;
}

function MetricCard({ label, value, subValue, icon: Icon, color }: MetricProps) {
    return (
        <div className="glass-panel p-3 flex items-center gap-3">
            <div className={`p-2 rounded-lg ${color} bg-opacity-20`}>
                <Icon className={color.replace('bg-', 'text-')} size={18} />
            </div>
            <div>
                <p className="text-[9px] text-gray-500 uppercase font-black tracking-[0.1em] mb-0.5">{label}</p>
                <div className="flex items-baseline gap-2">
                    <span className="text-sm font-black mono text-white leading-none" suppressHydrationWarning>{value}</span>
                    <span className={`text-[8px] mono px-1.5 py-0.5 rounded bg-white/5 border border-white/5 ${color.includes('green') ? 'text-[var(--green)]' : color.includes('red') ? 'text-[var(--red)]' : 'text-gray-400'}`} suppressHydrationWarning>{subValue}</span>
                </div>
            </div>
        </div>
    );
}

export default function PerformanceMetrics({ metrics }: { metrics: any }) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-5 xl:grid-cols-7 gap-4 w-full">
            <MetricCard
                label="Total Equity"
                value={`$${metrics.totalEquity?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}`}
                subValue="STABLE"
                icon={Zap}
                color="bg-[var(--purple)]"
            />
            <MetricCard
                label="Daily P&L"
                value={`${metrics.dailyPnl >= 0 ? '+' : ''}$${metrics.dailyPnl?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}`}
                subValue={`${((metrics.dailyPnl / (metrics.totalEquity || 1)) * 100)?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}%`}
                icon={BarChart3}
                color={metrics.dailyPnl >= 0 ? "bg-[var(--green)]" : "bg-[var(--red)]"}
            />
            <MetricCard
                label="Win Rate (24h)"
                value={`${metrics.winRate?.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) || '0.0'}%`}
                subValue="+2.1%"
                icon={Target}
                color="bg-[var(--cyan)]"
            />
            <MetricCard
                label="Sharpe Ratio"
                value={metrics.sharpeRatio?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                subValue="EXCEPTIONAL"
                icon={BarChart3}
                color="bg-[var(--purple)]"
            />
            <MetricCard
                label="Max Drawdown"
                value={`${metrics.maxDrawdown?.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) || '0.0'}%`}
                subValue="RECOVERED"
                icon={ArrowDownToLine}
                color="bg-[var(--red)]"
            />
            <MetricCard
                label="Trades Today"
                value={metrics.tradesToday?.toString() || '0'}
                subValue="VOLATILE"
                icon={Zap}
                color="bg-[var(--green)]"
            />
            <MetricCard
                label="Avg Hold Time"
                value="4h 22m"
                subValue="OPTIMAL"
                icon={Zap}
                color="bg-[var(--cyan)]"
            />
        </div>
    );
}
