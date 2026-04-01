'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    LineChart,
    Cpu,
    History,
    Zap,
    Globe,
    ShoppingCart,
    Briefcase,
    Wallet,
    Shield,
    FileText,
    Unplug,
    Settings,
    Layers,
    MessageSquare,
    ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
    { icon: LineChart, label: 'Charts', href: '/charts', hasChild: true },
    { icon: Cpu, label: 'Strategy Builder', href: '/builder', hasChild: true },
    { icon: History, label: 'Backtester', href: '/backtests' },
    { icon: Zap, label: 'Paper Trading', href: '/paper', active: true },
    { icon: Globe, label: 'Live Trading', href: '/live', badge: 'v2' },
    { icon: ShoppingCart, label: 'Orders', href: '/orders', hasChild: true },
    { icon: Briefcase, label: 'Positions', href: '/positions' },
    { icon: Wallet, label: 'Portfolio', href: '/portfolio' },
    { icon: Shield, label: 'Risk Center', href: '/risk' },
    { icon: FileText, label: 'Logs', href: '/logs', hasChild: true },
    { icon: Unplug, label: 'Connectors', href: '/brokers', hasChild: true },
    { icon: Settings, label: 'Settings', href: '/settings' },
    { icon: Layers, label: 'Module Manager', href: '/modules' },
    { icon: MessageSquare, label: 'AI Assistant', href: '/ai' },
];

export default function QuantSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-brand-panel border-r border-brand-border h-screen flex flex-col z-50">
            {/* Logo */}
            <div className="p-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-accent flex items-center justify-center shadow-[0_0_15px_rgba(23,199,161,0.3)]">
                    <div className="w-4 h-4 border-2 border-brand-bg rounded-sm rotate-45" />
                </div>
                <h1 className="text-lg font-bold tracking-tight text-white">Quant Console</h1>
            </div>

            {/* Menu */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href || (item.active && pathname === '/');
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={cn(
                                "group flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200",
                                isActive
                                    ? "bg-brand-accent/10 text-brand-accent shadow-inner"
                                    : "text-brand-text-secondary hover:text-white hover:bg-white/5"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon
                                    size={18}
                                    className={cn(
                                        "transition-colors",
                                        isActive ? "text-brand-accent" : "group-hover:text-white"
                                    )}
                                />
                                <span className="text-sm font-medium">{item.label}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {item.badge && (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-brand-text-secondary uppercase font-bold tracking-tighter">
                                        {item.badge}
                                    </span>
                                )}
                                {item.hasChild && (
                                    <ChevronRight size={14} className="opacity-40" />
                                )}
                                {item.active && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse shadow-[0_0_8px_#17C7A1]" />
                                )}
                            </div>
                        </Link>
                    )
                })}
            </nav>

            {/* Bottom Info */}
            <div className="p-6 border-t border-brand-border bg-black/20">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400">
                        SP
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-white leading-none">SHIVAM PAJIYAR</span>
                        <span className="text-[10px] text-brand-text-muted mt-1 uppercase tracking-widest font-bold">Premium Tier</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
