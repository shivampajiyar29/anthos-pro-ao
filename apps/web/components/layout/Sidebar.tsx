"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BarChart3, 
  Settings,
  Zap,
  ChevronRight,
  MoreHorizontal,
  LayoutGrid,
  PlayCircle,
  Cpu,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

const menuItems = [
  { icon: LayoutGrid, label: 'Dashboard', href: '/' },
  { icon: BarChart3, label: 'Strategies', href: '/strategies' },
  { icon: PlayCircle, label: 'Deployments', href: '/deployments' },
  { icon: Cpu, label: 'Maheshwara', href: '/maheshwara', pro: true },
  { icon: ShieldCheck, label: 'Risk Engine', href: '/risk' },
  { icon: FileText, label: 'Audit Logs', href: '/audit-logs' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

const Sidebar = () => {
  const pathname = usePathname();
  const [isMaheshwaraActive, setIsMaheshwaraActive] = React.useState(false);

  // Toggle Maheshwara Mode
  const toggleMaheshwara = async () => {
    try {
        const nextState = !isMaheshwaraActive;
        // In a real app, I'd call api.post('/maheshwara/toggle', { active: nextState });
        setIsMaheshwaraActive(nextState);
    } catch (err) {
        console.error("Failed to toggle Maheshwara", err);
    }
  };

  return (
    <aside className="w-20 lg:w-64 bg-[#0F172A] border-r border-slate-900 flex flex-col h-screen sticky top-0 transition-all duration-300 z-50">
      {/* Brand Logo - Alacap Style */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className={cn(
                "w-9 h-9 rounded-xl shadow-lg flex items-center justify-center transition-all duration-500",
                isMaheshwaraActive 
                    ? "bg-[#F3C623] shadow-[#F3C623]/20 scale-110" 
                    : "bg-[#17C7A1] shadow-[#17C7A1]/20"
            )}>
                <Zap size={20} className={cn(
                    "transition-colors duration-500",
                    isMaheshwaraActive ? "text-[#0F172A] fill-[#0F172A]" : "text-[#0F172A] fill-current"
                )} />
            </div>
            <div className="hidden lg:block">
                <h1 className="text-xl font-black tracking-tighter text-white leading-none">
                    Al<span className="text-[#17C7A1]">acap</span>
                </h1>
                <p className="text-[8px] font-bold text-slate-500 uppercase tracking-[0.25em] mt-1 opacity-60">Fintech Terminal</p>
            </div>
        </div>
      </div>
      
      {/* Maheshwara Toggle (Autonomous Mode) */}
      <div className="px-4 mb-4 hidden lg:block">
          <button 
            onClick={toggleMaheshwara}
            className={cn(
                "w-full p-4 rounded-[20px] transition-all duration-500 flex flex-col items-center justify-center gap-2 border group overflow-hidden relative",
                isMaheshwaraActive 
                    ? "bg-[#F3C623]/5 border-[#F3C623]/30 shadow-xl shadow-[#F3C623]/5" 
                    : "bg-slate-900/40 border-slate-800 hover:border-[#17C7A1]/30"
            )}
          >
              {isMaheshwaraActive && (
                  <div className="absolute inset-0 bg-gradient-to-t from-[#F3C623]/10 to-transparent animate-pulse" />
              )}
              <div className="flex items-center gap-3 relative z-10 w-full px-2">
                  <div className={cn(
                      "w-2 h-2 rounded-full",
                      isMaheshwaraActive ? "bg-[#F3C623] animate-ping" : "bg-slate-600"
                  )} />
                  <span className={cn(
                      "text-[10px] font-black uppercase tracking-[0.2em]",
                      isMaheshwaraActive ? "text-[#F3C623]" : "text-slate-500"
                  )}>
                      {isMaheshwaraActive ? "Maheshwara Active" : "Maheshwara Offline"}
                  </span>
              </div>
              <div className="flex items-center justify-between w-full px-2 mt-1 relative z-10">
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tight group-hover:text-slate-300">Autonomous Trade</p>
                  <div className={cn(
                      "w-8 h-4 rounded-full p-1 transition-all duration-300",
                      isMaheshwaraActive ? "bg-[#F3C623]" : "bg-slate-700"
                  )}>
                      <div className={cn(
                          "w-2 h-2 rounded-full bg-white transition-all duration-300",
                          isMaheshwaraActive ? "translate-x-4" : "translate-x-0"
                      )} />
                  </div>
              </div>
          </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 mt-6 space-y-1.5 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const index = menuItems.indexOf(item) + 1;
          
          return (
            <Link 
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group relative",
                isActive 
                  ? "bg-[#17C7A1]/10 text-[#17C7A1] font-bold" 
                  : "text-slate-500 hover:text-slate-200 hover:bg-slate-900/40"
              )}
            >
              <item.icon size={20} className={cn(
                "transition-all duration-300",
                isActive ? "text-[#17C7A1] scale-105" : "text-slate-500 group-hover:text-slate-300 group-hover:scale-105"
              )} />
              <span className="hidden lg:block text-sm tracking-tight">{item.label}</span>
              
              {isActive ? (
                <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#17C7A1] rounded-r-full shadow-[0_0_12px_rgba(23,199,161,0.6)]" />
              ) : (
                <div className="ml-auto hidden lg:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[8px] font-black text-slate-600">ALT</span>
                    <span className="text-[9px] font-black text-[#17C7A1]/60 bg-[#17C7A1]/5 px-1.5 rounded-md border border-[#17C7A1]/10">{index}</span>
                </div>
              )}
            </Link>
          );
        })}
      </nav>
      
      {/* Footer */}
      <div className="p-4 mt-auto">
        <div className="flex items-center gap-3 p-3 bg-slate-900/40 rounded-2xl border border-slate-800/40 hover:border-slate-700/60 transition-all cursor-pointer group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center text-[#17C7A1] font-black text-xs shadow-xl">
            AD
          </div>
          <div className="hidden lg:block flex-1 min-w-0">
            <p className="text-xs font-black text-white truncate uppercase tracking-tight">Admin Master</p>
            <p className="text-[9px] text-[#17C7A1] truncate font-black uppercase tracking-widest mt-0.5 opacity-80">PRO ACCOUNT</p>
          </div>
          <Settings size={14} className="text-slate-600 group-hover:text-white transition-colors hidden lg:block" />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
