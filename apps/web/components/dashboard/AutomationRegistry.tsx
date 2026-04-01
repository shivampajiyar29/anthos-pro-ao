"use client";

import React, { useEffect, useState } from 'react';
import { 
  Zap, 
  Activity, 
  ShieldCheck, 
  Clock, 
  ChevronRight,
  Terminal,
  Cpu
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import api from '@/lib/api';

const AutomationRegistry = () => {
    const [status, setStatus] = useState<any>(null);
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statusRes, logsRes] = await Promise.all([
                    api.get('/maheshwara/status'),
                    api.get('/maheshwara/logs')
                ]);
                setStatus(statusRes.data);
                setLogs(logsRes.data);
            } catch (err) {
                console.error("Failed to fetch Maheshwara data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    if (loading && !status) return <div className="animate-pulse h-64 bg-slate-900/20 rounded-[32px]" />;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* System Status Card */}
                <Card variant={status?.is_active ? 'light' : 'outline'} className="p-6 relative overflow-hidden group">
                    {status?.is_active && (
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#F3C623]/5 rounded-full -mr-10 -mt-10 blur-2xl p-4" />
                    )}
                    <div className="flex items-center gap-4 relative z-10">
                        <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors shadow-lg",
                            status?.is_active ? "bg-[#F3C623] shadow-[#F3C623]/20" : "bg-slate-800"
                        )}>
                            <Cpu size={24} className={status?.is_active ? "text-[#0F172A]" : "text-slate-500"} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Control Unit</p>
                            <h4 className="text-lg font-black text-[#0F172A] mt-2 italic">
                                {status?.is_active ? "MAHESHWARA ONLINE" : "MANUAL MODE"}
                            </h4>
                        </div>
                    </div>
                </Card>

                {/* Active Bots Card */}
                <Card className="p-6 bg-[#0F172A] border-slate-800">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#17C7A1]/10 flex items-center justify-center">
                            <Zap size={24} className="text-[#17C7A1]" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Active Bots</p>
                            <h4 className="text-2xl font-black text-white mt-2 tabular-nums">{status?.active_bots || 0}</h4>
                        </div>
                    </div>
                </Card>

                {/* System Health Card */}
                <Card className="p-6 bg-[#0F172A] border-slate-800">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                            <ShieldCheck size={24} className="text-blue-500" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">System Health</p>
                            <h4 className="text-lg font-black text-white mt-2 italic uppercase">{status?.health || "OPTIMAL"}</h4>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Live Log Stream */}
            <Card className="bg-[#0F172A] border-slate-800 rounded-[32px] overflow-hidden">
                <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Terminal size={18} className="text-slate-500" />
                        <h4 className="text-xs font-black text-white uppercase tracking-widest">Autonomous Decision Stream</h4>
                    </div>
                    <Badge variant="outline" className="text-[9px] font-black text-slate-500 border-slate-800">REAL-TIME</Badge>
                </div>
                <div className="p-4 max-h-64 overflow-y-auto font-mono scrollbar-hide">
                    {logs.map((log, i) => (
                        <div key={i} className="flex gap-4 py-2 text-[11px] group">
                            <span className="text-slate-600 font-bold shrink-0">{log.time}</span>
                            <span className="text-slate-400 group-hover:text-emerald-400 transition-colors">{log.msg}</span>
                        </div>
                    ))}
                    {status?.is_active && (
                        <div className="flex gap-4 py-2 text-[11px] animate-pulse">
                            <span className="text-slate-600 font-bold shrink-0">--:--:--</span>
                            <span className="text-[#F3C623] font-black">MAHESHWARA IS MONITORING MARKETS...</span>
                        </div>
                    )}
                </div>
            </Card>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MiniMetric label="Orders/Min" value="14.2" icon={Activity} />
                <MiniMetric label="Latency" value="24ms" icon={Clock} />
                <MiniMetric label="Success Rate" value="99.8%" icon={ShieldCheck} />
                <MiniMetric label="Total Uptime" value={`${Math.floor((status?.uptime || 0) / 60)}m`} icon={Activity} />
            </div>
        </div>
    );
};

const MiniMetric = ({ label, value, icon: Icon }: any) => (
    <Card className="p-4 bg-slate-900/20 border-slate-900 flex items-center justify-between group cursor-pointer hover:border-slate-800 transition-all">
        <div className="space-y-1">
            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{label}</p>
            <p className="text-sm font-black text-white tabular-nums">{value}</p>
        </div>
        <Icon size={14} className="text-slate-700 group-hover:text-slate-400 transition-colors" />
    </Card>
);

export default AutomationRegistry;
