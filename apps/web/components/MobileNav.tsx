'use client';

import React from 'react';
import { Home, Users, Shield, Settings, Activity, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';

interface MobileNavProps {
    activeView: string;
    setActiveView: (view: string) => void;
}

export default function MobileNav({ activeView, setActiveView }: MobileNavProps) {
    return (
        <div className="md:hidden fixed bottom-6 left-6 right-6 z-50">
            <div className="glass-panel p-2 flex items-center justify-around shadow-2xl border border-white/20">
                <NavButton
                    icon={Home}
                    active={activeView === 'dashboard'}
                    onClick={() => setActiveView('dashboard')}
                />
                <NavButton
                    icon={Users}
                    active={activeView === 'agents'}
                    onClick={() => setActiveView('agents')}
                />
                <div className="relative -top-6">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--cyan)] to-[var(--purple)] flex items-center justify-center shadow-[0_0_20px_rgba(0,255,255,0.4)] border-4 border-[#0a0a0a]">
                        <Activity size={24} className="text-white" />
                    </div>
                </div>
                <NavButton
                    icon={ShoppingCart}
                    active={activeView === 'trades'}
                    onClick={() => setActiveView('trades')}
                />
                <NavButton
                    icon={Settings}
                    active={activeView === 'settings'}
                    onClick={() => setActiveView('settings')}
                />
            </div>
        </div>
    );
}

function NavButton({ icon: Icon, active = false, onClick }: { icon: any; active?: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`p-3 rounded-xl transition-all relative ${active ? 'bg-white/10 text-[var(--cyan)]' : 'text-gray-500 hover:text-gray-400'}`}
        >
            <Icon size={20} />
            {active && (
                <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[var(--cyan)] rounded-full shadow-[0_0_5px_var(--cyan)]"
                />
            )}
        </button>
    );
}
