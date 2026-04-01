"use client";

import React, { useEffect, useState } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  ShieldAlert, 
  Terminal, 
  Clock, 
  User, 
  Cpu, 
  ShieldCheck,
  AlertTriangle,
  Info,
  ChevronRight,
  Download,
  RefreshCw,
  Zap,
  LayoutGrid
} from 'lucide-react';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { DataTable } from '@/components/ui/DataTable';
import { StatMini } from '@/components/ui/StatMini';
import { useWebSocket } from '@/hooks/useWebSocket';

interface AuditLog {
  id: string | number;
  timestamp: string;
  level: string;
  component: string;
  message: string;
  user_id?: string;
  ip?: string;
}

export default function AuditLogsPage() {
    const { isConnected } = useWebSocket();
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await api.get('/audit-logs');
                setLogs(res.data.logs || []);
            } catch (err) {
                console.error("Failed to fetch audit logs", err);
                // Mock data for Alacap
                setLogs([
                  { id: 1, timestamp: '2024-03-22 21:12:04', level: 'INFO', component: 'SYSTEM', message: 'Alacap Sentry check passed. All nodes optimal.', user_id: 'SYSTEM', ip: '127.0.0.1' },
                  { id: 2, timestamp: '2024-03-22 21:14:22', level: 'SUCCESS', component: 'TRADE', message: 'BUY BTC/USDT @ 65,320.10 (Qty: 0.05) filled successfully.', user_id: 'AD_MASTER', ip: '192.168.1.4' },
                  { id: 3, timestamp: '2024-03-22 21:18:45', level: 'WARN', component: 'NETWORK', message: 'Latency spike detected on Polygon RPC (+140ms)', user_id: 'SYSTEM', ip: '127.0.0.1' },
                  { id: 4, timestamp: '2024-03-22 21:20:00', level: 'ERROR', component: 'AUTH', message: 'Failed login attempt from unauthorized node: 185.22.41.9', user_id: 'UNKNOWN', ip: '185.22.41.9' },
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    const columns = [
        {
            header: 'Timestamp',
            accessorKey: (row: AuditLog) => (
                <div className="flex items-center gap-2 text-slate-400">
                    <Clock size={12} />
                    <span className="text-[10px] font-bold uppercase tracking-tight tabular-nums">{row.timestamp}</span>
                </div>
            )
        },
        {
            header: 'Level',
            accessorKey: (row: AuditLog) => (
                <Badge 
                    variant={
                        row.level === 'ERROR' ? 'danger' : 
                        row.level === 'WARN' ? 'warning' : 
                        row.level === 'SUCCESS' ? 'success' : 'outline'
                    }
                    className="rounded-lg text-[9px] px-2.5 py-0.5 border-slate-100"
                >
                    {row.level}
                </Badge>
            )
        },
        {
            header: 'Component',
            accessorKey: (row: AuditLog) => (
                <div className="flex items-center gap-2">
                    <div className="p-1 px-2 bg-slate-50 border border-slate-100 rounded-lg">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">{row.component}</span>
                    </div>
                </div>
            )
        },
        {
            header: 'Live Activity Message',
            accessorKey: (row: AuditLog) => (
                <p className="text-xs font-black text-slate-700 max-w-lg truncate uppercase tracking-tight">
                    {row.message}
                </p>
            )
        },
        {
            header: 'Origin',
            accessorKey: (row: AuditLog) => (
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-[#17C7A1] uppercase tracking-widest">{row.user_id || 'SYSTEM'}</span>
                    <span className="text-[9px] font-medium text-slate-400 tabular-nums">{row.ip || '0.0.0.0'}</span>
                </div>
            )
        },
        {
            header: '',
            accessorKey: (row: AuditLog) => (
                <Button variant="ghost" size="icon" className="h-8 w-8 !p-0 text-slate-300 hover:text-[#17C7A1]">
                    <ChevronRight size={14} />
                </Button>
            )
        }
    ];

    return (
        <div className="space-y-10 min-h-screen bg-[#F5F8FB] p-6 md:p-10">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-3">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-[#0F172A] rounded-[20px] shadow-xl flex items-center justify-center">
                            <History size={28} className="text-[#17C7A1]" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-[#0F172A] italic tracking-tighter uppercase leading-none">Audit Logs</h1>
                            <p className="text-[10px] font-bold text-[#17C7A1] uppercase tracking-[0.3em] mt-1.5 ml-0.5">Terminal Registry • v1.0.4</p>
                        </div>
                    </div>
                </div>
                
                <div className="flex gap-4">
                    <Button variant="outline" className="h-14 px-8 border-slate-200 text-slate-600 rounded-2xl font-black uppercase tracking-widest hover:bg-white shadow-sm">
                        <Download size={18} className="mr-3" /> Export
                    </Button>
                    <Button variant="mint" className="h-14 px-8 rounded-2xl shadow-xl shadow-[#17C7A1]/20">
                        <RefreshCw size={18} className="mr-3" /> Refresh
                    </Button>
                </div>
            </div>

            {/* Quick Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card variant="light" className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-[#17C7A1]">
                        <ShieldCheck size={24} />
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Security Sentry</p>
                        <p className="text-xl font-black text-slate-900 mt-1 uppercase italic">{isConnected ? "Active" : "Offline"}</p>
                    </div>
                </Card>
                <Card variant="light" className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-[#F06449]">
                        <ShieldAlert size={24} />
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Triggered Alerts</p>
                        <p className="text-xl font-black text-slate-900 mt-1 uppercase italic">02</p>
                    </div>
                </Card>
                <Card variant="light" className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-blue-500">
                        <Cpu size={24} />
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Node Pulse</p>
                        <p className="text-xl font-black text-slate-900 mt-1 uppercase italic">99.9%</p>
                    </div>
                </Card>
                <Card variant="light" className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-[#F3C623]">
                        <Zap size={24} />
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Net Latency</p>
                        <p className="text-xl font-black text-slate-900 mt-1 uppercase italic text-amber-500">24ms</p>
                    </div>
                </Card>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="relative flex-1 group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#17C7A1] transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search logs by message, originator, or IP node..." 
                        className="w-full bg-[#0F172A] border-none rounded-[20px] py-4 pl-16 pr-6 text-sm text-white focus:outline-none transition-all font-medium shadow-xl shadow-slate-900/10"
                    />
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <Button variant="outline" className="h-14 px-6 border-slate-200 text-slate-600 rounded-2xl font-black uppercase tracking-widest hover:bg-white shadow-sm">
                        <Filter size={18} className="mr-2" /> Filters
                    </Button>
                    <Button variant="navy" className="h-14 px-8 rounded-2xl">
                        Search Node
                    </Button>
                </div>
            </div>

            {/* Logs Table */}
            <Card variant="light" className="p-0 overflow-hidden rounded-[32px] border-none shadow-xl shadow-slate-200/40">
                <DataTable 
                    data={logs} 
                    columns={columns} 
                    isLoading={loading} 
                    theme="light"
                    className="border-none"
                    headerClassName="bg-slate-50/50 border-b border-slate-100 text-slate-400 uppercase tracking-[0.2em] text-[10px] font-black h-16 px-10"
                    rowClassName="border-b border-slate-50 hover:bg-slate-50/30 transition-all h-20 px-10"
                />
            </Card>
        </div>
    );
}
