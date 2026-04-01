"use client";

import React from 'react';
import { TrendingUp, TrendingDown, Zap, BarChart2 } from 'lucide-react';
import Sparkline from './Sparkline';

interface Stock {
    symbol: string;
    name: string;
    price: number;
    change: number;
    percent: number;
    is_up: boolean;
    sparkline?: number[];
}

interface StockGridProps {
    stocks: Stock[];
    title: string;
    onStockClick?: (stock: Stock) => void;
}

const StockGrid: React.FC<StockGridProps> = ({ stocks, title, onStockClick }) => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-black text-white uppercase tracking-tight">{title}</h3>
                <button className="text-[10px] font-black text-blue-500 hover:text-blue-400 transition-colors uppercase tracking-widest">View Heatmap</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stocks.map((stock) => (
                    <div 
                        key={stock.symbol} 
                        onClick={() => onStockClick?.(stock)}
                        className="bg-slate-900/40 border border-slate-900 p-5 rounded-3xl hover:border-blue-500/50 transition-all cursor-pointer group relative overflow-hidden"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${
                                    stock.is_up ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                                }`}>
                                    {stock.symbol.charAt(0)}
                                </div>
                                <div className="min-w-0">
                                    <h4 className="font-black text-sm text-white truncate group-hover:text-blue-400 transition-colors leading-tight uppercase tracking-tight">{stock.name}</h4>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stock.symbol}</p>
                                </div>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 bg-blue-600 rounded-lg text-white shadow-lg shadow-blue-900/40">
                                    <Zap size={14} className="fill-current" />
                                </button>
                            </div>
                        </div>

                        <div className="flex items-end justify-between">
                            <div className="space-y-1">
                                <p className="text-lg font-black text-white tracking-tighter">₹{stock.price.toLocaleString('en-IN')}</p>
                                <p className={`text-[10px] font-black ${stock.is_up ? 'text-emerald-500' : 'text-rose-500'} uppercase tracking-widest`}>
                                    {stock.is_up ? '▲' : '▼'} {stock.percent.toFixed(2)}%
                                </p>
                            </div>
                            <div className="w-20">
                                <Sparkline 
                                    data={stock.sparkline || [40, 45, 42, 48, 46, 52, 50]} 
                                    isUp={stock.is_up} 
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StockGrid;
