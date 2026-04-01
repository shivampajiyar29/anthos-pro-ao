'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Activity } from 'lucide-react';

export default function OrderFlowHeatmap({ buy, sell }: { buy: number, sell: number }) {
    const data = [
        { name: 'Buy Pressure', value: buy },
        { name: 'Sell Pressure', value: sell },
    ];

    const COLORS = ['#00ffff', '#aa00ff'];

    return (
        <div className="glass-panel p-4 h-full relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Activity className="text-[var(--cyan)] w-4 h-4" />
                    <h3 className="text-xs font-bold uppercase tracking-widest">Order Flow</h3>
                </div>
                <span className="mono text-[10px] text-gray-500 uppercase">Live Pulse</span>
            </div>

            <div className="h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={90}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                            animationBegin={0}
                            animationDuration={800}
                            animationEasing="ease-in-out"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                            itemStyle={{ color: '#fff', fontSize: '10px' }}
                        />
                    </PieChart>
                </ResponsiveContainer>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none mt-2">
                    <span className="block text-2xl font-bold mono text-[var(--cyan)]">{buy}%</span>
                    <span className="block text-[8px] text-gray-500 uppercase font-bold">Buy Signal</span>
                </div>
            </div>

            <div className="mt-2 flex justify-between px-2">
                <div className="text-center">
                    <span className="block h-1 w-8 bg-[var(--cyan)] rounded-full mb-1 mx-auto" />
                    <span className="text-[8px] text-gray-500">BUY</span>
                </div>
                <div className="text-center">
                    <span className="block h-1 w-8 bg-[var(--purple)] rounded-full mb-1 mx-auto" />
                    <span className="text-[8px] text-gray-500">SELL</span>
                </div>
            </div>
        </div>
    );
}
