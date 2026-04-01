'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi, CrosshairMode, Time, LineStyle, IPriceLine } from 'lightweight-charts';
import { useDashboard } from '../lib/DashboardContext';
import { useMarket } from '../lib/MarketContext';
import { calculateRSI, calculateBollingerBands, calculateMACD, Candle } from '@/lib/indicators';
import { X, Crosshair, TrendingUp, Edit2, Type, Ruler, Magnet, Eye, MoreHorizontal, Settings2, Maximize2, Camera, BarChart2 } from 'lucide-react';

interface CandleChartProps {
    symbol: string;
    interval: string;
    showIndicators?: boolean;
    height?: number;
}

const normalizeSymbol = (s: string) => {
    let clean = s.toUpperCase().replace(/[/_-]/g, '');
    if (clean === 'ETHUSD' || clean === 'BTCUSD' || clean === 'BNBUSD' || clean === 'SOLUSD') {
        return clean + 'T';
    }
    return clean;
};

// Colors based on requested aesthetics
const COLORS = {
    up: '#10b981', // emerald-500 replacement for magenta
    down: '#ef4444', // red-500
    bg: '#0a0a0c',
    grid: 'rgba(255, 255, 255, 0.05)',
    text: '#9ca3af', // gray-400
    cyan: '#06b6d4',
    purple: '#a855f7',
    volUp: 'rgba(16, 185, 129, 0.5)',
    volDown: 'rgba(239, 68, 68, 0.5)',
};

export default function CandleChart({ symbol, interval: initialInterval, showIndicators = false, height = 400 }: CandleChartProps) {
    const { displayData } = useDashboard();
    const [currentInterval, setCurrentInterval] = useState(initialInterval);
    const { tick } = useMarket(symbol);
    
    // Chart References
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
    const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);
    const rsiSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
    const macdSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
    const bbUpperSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
    const bbLowerSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
    const wsRef = useRef<WebSocket | null>(null);
    
    // UI States
    const [activeTool, setActiveTool] = useState('crosshair');
    const [indicatorsEnabled, setIndicatorsEnabled] = useState(showIndicators);
    const [chartType, setChartType] = useState<'candles'|'line'>('candles');
    
    // Map hoverData with additional keys
    const [hoverData, setHoverData] = useState<{
        open?: number; high?: number; low?: number; close?: number; vol?: number; rsi?: number; macd?: number;
    }>({});

    const positions = useMemo(() => {
        return displayData.positions.filter(p => p.symbol === symbol);
    }, [displayData.positions, symbol]);

    const handleClosePosition = async (sym: string) => {
        try {
            await fetch('http://localhost:8000/api/positions/close', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ symbol: sym })
            });
        } catch (error) {
            console.error("Failed to close position:", error);
        }
    };

    // Helper to format timestamp
    const formatTime = (ts: any): Time => {
        // Fallback for different timestamp formats
        const d = new Date(ts);
        return (d.getTime() / 1000) as Time;
    };

    useEffect(() => {
        if (!chartContainerRef.current) return;

        // Initialize Lightweight Chart
        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: 'transparent' },
                textColor: COLORS.text,
            },
            grid: {
                vertLines: { color: COLORS.grid },
                horzLines: { color: COLORS.grid },
            },
            crosshair: {
                mode: CrosshairMode.Normal,
                vertLine: {
                    width: 1,
                    color: 'rgba(255, 255, 255, 0.2)',
                    style: LineStyle.Dashed,
                },
                horzLine: {
                    width: 1,
                    color: 'rgba(255, 255, 255, 0.2)',
                    style: LineStyle.Dashed,
                },
            },
            rightPriceScale: {
                borderColor: COLORS.grid,
                autoScale: true,
            },
            timeScale: {
                borderColor: COLORS.grid,
                timeVisible: true,
                secondsVisible: false,
                rightOffset: 12, // Leave space on the right for current price
            },
        });
        chartRef.current = chart;

        const candleSeries = chart.addCandlestickSeries({
            upColor: COLORS.up,
            downColor: COLORS.down,
            borderVisible: false,
            wickUpColor: COLORS.up,
            wickDownColor: COLORS.down,
        });
        candleSeriesRef.current = candleSeries;

        const volumeSeries = chart.addHistogramSeries({
            color: '#26a69a',
            priceFormat: { type: 'volume' },
            priceScaleId: '',
        });
        const rsiSeries = chart.addLineSeries({
            color: COLORS.purple,
            lineWidth: 2,
            priceScaleId: 'rsi',
            visible: indicatorsEnabled,
        });
        rsiSeriesRef.current = rsiSeries;
        
        const macdSeries = chart.addLineSeries({
            color: COLORS.cyan,
            lineWidth: 2,
            priceScaleId: 'macd',
            visible: indicatorsEnabled,
        });
        macdSeriesRef.current = macdSeries;

        const bbUpperSeries = chart.addLineSeries({ color: 'rgba(255, 255, 255, 0.2)', lineWidth: 1, lineStyle: LineStyle.Dashed, visible: indicatorsEnabled });
        const bbLowerSeries = chart.addLineSeries({ color: 'rgba(255, 255, 255, 0.2)', lineWidth: 1, lineStyle: LineStyle.Dashed, visible: indicatorsEnabled });
        bbUpperSeriesRef.current = bbUpperSeries;
        bbLowerSeriesRef.current = bbLowerSeries;

        // Apply Layouts
        const updateLayouts = (showInd: boolean) => {
            candleSeries.priceScale().applyOptions({ scaleMargins: showInd ? { top: 0.05, bottom: 0.45 } : { top: 0.05, bottom: 0.2 } });
            volumeSeries.priceScale().applyOptions({ scaleMargins: showInd ? { top: 0.55, bottom: 0.45 } : { top: 0.8, bottom: 0 } });
            rsiSeries.priceScale().applyOptions({ scaleMargins: { top: 0.6, bottom: 0.25 } });
            macdSeries.priceScale().applyOptions({ scaleMargins: { top: 0.8, bottom: 0 } });
        };
        updateLayouts(indicatorsEnabled);
        
        chart.subscribeCrosshairMove((param) => {
            if (param.time && param.seriesData.size > 0) {
                const candleData: any = param.seriesData.get(candleSeries);
                const volData: any = param.seriesData.get(volumeSeries);
                if (candleData) {
                    setHoverData({
                        open: candleData.open,
                        high: candleData.high,
                        low: candleData.low,
                        close: candleData.close,
                        vol: volData ? volData.value : undefined
                    });
                }
            } else {
                setHoverData({});
            }
        });

        // Handle resizing
        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, []); // Removed specific dependency so setup only runs once

    // Handle indicator toggling dynamically
    useEffect(() => {
        if (!candleSeriesRef.current || !volumeSeriesRef.current || !rsiSeriesRef.current || !macdSeriesRef.current) return;
        rsiSeriesRef.current.applyOptions({ visible: indicatorsEnabled });
        macdSeriesRef.current.applyOptions({ visible: indicatorsEnabled });
        bbUpperSeriesRef.current?.applyOptions({ visible: indicatorsEnabled });
        bbLowerSeriesRef.current?.applyOptions({ visible: indicatorsEnabled });
        
        candleSeriesRef.current.priceScale().applyOptions({ scaleMargins: indicatorsEnabled ? { top: 0.05, bottom: 0.45 } : { top: 0.05, bottom: 0.2 } });
        volumeSeriesRef.current.priceScale().applyOptions({ scaleMargins: indicatorsEnabled ? { top: 0.55, bottom: 0.45 } : { top: 0.8, bottom: 0 } });
    }, [indicatorsEnabled]);

    // Fetch Historical Data & WS
    useEffect(() => {
        if (!candleSeriesRef.current || !volumeSeriesRef.current) return;

        let lastCandleTime = 0;

        const fetchHistory = async () => {
            try {
                const apiSymbol = normalizeSymbol(symbol);
                const response = await fetch(`http://localhost:8000/api/candles/${apiSymbol}/${currentInterval}`);
                if (response.ok) {
                    const data: Candle[] = await response.json();
                    if (Array.isArray(data) && data.length > 0) {
                        // Sort strictly ascending
                        const sortedData = [...data].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
                        
                        // Deduplicate exact timestamps
                        const uniqueMap = new Map();
                        sortedData.forEach(c => uniqueMap.set(formatTime(c.timestamp), c));
                        const uniqueData = Array.from(uniqueMap.values());

                        const candleData = uniqueData.map(c => ({
                            time: formatTime(c.timestamp),
                            open: c.open,
                            high: c.high,
                            low: c.low,
                            close: c.close,
                        }));
                        
                        const volumeData = uniqueData.map(c => ({
                            time: formatTime(c.timestamp),
                            value: c.volume,
                            color: c.close >= c.open ? COLORS.volUp : COLORS.volDown,
                        }));

                        const rsiData: any[] = [];
                        const macdData: any[] = [];
                        const bbUpData: any[] = [];
                        const bbDownData: any[] = [];
                        
                        for (let i = 0; i < uniqueData.length; i++) {
                            const slice = uniqueData.slice(0, i + 1).map(c => c.close);
                            const t = formatTime(uniqueData[i].timestamp);
                            if (slice.length >= 14) rsiData.push({ time: t, value: calculateRSI(slice, 14) });
                            if (slice.length >= 26) {
                                const m = calculateMACD(slice);
                                if (m) macdData.push({ time: t, value: m.macd });
                            }
                            if (slice.length >= 20) {
                                const b = calculateBollingerBands(slice, 20, 2);
                                if (b) {
                                    bbUpData.push({ time: t, value: b.upper });
                                    bbDownData.push({ time: t, value: b.lower });
                                }
                            }
                        }

                        candleSeriesRef.current?.setData(candleData);
                        volumeSeriesRef.current?.setData(volumeData);
                        rsiSeriesRef.current?.setData(rsiData);
                        macdSeriesRef.current?.setData(macdData);
                        bbUpperSeriesRef.current?.setData(bbUpData);
                        bbLowerSeriesRef.current?.setData(bbDownData);
                        lastCandleTime = candleData[candleData.length - 1].time as number;
                        
                        // Set initial hover data to last candle
                        const last = uniqueData[uniqueData.length - 1];
                        setHoverData({ open: last.open, high: last.high, low: last.low, close: last.close, vol: last.volume });
                    }
                }
            } catch (error) {
                console.error("Failed to fetch candle history:", error);
            }
        };

        fetchHistory();

        // Connect WebSocket for live ticks
        const apiSymbol = normalizeSymbol(symbol);
        const ws = new WebSocket(`ws://localhost:8000/ws/candles/${apiSymbol}/${currentInterval}`);
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const time = formatTime(data.timestamp);
            
            // Only update if time is equal or greater than the last historical point
            if ((time as number) >= lastCandleTime) {
                candleSeriesRef.current?.update({
                    time,
                    open: data.open,
                    high: data.high,
                    low: data.low,
                    close: data.close,
                });
                volumeSeriesRef.current?.update({
                    time,
                    value: data.volume,
                    color: data.close >= data.open ? COLORS.volUp : COLORS.volDown,
                });
                
                // Real-time indicators update would go here (omitted for brevity, requires keeping last N prices)

                lastCandleTime = time as number;
            }
        };
        wsRef.current = ws;

        return () => ws.close();
    }, [symbol, currentInterval]);

    // Track active PriceLines
    const priceLinesRef = useRef<{ [key: string]: IPriceLine }>({});

    // Draw Position Lines
    useEffect(() => {
        if (!candleSeriesRef.current) return;
        const series = candleSeriesRef.current;

        // Clear existing lines not in current positions
        const currentIds = positions.map(p => p.symbol);
        Object.keys(priceLinesRef.current).forEach(id => {
            if (!currentIds.includes(id)) {
                series.removePriceLine(priceLinesRef.current[id]);
                delete priceLinesRef.current[id];
            }
        });

        // Add/Update lines
        positions.forEach(pos => {
            const currentPrice = tick?.price || pos.current_price;
            const pnl = (currentPrice - pos.entry_price) * pos.quantity * (pos.side === 'BUY' ? 1 : -1);
            
            if (!priceLinesRef.current[`${pos.symbol}-entry`]) {
                const line = series.createPriceLine({
                    price: pos.entry_price,
                    color: COLORS.cyan,
                    lineWidth: 1,
                    lineStyle: LineStyle.Dashed,
                    axisLabelVisible: true,
                    title: `Entry`,
                });
                priceLinesRef.current[`${pos.symbol}-entry`] = line;
            }

            if (pos.target_price && !priceLinesRef.current[`${pos.symbol}-tp`]) {
                const line = series.createPriceLine({
                    price: pos.target_price,
                    color: COLORS.up,
                    lineWidth: 1,
                    lineStyle: LineStyle.Dotted,
                    axisLabelVisible: true,
                    title: `TP`,
                });
                priceLinesRef.current[`${pos.symbol}-tp`] = line;
            }
            
            if (pos.stop_loss && !priceLinesRef.current[`${pos.symbol}-sl`]) {
                const line = series.createPriceLine({
                    price: pos.stop_loss,
                    color: COLORS.down,
                    lineWidth: 1,
                    lineStyle: LineStyle.Dotted,
                    axisLabelVisible: true,
                    title: `SL`,
                });
                priceLinesRef.current[`${pos.symbol}-sl`] = line;
            }
        });

    }, [positions, tick]);

    const drawingTools = [
        { id: 'crosshair', icon: Crosshair },
        { id: 'trendline', icon: TrendingUp },
        { id: 'edit', icon: Edit2 },
        { id: 'text', icon: Type },
        { id: 'ruler', icon: Ruler },
    ];

    return (
        <div className="flex flex-col w-full bg-[#0a0a0c] border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)]" style={{ height }}>
            {/* Top Toolbar */}
            <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5 backdrop-blur-md z-20 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 mr-2">
                        <span className="text-white font-black text-sm tracking-widest">{symbol}</span>
                        <div className="flex items-center gap-1 bg-white/10 rounded px-1.5 py-0.5">
                            <span className="w-1.5 h-1.5 bg-[var(--green)] rounded-full animate-pulse" />
                            <span className="text-[8px] text-[var(--green)] font-black uppercase tracking-widest">Live</span>
                        </div>
                    </div>
                    
                    <div className="h-4 w-px bg-white/10" />

                    <div className="flex items-center gap-1">
                        {['1m', '5m', '15m', '1h', '1d'].map(int => (
                            <button
                                key={int}
                                onClick={() => setCurrentInterval(int)}
                                className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest transition-colors ${currentInterval === int ? 'bg-[var(--cyan)]/20 text-[var(--cyan)]' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                            >
                                {int}
                            </button>
                        ))}
                    </div>

                    <div className="h-4 w-px bg-white/10" />

                    <div className="flex items-center gap-1">
                        <button 
                            onClick={() => setChartType('candles')}
                            className={`p-1 rounded transition-colors ${chartType === 'candles' ? 'text-white bg-white/10' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                            title="Candles"
                        ><BarChart2 size={14} /></button>
                        <button 
                            onClick={() => setChartType('line')}
                            className={`p-1 rounded transition-colors ${chartType === 'line' ? 'text-white bg-white/10' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                            title="Line"
                        ><TrendingUp size={14} /></button>
                    </div>

                    <div className="h-4 w-px bg-white/10" />

                    <button 
                        onClick={() => setIndicatorsEnabled(!indicatorsEnabled)}
                        className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest transition-colors ${indicatorsEnabled ? 'text-[var(--purple)] bg-[var(--purple)]/10' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                    >
                        fx Indicators
                    </button>
                </div>
                
                <div className="flex items-center gap-2">
                    <button className="p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded transition-colors"><Settings2 size={14} /></button>
                    <button className="p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded transition-colors"><Camera size={14} /></button>
                    <button className="p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded transition-colors"><Maximize2 size={14} /></button>
                </div>
            </div>

            {/* Floating Data Window */}
            <div className="px-4 py-1.5 bg-[#0a0a0c]/80 border-b border-white/5 flex gap-4 text-[10px] uppercase font-bold text-gray-400 z-10">
                <div className="flex gap-1.5">O: <span className="text-white mono">{hoverData.open?.toFixed(2) ?? '---'}</span></div>
                <div className="flex gap-1.5">H: <span className="text-white mono">{hoverData.high?.toFixed(2) ?? '---'}</span></div>
                <div className="flex gap-1.5">L: <span className="text-white mono">{hoverData.low?.toFixed(2) ?? '---'}</span></div>
                <div className="flex gap-1.5">C: <span className="text-white mono">{hoverData.close?.toFixed(2) ?? '---'}</span></div>
                <div className="flex gap-1.5">V: <span className="text-white mono">{hoverData.vol?.toFixed(2) ?? '---'}</span></div>
            </div>

            <div className="flex flex-1 min-h-0 relative">
                {/* Left Drawing Toolbar */}
                <div className="w-10 bg-[#0a0a0c]/80 border-r border-white/5 flex flex-col items-center py-2 gap-2 z-20 shrink-0 overflow-y-auto hidden md:flex backdrop-blur-md">
                    {drawingTools.map((tool) => {
                        const Icon = tool.icon;
                        return (
                            <button
                                key={tool.id}
                                onClick={() => setActiveTool(tool.id)}
                                className={`p-1.5 rounded-lg transition-colors ${activeTool === tool.id ? 'bg-[var(--cyan)]/20 text-[var(--cyan)]' : 'text-gray-500 hover:text-white hover:bg-white/10'}`}
                            >
                                <Icon size={16} strokeWidth={2} />
                            </button>
                        );
                    })}
                    <div className="w-6 h-px bg-white/10 my-1" />
                    <button className="p-1.5 text-gray-500 hover:text-[var(--purple)] hover:bg-white/10 rounded-lg transition-colors"><Magnet size={16} /></button>
                    <button className="p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors active:text-white"><Eye size={16} /></button>
                </div>

                {/* Main lightweight-charts Instance */}
                <div className="flex-1 relative group overflow-hidden bg-[#0a0a0c]">
                    <div ref={chartContainerRef} className="absolute inset-0 z-0" />

                    {/* Quick Trade Floating Overlay (like old custom one) */}
                    {tick && (
                        <div className="absolute top-4 right-16 flex items-center gap-1 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-auto shadow-2xl">
                            <button className="bg-[var(--red)]/90 hover:bg-[var(--red)] text-white px-3 py-1.5 rounded-l-lg border border-[var(--red)] backdrop-blur-sm flex flex-col items-center transition-transform hover:scale-105">
                                <span className="text-[8px] font-black uppercase tracking-widest opacity-80">Sell</span>
                                <span className="text-xs font-black mono">{tick.price.toFixed(2)}</span>
                            </button>
                            <div className="bg-black/90 px-2 py-1.5 border-y border-white/20 flex flex-col items-center justify-center">
                                <span className="text-[10px] font-bold text-gray-400">1.0</span>
                            </div>
                            <button className="bg-[var(--green)]/90 hover:bg-[var(--green)] text-black px-3 py-1.5 rounded-r-lg border border-[var(--green)] backdrop-blur-sm flex flex-col items-center transition-transform hover:scale-105">
                                <span className="text-[8px] font-black uppercase tracking-widest opacity-80">Buy</span>
                                <span className="text-xs font-black mono">{tick.price.toFixed(2)}</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
