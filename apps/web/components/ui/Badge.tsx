import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'success' | 'danger' | 'warning' | 'outline';
}

const Badge: React.FC<BadgeProps> = ({ className, variant = 'primary', ...props }) => {
  const variants = {
    primary: 'bg-blue-600/10 text-blue-400 border-blue-500/20',
    success: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    danger: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    warning: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    outline: 'border border-slate-800 text-slate-400',
  };

  return (
    <span
      className={cn(
        'px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border',
        variants[variant],
        className
      )}
      {...props}
    />
  );
};

export { Badge };
