'use client';

import React from 'react';
import RiskDashboard from '@/components/RiskDashboard';

export default function RiskPage() {
    return (
        <div>
            <div className="mb-8">
                <h2 className="text-2xl font-black italic text-white uppercase tracking-wider">Risk Engine</h2>
                <p className="text-[10px] text-brand-text-secondary font-black uppercase tracking-[0.2em] mt-1 opacity-70">Real-time portfolio risk management and monitoring</p>
            </div>
            <RiskDashboard />
        </div>
    );
}
