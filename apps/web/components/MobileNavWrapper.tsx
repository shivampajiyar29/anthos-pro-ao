'use client';

import React from 'react';
import MobileNav from './MobileNav';
import { usePathname, useRouter } from 'next/navigation';

export default function MobileNavWrapper() {
    const pathname = usePathname();
    const router = useRouter();
    const active = pathname === '/' ? 'dashboard' : pathname.split('/')[1];

    const setActiveView = (view: string) => {
        const path = view === 'dashboard' ? '/' : `/${view}`;
        router.push(path);
    };

    return (
        <MobileNav
            activeView={active}
            setActiveView={setActiveView}
        />
    );
}
