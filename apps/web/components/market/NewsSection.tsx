"use client";

import React from 'react';
import { Newspaper, ChevronRight } from 'lucide-react';

interface NewsItem {
    id: number;
    title: string;
    source: string;
    time: string;
    image_url: string;
    stocks: { symbol: string, name: string }[];
}

interface NewsSectionProps {
    news: NewsItem[];
}

const NewsSection: React.FC<NewsSectionProps> = ({ news }) => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                        <Newspaper size={18} />
                    </div>
                    Stocks In News
                </h3>
                <button className="text-[10px] font-black text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-widest">Explore All News</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {news.map((item) => (
                    <div 
                        key={item.id} 
                        className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl hover:border-slate-700 transition-all cursor-pointer group flex gap-6"
                    >
                        <div className="flex-1 space-y-3">
                            <div className="flex justify-between items-start">
                                <p className="text-sm font-bold text-white line-clamp-2 leading-snug group-hover:text-blue-400 transition-colors">
                                    {item.title}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.source}</span>
                                <span className="w-1 h-1 bg-slate-700 rounded-full" />
                                <span className="text-[10px] font-bold text-slate-600">{item.time}</span>
                            </div>
                            <div className="flex gap-2 pt-2">
                                {item.stocks.map((stock) => (
                                    <span key={stock.symbol} className="px-2 py-1 bg-slate-800 rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-widest border border-slate-700/50">
                                        ${stock.symbol}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="w-24 h-24 flex-shrink-0 bg-slate-800 rounded-2xl overflow-hidden relative group-hover:scale-105 transition-transform">
                            <img src={item.image_url} alt="news" className="w-full h-full object-cover opacity-60" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NewsSection;
