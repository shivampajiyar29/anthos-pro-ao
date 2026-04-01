'use client';

import React from 'react';
import StrategyBuilder from '@/components/StrategyBuilder';

export default function BuilderPage() {
    return (
        <div>
            <div className="mb-8">
                <h2 className="text-2xl font-black italic text-white uppercase tracking-wider">Strategy Builder</h2>
                <p className="text-[10px] text-brand-text-secondary font-black uppercase tracking-[0.2em] mt-1 opacity-70">Design, test and deploy algorithmic strategies</p>
            </div>
            <StrategyBuilder />
        </div>
    );
}
