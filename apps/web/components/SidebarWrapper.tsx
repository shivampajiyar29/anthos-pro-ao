'use client';

import React, { useState } from 'react';
import Sidebar from './layout/QuantSidebar';
import { useDashboard } from '@/lib/DashboardContext';
import { usePathname } from 'next/navigation';

export default function SidebarWrapper() {
    const { activeView, sidebarCollapsed, setSidebarCollapsed } = {
        activeView: usePathname().split('/')[1] || 'dashboard',
        sidebarCollapsed: false, // Default or manage here
        setSidebarCollapsed: (v: boolean) => { } // Placeholder for now
    };

    // Actually, I should manage sidebar state in the Context too.
    // Let's update the context first or manage it here.

    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="hidden md:block border-r border-[var(--glass-border)]">
            <Sidebar />
        </div>
    );
}
