"use client";

import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Column<T> {
  header: string;
  accessorKey: keyof T | ((row: T) => React.ReactNode);
  cell?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  theme?: 'dark' | 'light';
  className?: string;
  headerClassName?: string;
  rowClassName?: string;
}

export function DataTable<T>({ 
  data, 
  columns, 
  isLoading, 
  theme = 'dark',
  className,
  headerClassName,
  rowClassName 
}: DataTableProps<T>) {
  return (
    <div className={cn("overflow-hidden", className)}>
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={cn(
              "border-b transition-colors",
              theme === 'dark' ? "bg-slate-900/40 border-slate-900/80" : "bg-slate-50 border-slate-100",
              headerClassName
            )}>
              {columns.map((col, i) => (
                <th key={i} className="px-10 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={cn(
            "divide-y",
            theme === 'dark' ? "divide-slate-900/50" : "divide-slate-50"
          )}>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {columns.map((_, j) => (
                    <td key={j} className="px-10 py-5">
                      <div className={cn("h-4 rounded-md w-24", theme === 'dark' ? "bg-slate-900" : "bg-slate-100")} />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-10 py-20 text-center">
                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest italic opacity-40">No records found</p>
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr key={i} className={cn(
                    "transition-all group",
                    theme === 'dark' ? "hover:bg-blue-600/[0.03]" : "hover:bg-slate-50/50",
                    rowClassName
                )}>
                  {columns.map((col, j) => (
                    <td key={j} className="px-10 py-5 text-sm font-medium">
                      {typeof col.accessorKey === 'function' 
                        ? col.accessorKey(row) 
                        : col.cell 
                          ? col.cell(row) 
                          : (row[col.accessorKey] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className={cn(
        "p-6 border-t flex items-center justify-between",
        theme === 'dark' ? "border-slate-900 bg-slate-900/20" : "border-slate-100 bg-slate-50/30"
      )}>
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Showing {data.length} of {data.length} Results</p>
         <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-9 w-9 border-slate-200/50 hover:bg-white"><ChevronsLeft size={16} /></Button>
            <Button variant="outline" size="icon" className="h-9 w-9 border-slate-200/50 hover:bg-white"><ChevronLeft size={16} /></Button>
            <div className="flex items-center gap-1 mx-2">
                <span className="h-9 w-9 flex items-center justify-center bg-[#0F172A] rounded-xl text-xs font-black text-white shadow-lg">1</span>
            </div>
            <Button variant="outline" size="icon" className="h-9 w-9 border-slate-200/50 hover:bg-white"><ChevronRight size={16} /></Button>
            <Button variant="outline" size="icon" className="h-9 w-9 border-slate-200/50 hover:bg-white"><ChevronsRight size={16} /></Button>
         </div>
      </div>
    </div>
  );
}
