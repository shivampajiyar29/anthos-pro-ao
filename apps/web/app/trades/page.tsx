'use client';

import React from 'react';
import LiveTradeFeed from '@/components/LiveTradeFeed';
import AuditTrail from '@/components/AuditTrail';
import { useDashboard } from '@/lib/DashboardContext';
import { motion } from 'framer-motion';

export default function TradesPage() {
    const { displayData } = useDashboard();

    return (
        <motion.div
            key="trades"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="space-y-6"
        >
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Live Order Execution Feed</h2>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8">
                    <LiveTradeFeed trades={displayData.trades} />
                </div>
                <div className="lg:col-span-4">
                    <AuditTrail />
                </div>
            </div>
        </motion.div>
    );
}
