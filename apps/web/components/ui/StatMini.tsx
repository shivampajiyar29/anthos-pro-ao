import React from 'react';
import { Card } from './Card';
import { LucideIcon } from 'lucide-react';

interface StatMiniProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
}

export function StatMini({ label, value, icon: Icon, color = 'text-blue-500' }: StatMiniProps) {
  return (
    <Card className="p-6 flex items-center justify-between border-slate-900/30 hover:border-slate-800 transition-all bg-slate-900/10">
      <div className="space-y-1">
        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest leading-none">{label}</p>
        <p className={`text-2xl font-black italic tabular-nums leading-none mt-3 ${color}`}>{value}</p>
      </div>
      <div className="p-4 bg-slate-950 rounded-2xl border border-slate-900 shadow-inner">
        <Icon size={24} className={color} />
      </div>
    </Card>
  );
}
