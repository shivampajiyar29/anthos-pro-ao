'use client';

import React from 'react';
import AgentArena from '@/components/AgentArena';
import Leaderboard from '@/components/Leaderboard';
import { useDashboard } from '@/lib/DashboardContext';
import { motion } from 'framer-motion';

export default function AgentsPage() {
    const { displayData, handleAgentUpdate } = useDashboard();

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Neural Agent Fleet Control</h2>
            <AgentArena
                agents={displayData.agents}
                onUpdateAgent={handleAgentUpdate}
            />
            <Leaderboard data={displayData.leaderboard} />
        </motion.div>
    );
}
