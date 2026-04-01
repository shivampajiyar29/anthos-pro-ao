"use client";

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight, 
  Zap,
  ArrowRight,
  Plus 
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Update IndexStrip to match Alacap dark/glass style
export const IndexStrip = ({ indices }: { indices: any[] }) => {
    return (
        <div className="flex gap-10 overflow-x-auto no-scrollbar py-5 px-8 bg-[#0F172A] border-b border-slate-800 text-white sticky top-20 z-30">
            {indices.map((idx) => (
                <div key={idx.name} className="flex items-center gap-4 shrink-0 group cursor-pointer hover:bg-white/5 px-4 py-2 rounded-2xl transition-all">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-[#17C7A1] transition-colors">
                        {idx.name}
                    </span>
                    <span className="text-xs font-black tabular-nums tracking-tight">
                        {idx.price.toLocaleString()}
                    </span>
                    <div className={cn(
                        "flex items-center gap-1 text-[10px] font-black tabular-nums",
                        idx.is_up ? 'text-[#17C7A1]' : 'text-[#F06449]'
                    )}>
                        {idx.is_up ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                        {idx.percent}%
                    </div>
                </div>
            ))}
        </div>
    );
};

// Stock Card (Light Theme)
export const StockCard = ({ symbol, name, price, percent, is_up, logo }: any) => (
    <Card className="p-6 bg-white border-slate-100 hover:border-[#17C7A1]/30 hover:shadow-xl hover:shadow-[#17C7A1]/5 transition-all cursor-pointer group rounded-[24px]">
        <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-slate-400 group-hover:bg-[#17C7A1]/10 group-hover:text-[#17C7A1] transition-all">
                {logo || symbol.charAt(0)}
            </div>
            <div className="text-right">
                <p className="text-sm font-black text-slate-900 tracking-tighter">₹{price.toLocaleString()}</p>
                <p className={cn(
                    "text-[10px] font-black tabular-nums mt-0.5",
                    is_up ? 'text-[#17C7A1]' : 'text-[#F06449]'
                )}>
                    {is_up ? '+' : ''}{percent}%
                </p>
            </div>
        </div>
        <div>
            <p className="text-xs font-black text-slate-900 uppercase tracking-tight truncate">{symbol}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 truncate">{name}</p>
        </div>
    </Card>
);

// Crypto Card (Dark Theme)
export const CryptoCard = ({ symbol, price, percent, is_up, icon }: any) => (
    <Card className="p-6 bg-[#0F172A] border-slate-800 hover:border-[#F3C623]/30 transition-all cursor-pointer group rounded-[24px]">
        <div className="flex justify-between items-center gap-4">
            <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-[#1d273d] flex items-center justify-center text-[#F3C623] shadow-inner">
                    {icon || <Zap size={20} className="fill-current" />}
                </div>
                <div>
                    <p className="text-sm font-black text-white uppercase tracking-tight">{symbol}</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">${price.toLocaleString()}</p>
                </div>
            </div>
            <div className="text-right">
                <p className={cn(
                    "text-[10px] font-black tabular-nums flex items-center gap-1 justify-end",
                    is_up ? 'text-[#17C7A1]' : 'text-[#F06449]'
                )}>
                    {is_up ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                    {percent}%
                </p>
            </div>
        </div>
    </Card>
);

// Ganners/Movers Table Section (Light & Dark hybrid)
export const MarketTable = ({ title, items, theme = "light" }: any) => (
    <div className="space-y-6">
        <div className="flex justify-between items-center px-2">
            <h3 className={cn(
                "text-lg font-black uppercase tracking-tighter",
                theme === "light" ? "text-slate-900" : "text-white"
            )}>{title}</h3>
            <button className="text-[10px] font-black text-slate-500 hover:text-[#17C7A1] uppercase tracking-widest">See all</button>
        </div>
        <Card className={cn(
            "p-5 rounded-[24px] space-y-2 border-none",
            theme === "light" ? "bg-white shadow-sm" : "bg-[#0F172A]"
        )}>
            {items.map((item: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all cursor-pointer group">
                    <div className="flex items-center gap-4">
                        <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-black",
                            theme === "light" ? "bg-slate-100 text-slate-400" : "bg-slate-800 text-slate-500"
                        )}>
                            {item.symbol.charAt(0)}
                        </div>
                        <div>
                            <p className={cn("text-xs font-black uppercase tracking-tight", theme === "light" ? "text-slate-900" : "text-white")}>{item.symbol}</p>
                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">₹{item.price}</p>
                        </div>
                    </div>
                    <p className={cn(
                        "text-[11px] font-black tabular-nums flex items-center gap-1.5",
                        item.percent >= 0 ? 'text-[#17C7A1]' : 'text-[#F06449]'
                    )}>
                        {item.percent >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                        {Math.abs(item.percent)}%
                    </p>
                </div>
            ))}
        </Card>
    </div>
);

// NewsCard (Light Theme)
export const NewsCard = ({ title, source, time, symbol }: any) => (
    <div className="flex items-start gap-4 group cursor-pointer p-5 bg-white rounded-[24px] border border-slate-100 hover:border-[#17C7A1]/20 transition-all shadow-sm">
        <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[9px] border-slate-100 text-slate-500">{source}</Badge>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{time}</span>
            </div>
            <h4 className="text-sm font-bold text-slate-800 group-hover:text-[#17C7A1] transition-colors leading-snug tracking-tight">
                {title}
            </h4>
        </div>
    </div>
);

// Sentiment (Alacap Style - Dark)
export const SentimentCard = ({ score }: { score: number }) => (
    <Card className="p-8 bg-[#0F172A] border-slate-800 rounded-[32px] space-y-8">
        <div className="flex justify-between items-center">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Market Sentiment</h4>
            <div className="px-2.5 py-1 bg-[#17C7A1]/10 rounded-lg text-[#17C7A1] text-[9px] font-black uppercase tracking-widest">Bullish Activity</div>
        </div>

        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <span className="text-sm font-black text-white italic tracking-tighter">{score}% BULLS</span>
                <span className="text-sm font-black text-slate-600 italic tracking-tighter">{100 - score}% BEARS</span>
            </div>
            <div className="relative h-2.5 bg-slate-800/50 rounded-full overflow-hidden flex ring-4 ring-slate-900/50">
                <div 
                    className="h-full bg-[#17C7A1] shadow-[0_0_20px_rgba(23,199,161,0.5)] transition-all duration-1000" 
                    style={{ width: `${score}%` }} 
                />
                <div className="h-full bg-[#F06449]/40" style={{ width: `${100 - score}%` }} />
            </div>
        </div>

    </Card>
);

// ToolCard (Light Variant)
export const ToolCard = ({ title, icon: Icon, color }: any) => (
    <Card variant="light" className="p-5 flex items-center gap-4 hover:border-[#17C7A1]/40 transition-all cursor-pointer group rounded-[24px]">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-all", color)}>
            <Icon size={18} className="group-hover:scale-110 transition-transform" />
        </div>
        <div>
            <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-tight">{title}</h4>
            <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Explore Tool</span>
                <ArrowRight size={10} className="text-[#17C7A1] group-hover:translate-x-1 transition-transform" />
            </div>
        </div>
    </Card>
);

// ActivityItem (Dark Variant)
export const ActivityItem = ({ title, amount, time, type }: any) => (
    <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-all cursor-pointer group">
        <div className="flex items-center gap-4">
            <div className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center",
                type === 'BUY' ? 'bg-[#17C7A1]/10 text-[#17C7A1]' : 'bg-[#F06449]/10 text-[#F06449]'
            )}>
                {type === 'BUY' ? <Plus size={16} /> : <Zap size={16} />}
            </div>
            <div>
                <p className="text-xs font-black text-white uppercase tracking-tight">{title}</p>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5 opacity-60">{time}</p>
            </div>
        </div>
        <div className="text-right">
            <p className={cn("text-xs font-black tabular-nums", type === 'BUY' ? 'text-white' : 'text-[#F06449]')}>
                {type === 'BUY' ? '+' : '-'}{amount}
            </p>
            <p className="text-[8px] font-black text-slate-700 uppercase tracking-widest mt-0.5">Completed</p>
        </div>
    </div>
);
