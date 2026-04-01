'use client';

import React from 'react';
import Settings from '@/components/Settings';
import { useDashboard } from '@/lib/DashboardContext';
import { motion } from 'framer-motion';

export default function SettingsPage() {
    const { isLiveMode, setIsLiveMode, apiKeys, setApiKeys } = useDashboard();

    return (
        <motion.div
            key="settings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
        >
            <Settings
                isLiveMode={isLiveMode}
                setIsLiveMode={setIsLiveMode}
                apiKeys={apiKeys}
                onUpdateApiKey={(broker, key) => setApiKeys({ ...apiKeys, [broker]: key })}
            />
        </motion.div>
    );
}
