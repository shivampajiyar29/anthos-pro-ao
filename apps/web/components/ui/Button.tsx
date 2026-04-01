"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'mint' | 'navy';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const variants = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-900/20 active:scale-95',
      secondary: 'bg-slate-800 text-slate-200 hover:bg-slate-700 active:scale-95',
      outline: 'border border-slate-800 bg-transparent hover:bg-slate-900 text-slate-300 active:scale-95',
      ghost: 'hover:bg-slate-900 text-slate-400 hover:text-white active:scale-95',
      danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-900/20 active:scale-95',
      success: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-900/20 active:scale-95',
      mint: 'bg-[#17C7A1] text-[#0F172A] hover:bg-[#14ae8c] shadow-lg shadow-[#17C7A1]/20 active:scale-95',
      navy: 'bg-[#0F172A] text-white hover:bg-slate-800 shadow-lg shadow-[#0F172A]/20 active:scale-95',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs rounded-lg',
      md: 'px-5 py-2.5 text-sm rounded-xl',
      lg: 'px-8 py-4 text-base rounded-2xl',
      icon: 'p-2.5 rounded-xl',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center font-black uppercase tracking-widest transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
