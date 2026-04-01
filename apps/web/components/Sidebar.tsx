'use client';

import React from 'react';
import { LayoutDashboard, Users, Shield, Settings, ChevronLeft, ChevronRight, LogOut, TrendingUp, ShoppingCart, Cpu, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useDashboard } from '@/lib/DashboardContext';

interface SidebarProps {
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
    activeView: string;
    setActiveView: (view: string) => void;
}

export default function Sidebar({ collapsed, setCollapsed }: { collapsed: boolean; setCollapsed: (v: boolean) => void }) {
    const { activeView, setActiveView } = useDashboard();

    const menuItems = [
        { id: 'ALGO', icon: Cpu, label: 'Algo Dashboard', path: '/' },
        { id: 'MANUAL', icon: Terminal, label: 'Manual Dashboard', path: '/' },
        { id: 'agents', icon: Users, label: 'Agents', path: '/agents' },
        { id: 'risk', icon: Shield, label: 'Risk Control', path: '/risk' },
        { id: 'trades', icon: ShoppingCart, label: 'Trades', path: '/trades' },
        { id: 'settings', icon: Settings, label: 'Settings', path: '/settings' },
    ];

    return (
        <aside className={`${collapsed ? 'w-20' : 'w-64'} h-[calc(100vh-4rem)] transition-all duration-300 flex flex-col bg-[var(--background)] relative z-20`}>
            <div className="p-6 flex items-center justify-between">
                {!collapsed && <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Fleet Control</span>}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-white transition-all"
                >
                    {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {menuItems.map((item) => (
                    <Link
                        key={item.id}
                        href={item.path}
                        onClick={() => {
                            if (item.id === 'ALGO' || item.id === 'MANUAL') {
                                setActiveView(item.id);
                            }
                        }}
                        className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all group relative ${activeView === item.id ? 'bg-gradient-to-r from-[var(--purple)] to-[var(--purple)]/50 text-white shadow-[0_0_20px_rgba(170,0,255,0.2)]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                        <item.icon size={20} className={activeView === item.id ? 'text-white' : 'group-hover:text-[var(--cyan)] transition-colors'} />
                        {!collapsed && <span className="text-sm font-bold tracking-tight">{item.label}</span>}

                        {activeView === item.id && (
                            <motion.div
                                layoutId="sidebarActive"
                                className="absolute left-0 w-1 h-6 bg-white rounded-r-full shadow-[0_0_10px_white]"
                            />
                        )}
                    </Link>
                ))}
            </nav>

            <div className="p-4 mt-auto">
                <div className={`p-4 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-white/5 ${collapsed ? 'items-center px-2' : ''}`}>
                    {!collapsed && (
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-[var(--cyan)]/20 flex items-center justify-center border border-[var(--cyan)]/30">
                                <TrendingUp size={18} className="text-[var(--cyan)]" />
                            </div>
                            <div>
                                <h6 className="text-[10px] font-black text-white uppercase">Pro Account</h6>
                                <p className="text-[8px] text-[var(--green)] font-bold">ALPHA ACCESS</p>
                            </div>
                        </div>
                    )}
                    <button className={`w-full flex items-center gap-3 px-3 py-2 text-gray-500 hover:text-[var(--red)] transition-all ${collapsed ? 'justify-center p-0' : ''}`}>
                        <LogOut size={18} />
                        {!collapsed && <span className="text-xs font-bold uppercase tracking-wider">Disconnect</span>}
                    </button>
                </div>
            </div>
        </aside>
    );
}
