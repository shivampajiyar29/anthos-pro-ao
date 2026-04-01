'use client';

// Patch for Troika Worker "window is not defined" error
if (typeof window === 'undefined' && typeof self !== 'undefined') {
    (self as any).window = self;
}

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useDashboard } from '@/lib/DashboardContext';
import { useMarket } from '@/lib/MarketContext';
import { Bell } from 'lucide-react';
import PriceAlertModal from './PriceAlertModal';
import TimeMachine from './TimeMachine';
import ErrorBoundary from './ErrorBoundary';

function Scene({ timeframe, symbol, currentPrice }: { timeframe: string; symbol: string; currentPrice: number }) {
    const [candles, setCandles] = useState<any[]>([]);

    useEffect(() => {
        // Generate trending candles based on currentPrice anchor
        const config: Record<string, { count: number, vol: number }> = {
            '1m': { count: 60, vol: currentPrice * 0.0005 },
            '5m': { count: 40, vol: currentPrice * 0.001 },
            '1h': { count: 30, vol: currentPrice * 0.005 },
            '1d': { count: 20, vol: currentPrice * 0.02 },
        };

        const { count, vol } = config[timeframe] || config['5m'];
        let price = currentPrice;
        const newCandles = Array.from({ length: count }, (_, i) => {
            const open = price;
            const change = (Math.random() - 0.48) * vol;
            const close = open + change;
            const high = Math.max(open, close) + Math.random() * (vol * 0.2);
            const low = Math.min(open, close) - Math.random() * (vol * 0.2);
            price = close;
            return { open, close, high, low };
        }).reverse(); // Latest candle at the end

        setCandles(newCandles);
    }, [timeframe, symbol, currentPrice]);

    return (
        <>
            <Float speed={2} rotationIntensity={0.05} floatIntensity={0.1}>
                {candles.map((candle, index) => {
                    const isUp = candle.close > candle.open;
                    const bodyHeight = Math.max(0.1, Math.abs(candle.close - candle.open) * 0.01);
                    const wickHeight = Math.max(0.2, (candle.high - candle.low) * 0.01);
                    const xPos = (index - candles.length / 2) * 0.3;
                    // Centering logic: relative to currentPrice
                    const yPos = (candle.open + candle.close) / 2 * 0.01 - (currentPrice * 0.01);

                    return (
                        <group key={index} position={[xPos, yPos, 0]}>
                            <mesh position={[0, 0, 0]}>
                                <boxGeometry args={[0.02, wickHeight, 0.02]} />
                                <meshBasicMaterial color={isUp ? '#00ffff' : '#ff0066'} opacity={0.3} transparent />
                            </mesh>
                            <mesh position={[0, 0, 0]}>
                                <boxGeometry args={[0.2, bodyHeight, 0.2]} />
                                <meshStandardMaterial
                                    color={isUp ? '#00ffff' : '#ff0066'}
                                    emissive={isUp ? '#00ffff' : '#ff0066'}
                                    emissiveIntensity={isUp ? 1.5 : 0.8}
                                    transparent
                                    opacity={0.9}
                                />
                            </mesh>
                        </group>
                    );
                })}
            </Float>
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={1} />
        </>
    );
}

export default function ThreeDPriceChart({ symbol = 'BTCUSDT', currentPrice: initialPrice = 52000 }: { symbol?: string; currentPrice?: number }) {
    const {
        timeframe,
        setTimeframe,
        historyIndex,
        setHistoryIndex,
        history,
        isPaused,
        setIsPaused
    } = useDashboard();
    const { tick } = useMarket(symbol);
    const [currentPrice, setCurrentPrice] = useState(initialPrice);
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
    const timeframes = ['1m', '5m', '1h', '1d'];

    useEffect(() => {
        if (tick) {
            setCurrentPrice(tick.price);
        }
    }, [tick]);

    const handleSaveAlert = async (alertData: any) => {
        try {
            const response = await fetch('http://localhost:8000/api/alerts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(alertData),
            });
            if (response.ok) {
                console.log("✅ Alert saved successfully");
            } else {
                console.error("❌ Failed to save alert");
            }
        } catch (error) {
            console.error("❌ Error saving alert:", error);
        }
    };

    return (
        <div className="glass-panel w-full h-full relative overflow-hidden group min-h-[400px]">
            <div className="absolute top-6 left-6 z-10">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--cyan)] mb-1">Holographic Price Engine</h3>
                <div className="flex items-center gap-3">
                    <span className="text-2xl font-black text-white tracking-tighter">{symbol}</span>
                    <div className="px-2 py-0.5 rounded bg-[var(--cyan)]/10 border border-[var(--cyan)]/20 text-[8px] font-black text-[var(--cyan)]">LIVE FEED</div>
                </div>
            </div>

            <div className="absolute top-6 right-6 z-10 flex gap-2">
                {timeframes.map((tf) => (
                    <button
                        key={tf}
                        onClick={() => setTimeframe(tf)}
                        className={`px-4 py-1.5 rounded-lg text-[10px] mono border transition-all ${timeframe === tf ? 'bg-[var(--cyan)] text-black border-[var(--cyan)] shadow-[0_0_20px_rgba(0,255,255,0.3)] font-black' : 'bg-black/40 text-gray-500 border-white/5 hover:border-white/20 hover:text-white'}`}
                    >
                        {tf}
                    </button>
                ))}
            </div>

            <ErrorBoundary>
                <Canvas camera={{ position: [0, 0, 15], fov: 40 }}>
                    <Scene key={`${symbol}-${timeframe}-${currentPrice}`} timeframe={timeframe} symbol={symbol} currentPrice={currentPrice} />
                    <OrbitControls enableZoom={true} autoRotate autoRotateSpeed={0.3} />
                </Canvas>
            </ErrorBoundary>

            <div className="absolute bottom-6 right-6 z-10 flex items-center gap-3">
                <button
                    onClick={() => setIsAlertModalOpen(true)}
                    className="p-3 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-gray-400 hover:text-[var(--cyan)] hover:border-[var(--cyan)]/30 transition-all shadow-2xl group"
                >
                    <Bell size={20} className="group-hover:animate-bounce" />
                </button>
                <div className="px-5 py-2.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-xl mono text-[var(--green)] font-black flex items-center gap-3 shadow-2xl">
                    <div className="w-2 h-2 rounded-full bg-[var(--green)] animate-ping" />
                    ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
            </div>

            <div className="absolute bottom-6 left-6 right-32 z-10">
                <TimeMachine
                    currentIndex={historyIndex}
                    maxIndex={history.length - 1}
                    onIndexChange={setHistoryIndex}
                    isPaused={isPaused}
                    setIsPaused={setIsPaused}
                />
            </div>

            <PriceAlertModal
                isOpen={isAlertModalOpen}
                onClose={() => setIsAlertModalOpen(false)}
                symbol={symbol}
                currentPrice={currentPrice}
                onSave={handleSaveAlert}
            />
        </div>
    );
}
