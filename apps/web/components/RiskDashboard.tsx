'use client';

import React from 'react';
import { motion } from 'framer-motion';
import GreeksMonitor from './GreeksMonitor';

export default function RiskDashboard() {
    const alerts = [
        { id: 1, type: 'CRITICAL', title: 'Margin Threshold Breached', message: 'Margin usage reached 82% on NIFTY Straddle.', time: '2 mins ago' },
        { id: 2, type: 'WARNING', title: 'Negative Theta Acceleration', message: 'Portfolio decay exceeding daily recovery targets.', time: '15 mins ago' }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-black uppercase tracking-tighter text-white">Portfolio Risk Sentry</h2>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Neural monitoring of exposure and Greeks</p>
                </div>
                <div className="flex gap-4">
                    <div className="glass-panel px-4 py-2 border-green-500/20">
                        <span className="text-[8px] block font-black text-gray-500 uppercase">System Status</span>
                        <span className="text-[10px] font-black text-green-500 uppercase">Nominal / Secure</span>
                    </div>
                </div>
            </div>

            <GreeksMonitor />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass-panel p-6 bg-[var(--purple)]/5 border-[var(--purple)]/20">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--purple)] mb-6">Active Risk Rules</h3>
                        <div className="space-y-4">
                            {[
                                { rule: "Max Daily Loss", limit: "₹ 50,000", current: "₹ 12,400", status: "SAFE" },
                                { rule: "Max Margin Usage", limit: "80%", current: "62%", status: "WARNING" },
                                { rule: "Max Notional Exposure", limit: "₹ 5.0 Cr", current: "₹ 1.2 Cr", status: "SAFE" }
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0">
                                    <div>
                                        <p className="text-sm font-bold text-white">{item.rule}</p>
                                        <p className="text-[10px] text-gray-500 font-bold">Limit: {item.limit}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-black mono text-white">{item.current}</p>
                                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${item.status === 'SAFE' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                            {item.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="glass-panel p-6 border-red-500/20">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500 mb-6">Neural Alerts</h3>
                        <div className="space-y-4">
                            {alerts.map(alert => (
                                <motion.div 
                                    key={alert.id}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="p-3 bg-red-500/5 border border-red-500/20 rounded-lg"
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[8px] font-black text-red-500 uppercase">{alert.type}</span>
                                        <span className="text-[8px] font-bold text-gray-500">{alert.time}</span>
                                    </div>
                                    <p className="text-xs font-bold text-white mb-1">{alert.title}</p>
                                    <p className="text-[10px] text-gray-400 font-medium">{alert.message}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
