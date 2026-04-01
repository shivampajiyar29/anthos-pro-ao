'use client';

import React from 'react';
import AuditLogViewer from '@/components/AuditLogViewer';

export default function AuditPage() {
    return (
        <div>
            <div className="mb-8">
                <h2 className="text-2xl font-black italic text-white uppercase tracking-wider">Security & Audit Vault</h2>
                <p className="text-[10px] text-brand-text-secondary font-black uppercase tracking-[0.2em] mt-1 opacity-70">Immutable records of system actions and risk breaches</p>
            </div>
            <AuditLogViewer />
        </div>
    );
}
