import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'light' | 'glass' | 'outline' | 'flat';
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-slate-900/40 border border-slate-900/80 backdrop-blur-sm shadow-xl shadow-black/20',
      light: 'bg-white border-slate-100 shadow-sm shadow-slate-200/50',
      glass: 'bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl',
      outline: 'border border-slate-800 bg-transparent',
      flat: 'bg-slate-900/20 border-none',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-[32px] p-6 transition-all duration-300',
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = "Card";

export { Card };
