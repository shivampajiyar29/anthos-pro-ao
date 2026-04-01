'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function AuditLogViewer() {
    const logs = [
        { id: '10293', user: 'admin@athos.pro', action: 'STRATEGY_CREATE', entity: 'STRAT_99', ip: '192.168.1.45', time: '2026-03-21 12:05:12' },
        { id: '10292', user: 'admin@athos.pro', action: 'RISK_UPDATE', entity: 'MAX_LOSS', ip: '192.168.1.45', time: '2026-03-21 12:04:55' },
        { id: '10291', user: 'admin@athos.pro', action: 'ORDER_EXECUTE', entity: 'NIFTY_CE', ip: 'SYSTEM', time: '2026-03-21 12:02:30' }
    ];

    return (
        <div className="glass-panel overflow-hidden border-white/5 bg-white/5">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--purple)]">System Audit Trail</h3>
                <span className="text-[8px] font-bold text-gray-500 uppercase">Immutable Record ID: ATHOS-LOG-V1</span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-white/5">
                            <th className="px-6 py-3 text-[8px] font-black text-gray-500 uppercase">TXID</th>
                            <th className="px-6 py-3 text-[8px] font-black text-gray-500 uppercase">Action</th>
                            <th className="px-6 py-3 text-[8px] font-black text-gray-500 uppercase">Entity</th>
                            <th className="px-6 py-3 text-[8px] font-black text-gray-500 uppercase">IP Address</th>
                            <th className="px-6 py-3 text-[8px] font-black text-gray-500 uppercase">Timestamp</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {logs.map((log) => (
                            <motion.tr 
                                key={log.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="hover:bg-white/5 transition-colors cursor-default"
                            >
                                <td className="px-6 py-4 text-[10px] font-bold text-[var(--purple)] mono">{log.id}</td>
                                <td className="px-6 py-4">
                                    <span className="text-[10px] font-black text-white">{log.action}</span>
                                </td>
                                <td className="px-6 py-4 text-[10px] text-gray-400 font-medium">{log.entity}</td>
                                <td className="px-6 py-4 text-[10px] text-gray-500 mono">{log.ip}</td>
                                <td className="px-6 py-4 text-[10px] text-gray-500 mono">{log.time}</td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
