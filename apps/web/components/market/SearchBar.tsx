"use client";

import React from 'react';
import { Search, Command } from 'lucide-react';

const SearchBar = () => {
    return (
        <div className="relative w-full max-w-2xl mx-auto group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors">
                <Search size={20} />
            </div>
            <input 
                type="text" 
                placeholder="Search stocks, indices, mutual funds..." 
                className="w-full bg-slate-900/50 backdrop-blur-xl border border-slate-800 focus:border-blue-500/50 rounded-full py-5 pl-16 pr-24 text-white focus:outline-none transition-all font-medium text-lg placeholder:text-slate-600 shadow-2xl shadow-blue-900/10"
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-xl border border-slate-700">
                <Command size={14} className="text-slate-400" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">K</span>
            </div>
        </div>
    );
};

export default SearchBar;
