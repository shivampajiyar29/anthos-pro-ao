'use client';

import React from 'react';
import Header from './layout/QuantHeader';
import { useDashboard } from '@/lib/DashboardContext';

export default function HeaderWrapper() {
    const { displayData } = useDashboard();

    // In a real app, setSearchQuery would likely be a global action or navigation
    const setSearchQuery = (query: string) => {
        console.log("Search query update:", query);
        // This could be updated in context if needed
    };

    return (
        <Header />
    );
}
