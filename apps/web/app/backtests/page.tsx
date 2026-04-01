"use client";

import React, { useEffect, useState } from 'react';
import { 
  Play, 
  History, 
  TrendingUp, 
  Calendar, 
  Zap, 
  AlertCircle,
  Search,
  Filter,
  ArrowUpRight,
  TrendingDown,
  Activity,
  BarChart4,
  FileText
} from 'lucide-react';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { DataTable } from '@/components/ui/DataTable';

interface BacktestResult {
  id: string | number;
  strategy_name: string;
  status: string;
  date: string;
  pnl: number;
  win_rate: number;
  sharpe: number;
  max_dd: number;
}

export default function BacktestsPage() {
    const [backtests, setBacktests] = useState<BacktestResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        const fetchBacktests = async () => {
            try {
                // Assuming /backtests returns a list of previous results
                const res = await api.get('/backtests');
                setBacktests(res.data);
            } catch (err) {
                console.error("Failed to fetch backtests", err);
                // Mock data
                setBacktests([
                    { id: 'BT-001', strategy_name: 'Nifty Short Straddle', status: 'COMPLETED', date: '2024-03-22 14:20', pnl: 42500, win_rate: 68, sharpe: 1.8, max_dd: 4.2 },
                    { id: 'BT-002', strategy_name: 'Iron Fly Adjustment', status: 'COMPLETED', date: '2024-03-21 09:15', pnl: -12800, win_rate: 42, sharpe: 0.9, max_dd: 5.5 },
                    { id: 'BT-003', strategy_name: 'Trend Follower v2', status: 'RUNNING', date: '2024-03-22 21:05', pnl: 0, win_rate: 0, sharpe: 0, max_dd: 0 },
                    { id: 'BT-004', strategy_name: 'Wipro Scalper', status: 'FAILED', date: '2024-03-20 16:45', pnl: 0, win_rate: 0, sharpe: 0, max_dd: 0 },
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchBacktests();
    }, []);

    const columns = [
        {
            header: 'Simulation ID',
            accessorKey: (row: BacktestResult) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-900 rounded-lg">
                        <BarChart4 size={14} className="text-blue-500" />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{row.id}</span>
                </div>
            )
        },
        {
            header: 'Strategy',
            accessorKey: (row: BacktestResult) => (
                <p className="text-sm font-black text-white italic tracking-tight uppercase">{row.strategy_name}</p>
            )
        },
        {
            header: 'PnL / Metrics',
            accessorKey: (row: BacktestResult) => (
                row.status === 'COMPLETED' ? (
                    <div className="flex items-center gap-4">
                        <span className={`text-xs font-black tabular-nums ${row.pnl >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                            ₹{row.pnl.toLocaleString()}
                        </span>
                        <div className="h-4 w-px bg-slate-800" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">WR: {row.win_rate}%</span>
                    </div>
                ) : <span className="text-slate-600">--</span>
            )
        },
        {
            header: 'Risk Profile',
            accessorKey: (row: BacktestResult) => (
                row.status === 'COMPLETED' ? (
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-bold text-slate-500">SHARPE: <span className="text-white">{row.sharpe}</span></span>
                        <span className="text-[10px] font-bold text-slate-500">MAX DD: <span className="text-rose-500">-{row.max_dd}%</span></span>
                    </div>
                ) : <span className="text-slate-600">--</span>
            )
        },
        {
            header: 'Status',
            accessorKey: (row: BacktestResult) => (
                <Badge 
                    variant={
                        row.status === 'COMPLETED' ? 'success' : 
                        row.status === 'RUNNING' ? 'primary' : 
                        row.status === 'FAILED' ? 'danger' : 'outline'
                    }
                    className={row.status === 'RUNNING' ? 'animate-pulse' : ''}
                >
                    {row.status}
                </Badge>
            )
        },
        {
            header: 'Completed At',
            accessorKey: (row: BacktestResult) => (
                <div className="flex items-center gap-2 text-slate-500">
                    <Calendar size={12} />
                    <span className="text-[10px] font-bold uppercase tracking-tight">{row.date}</span>
                </div>
            )
        },
        {
            header: 'Actions',
            accessorKey: (row: BacktestResult) => (
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-8 px-4 text-[9px]">
                        <FileText size={10} className="mr-2" /> Report
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
                            <History size={24} className="text-white" />
                        </div>
                        <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">Backtests</h1>
                    </div>
                    <p className="text-sm font-medium text-slate-500 max-w-md">
                        Review historical simulation data, compare strategy variants, and analyze deep risk metrics.
                    </p>
                </div>
                
                <Button 
                    variant="primary" 
                    size="lg" 
                    className="px-10 h-14 rounded-2xl shadow-blue-600/20"
                    disabled={isRunning}
                >
                    <Play size={20} className="mr-2 fill-current" /> 
                    {isRunning ? 'SIMULATING...' : 'NEW SIMULATION'}
                </Button>
            </div>

            {/* Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <MetricCard label="Total Runs" value="1,248" sub="Global History" icon={Activity} color="text-slate-400" />
                <MetricCard label="Avg Profit" value="₹12.4k" sub="Per Simulation" icon={TrendingUp} color="text-emerald-500" />
                <MetricCard label="Avg Drawdown" value="3.2%" sub="Historical Risk" icon={TrendingDown} color="text-rose-500" />
                <MetricCard label="Success Rate" value="64%" sub="Completion Ratio" icon={BadgeCheck} color="text-blue-500" />
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search simulation history..." 
                        className="w-full bg-slate-900/40 border border-slate-900 border-b-slate-800/50 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-blue-600/50 transition-all font-medium shadow-inner"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Button variant="outline" size="md" className="flex-1 md:flex-none">
                        <Filter size={16} className="mr-2" /> All Strategies
                    </Button>
                    <Button variant="outline" size="md" className="flex-1 md:flex-none">
                        Last 30 Days
                    </Button>
                </div>
            </div>

            {/* Simulations Table */}
            <DataTable data={backtests} columns={columns} isLoading={loading} />
        </div>
    );
}

const MetricCard = ({ label, value, sub, icon: Icon, color }: any) => (
    <Card className="p-8 space-y-4 hover:border-slate-800 transition-all relative overflow-hidden group">
        <div className="flex justify-between items-start">
            <p className="text-[10px] font-black text-slate-600 tracking-widest uppercase">{label}</p>
            <div className="p-2 bg-slate-950 rounded-lg border border-slate-900 group-hover:border-slate-800 transition-colors">
                <Icon size={14} className={color} />
            </div>
        </div>
        <div>
            <p className={`text-3xl font-black tabular-nums tracking-tighter ${color}`}>{value}</p>
            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-2">{sub}</p>
        </div>
        <div className="absolute -right-4 -bottom-4 w-12 h-12 bg-slate-900 rounded-full blur-[20px] opacity-20" />
    </Card>
);

const BadgeCheck = ({ size, className }: any) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
    </svg>
);
