'use client';

import React, { useEffect, useRef } from 'react';
import { createChart, ColorType } from 'lightweight-charts';

export default function MainChart() {
    const chartContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const handleResize = () => {
            chart.applyOptions({ width: chartContainerRef.current!.clientWidth });
        };

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: 'transparent' },
                textColor: '#7B7E84',
            },
            grid: {
                vertLines: { color: 'rgba(28, 31, 38, 0.5)' },
                horzLines: { color: 'rgba(28, 31, 38, 0.5)' },
            },
            width: chartContainerRef.current.clientWidth,
            height: 400,
            crosshair: {
                mode: 0, // Normal
                vertLine: { color: '#17C7A1', width: 1, style: 2 },
                horzLine: { color: '#17C7A1', width: 1, style: 2 },
            },
            handleScroll: true,
            handleScale: true,
        });

        const candlestickSeries = chart.addCandlestickSeries({
            upColor: '#17C7A1',
            downColor: '#FF4D4D',
            borderVisible: false,
            wickUpColor: '#17C7A1',
            wickDownColor: '#FF4D4D',
        });

        // Mock AAPL Data for visualization
        const data = generateMockData();
        candlestickSeries.setData(data);

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, []);

    return <div ref={chartContainerRef} className="w-full h-full" />;
}

function generateMockData() {
    const data = [];
    let time = new Date('2024-03-20T09:30:00Z').getTime() / 1000;
    let lastClose = 175.40;

    for (let i = 0; i < 100; i++) {
        const open = lastClose + (Math.random() - 0.5) * 0.5;
        const close = open + (Math.random() - 0.5) * 2;
        const high = Math.max(open, close) + Math.random() * 0.5;
        const low = Math.min(open, close) - Math.random() * 0.5;

        data.push({
            time: time as any,
            open,
            high,
            low,
            close,
        });

        lastClose = close;
        time += 900; // 15m intervals
    }
    return data;
}
