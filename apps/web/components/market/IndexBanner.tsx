"use client";

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface IndexData {
    name: string;
    price: number;
    change: number;
    percent: number;
    is_up: boolean;
}

interface IndexBannerProps {
    indices: IndexData[];
}

const IndexBanner: React.FC<IndexBannerProps> = ({ indices }) => {
    return (
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {indices.map((index, idx) => (
                <div 
                    key={idx} 
                    className="flex-shrink-0 min-w-[180px] bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition-all cursor-pointer group"
                >
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors">{index.name}</span>
                        {index.is_up ? (
                            <TrendingUp size={14} className="text-emerald-500" />
                        ) : (
                            <TrendingDown size={14} className="text-rose-500" />
                        )}
                    </div>
                    <div className="space-y-1">
                        <div className="text-lg font-black text-white">₹{index.price.toLocaleString('en-IN')}</div>
                        <div className={`text-[10px] font-bold ${index.is_up ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {index.is_up ? '+' : ''}{index.change.toFixed(2)} ({index.percent.toFixed(2)}%)
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default IndexBanner;
