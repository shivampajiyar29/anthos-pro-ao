"use client";

import React, { useState, useEffect } from 'react';
import { Search, Bell, Command, ChevronDown, User, Wallet, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useWebSocket } from '@/hooks/useWebSocket';

const Topbar = () => {
    const { isConnected } = useWebSocket();

    return (
        <header className="h-20 bg-white border-b border-slate-100 px-6 md:px-10 flex items-center justify-between sticky top-0 z-40 shadow-sm shadow-slate-200/20">
            <div className="flex items-center gap-12 flex-1">
                {/* Search Bar - Alacap Style (Dark input on light header) */}
                <div className="relative group w-full max-w-xl hidden md:block">
                    <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#17C7A1] transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search markets or assets..." 
                        className="bg-slate-900 border-none rounded-[16px] py-3.5 pl-16 pr-16 text-sm text-white placeholder:text-slate-500 focus:outline-none transition-all w-full font-medium"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-800 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-tighter flex items-center gap-1">
                        Ctrl+K
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-6">
                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2.5 px-6 py-2.5 bg-slate-900 text-white rounded-[14px] text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
                        <Plus size={16} className="text-[#17C7A1]" /> Deposit
                    </button>
                    <button className="flex items-center gap-2.5 px-6 py-2.5 bg-[#17C7A1] text-[#0F172A] rounded-[14px] text-[11px] font-black uppercase tracking-widest hover:bg-[#14ae8c] transition-all shadow-lg shadow-[#17C7A1]/20">
                         Invest
                    </button>
                </div>

                <div className="h-8 w-px bg-slate-100 mx-2" />

                {/* Icons & Profile */}
                <div className="flex items-center gap-4">
                    <button className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all relative">
                        <Bell size={20} />
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#F3C623] rounded-full border-2 border-white" />
                    </button>
                    
                    <button className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all">
                        <Wallet size={20} />
                    </button>

                    <button className="flex items-center gap-3 p-1 pr-3 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-slate-100 transition-all group">
                        <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-[11px] font-black text-white shadow-md">
                            <User size={18} />
                        </div>
                        <ChevronDown size={14} className="text-slate-400 group-hover:text-slate-900 transition-colors" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Topbar;
