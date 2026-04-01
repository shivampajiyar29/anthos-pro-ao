'use client';

import React from 'react';
import { LineChart, BarChart } from 'lucide-react';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('@/components/dashboard/MainChart'), { ssr: false });

export default function ChartsPage() {
    return (
        <div className="p-8 space-y-6 h-full flex flex-col">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-black italic text-white uppercase tracking-wider">Advanced Charts</h1>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-brand-accent text-brand-bg text-[10px] font-black uppercase rounded-lg">Real-Time</button>
                    <button className="px-4 py-2 bg-brand-panel border border-brand-border text-brand-text-secondary text-[10px] font-black uppercase rounded-lg">Historical</button>
                </div>
            </div>

            <div className="flex-1 bg-brand-panel border border-brand-border rounded-xl p-6 min-h-[600px]">
                <Chart />
            </div>
        </div>
    );
}
