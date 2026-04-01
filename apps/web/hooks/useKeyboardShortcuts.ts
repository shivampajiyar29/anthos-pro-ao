"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const useKeyboardShortcuts = () => {
    const router = useRouter();

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Focus Search: Ctrl + K (or Meta + K)
            if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
                event.preventDefault();
                const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
                searchInput?.focus();
            }

            // Navigation: Alt + [1-7]
            if (event.altKey) {
                const navMap: Record<string, string> = {
                    '1': '/',
                    '2': '/strategies',
                    '3': '/backtests',
                    '4': '/deployments',
                    '5': '/risk',
                    '6': '/audit-logs',
                    '7': '/settings',
                };

                if (navMap[event.key]) {
                    event.preventDefault();
                    router.push(navMap[event.key]);
                }
            }

            // Close Modals: Escape
            if (event.key === 'Escape') {
                // This will be handled by individual components usually, 
                // but we can trigger a global state if needed.
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [router]);
};
