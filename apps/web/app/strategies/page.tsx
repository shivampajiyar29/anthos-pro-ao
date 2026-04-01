"use client";

import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Search, 
  Play, 
  Edit3, 
  Trash2, 
  Layers, 
  Filter, 
  ArrowUpRight,
  MoreVertical,
  Activity,
  History,
  TrendingUp,
  LineChart
} from 'lucide-react';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { DataTable } from '@/components/ui/DataTable';

interface Strategy {
  id: string | number;
  name: string;
  type: string;
  status: string;
  last_backtest?: string;
  sharpe?: number;
  cagr?: number;
  max_dd?: number;
}

const StrategiesPage = () => {
    const [strategies, setStrategies] = useState<Strategy[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStrategies = async () => {
            try {
                const res = await api.get('/strategies');
                setStrategies(res.data);
            } catch (err) {
                console.error("Failed to fetch strategies", err);
                // Mock data for demo if API fails
                setStrategies([
                    { id: 1, name: 'Nifty Short Straddle', type: 'Intraday', status: 'ACTIVE', last_backtest: '2024-03-20', sharpe: 1.8, cagr: 24.5, max_dd: 4.2 },
                    { id: 2, name: 'Iron Fly Adjustment', type: 'Expiry', status: 'LIVE', last_backtest: '2024-03-18', sharpe: 1.4, cagr: 18.2, max_dd: 3.1 },
                    { id: 3, name: 'Trend Follower v2', type: 'Momentum', status: 'DRAFT', last_backtest: '2024-03-22', sharpe: 2.1, cagr: 32.0, max_dd: 6.5 },
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchStrategies();
    }, []);

    const columns = [
        {
            header: 'Strategy Name',
            accessorKey: (row: Strategy) => (
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:bg-blue-600/10 group-hover:border-blue-500/30 transition-all">
                        <Layers size={18} className="text-slate-500 group-hover:text-blue-500" />
                    </div>
                    <div>
                        <p className="text-sm font-black text-white italic tracking-tight">{row.name}</p>
                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-0.5">{row.type} Strategy</p>
                    </div>
                </div>
            )
        },
        {
            header: 'Performance',
            accessorKey: (row: Strategy) => (
                <div className="flex items-center gap-6">
                    <div>
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest leading-none">Sharpe</p>
                        <p className="text-xs font-black text-white mt-1 tabular-nums">{row.sharpe || '--'}</p>
                    </div>
                    <div className="h-6 w-px bg-slate-800" />
                    <div>
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest leading-none">CAGR</p>
                        <p className="text-xs font-black text-emerald-500 mt-1 tabular-nums">+{row.cagr || '--'}%</p>
                    </div>
                </div>
            )
        },
        {
            header: 'Risk (Max DD)',
            accessorKey: (row: Strategy) => (
                <span className="text-xs font-black text-rose-500 tabular-nums">-{row.max_dd || '--'}%</span>
            )
        },
        {
            header: 'Status',
            accessorKey: (row: Strategy) => (
                <Badge variant={row.status === 'ACTIVE' || row.status === 'LIVE' ? 'success' : 'outline'}>
                    {row.status}
                </Badge>
            )
        },
        {
            header: 'Last Tested',
            accessorKey: (row: Strategy) => (
                <div className="flex items-center gap-2 text-slate-500">
                    <History size={12} />
                    <span className="text-[10px] font-bold uppercase tracking-tight">{row.last_backtest || 'Never'}</span>
                </div>
            )
        },
        {
            header: 'Actions',
            accessorKey: (row: Strategy) => (
                <div className="flex gap-2">
                    <Button variant="primary" size="sm" className="h-8 px-4 text-[9px]">
                        <Play size={10} className="mr-2 fill-current" /> Run BT
                    </Button>
                    <Button variant="secondary" size="icon" className="h-8 w-8 !p-0">
                        <Edit3 size={14} className="text-slate-400" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 !p-0">
                        <MoreVertical size={14} />
                    </Button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-10">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-600 rounded-2xl shadow-xl shadow-blue-900/30">
                            <Layers size={24} className="text-white fill-current" />
                        </div>
                        <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">Strategies</h1>
                    </div>
                    <p className="text-sm font-medium text-slate-500 max-w-md">
                        Design institutional-grade quant logics, run multi-threaded backtests, and deploy to live markets.
                    </p>
                </div>
                
                <div className="flex gap-3">
                    <Button variant="outline" className="flex items-center gap-2">
                        <LineChart size={16} /> Portfolio View
                    </Button>
                    <Button variant="primary" size="lg" className="px-10 h-14 rounded-2xl shadow-blue-600/20">
                        <Plus size={20} className="mr-2" /> Create Strategy
                    </Button>
                </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatMini label="Total Live" value="12" icon={Activity} color="text-emerald-500" />
                <StatMini label="Avg Sharpe" value="1.84" icon={TrendingUp} color="text-blue-500" />
                <StatMini label="Backtests Run" value="1,042" icon={History} color="text-slate-500" />
                <StatMini label="Failures" value="02" icon={ShieldAlert} color="text-rose-500" />
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="Filter by name, type, or asset..." 
                        className="w-full bg-slate-900/40 border border-slate-900 border-b-slate-800/50 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-blue-600/50 transition-all font-medium shadow-inner"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Button variant="outline" size="md" className="flex-1 md:flex-none">
                        <Filter size={16} className="mr-2" /> Type
                    </Button>
                    <Button variant="outline" size="md" className="flex-1 md:flex-none">
                        All Status
                    </Button>
                </div>
            </div>

            {/* Strategies Table */}
            <DataTable data={strategies} columns={columns} isLoading={loading} />
        </div>
    );
};

const StatMini = ({ label, value, icon: Icon, color }: any) => (
    <Card className="p-4 flex items-center justify-between border-slate-900/30">
        <div className="space-y-1">
            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest leading-none">{label}</p>
            <p className="text-xl font-black text-white italic tabular-nums leading-none mt-2">{value}</p>
        </div>
        <div className={`p-2 bg-slate-950 rounded-xl ${color} bg-opacity-10 border border-slate-900`}>
            <Icon size={16} />
        </div>
    </Card>
);

const ShieldAlert = ({ size, className }: any) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        <path d="M12 8v4" />
        <path d="M12 16h.01" />
    </svg>
);

export default StrategiesPage;
