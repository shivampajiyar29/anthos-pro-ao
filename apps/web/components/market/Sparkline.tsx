"use client";

import React from 'react';

interface SparklineProps {
    data: number[];
    isUp: boolean;
}

const Sparkline: React.FC<SparklineProps> = ({ data, isUp }) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min;
    const width = 100;
    const height = 30;

    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((d - min) / range) * height;
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg width={width} height={height} className="overflow-visible">
            <path
                d={`M ${points}`}
                fill="none"
                stroke={isUp ? '#10b981' : '#f43f5e'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {/* Gradient Area */}
            <path
                d={`M 0,${height} L ${points} L ${width},${height} Z`}
                fill={`url(#gradient-${isUp ? 'up' : 'down'})`}
                className="opacity-20"
            />
            <defs>
                <linearGradient id="gradient-up" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="transparent" />
                </linearGradient>
                <linearGradient id="gradient-down" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f43f5e" />
                    <stop offset="100%" stopColor="transparent" />
                </linearGradient>
            </defs>
        </svg>
    );
};

export default Sparkline;
