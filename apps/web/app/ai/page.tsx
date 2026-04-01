'use client';

import React from 'react';
import ChatAssistant from '@/components/ChatAssistant';

export default function AIPage() {
    return (
        <div className="flex flex-col h-[calc(100vh-120px)]">
            <div className="mb-8">
                <h2 className="text-2xl font-black italic text-white uppercase tracking-wider">Neural Strategy Forge</h2>
                <p className="text-[10px] text-brand-text-secondary font-black uppercase tracking-[0.2em] mt-1 opacity-70">Natural language interface to the algorithmic agent hive</p>
            </div>

            <div className="flex-1 bg-brand-panel/50 border border-brand-border rounded-2xl overflow-hidden backdrop-blur-md">
                <ChatAssistant />
            </div>
        </div>
    );
}
