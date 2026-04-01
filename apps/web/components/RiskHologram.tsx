'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useDashboard } from '@/lib/DashboardContext';
import ErrorBoundary from './ErrorBoundary';

function Torus({ risk }: { risk: number }) {
    const meshRef = useRef<THREE.Mesh>(null);

    const color = useMemo(() => {
        if (risk < 30) return '#00ffff';
        if (risk < 60) return '#ffff00';
        return '#ff0000';
    }, [risk]);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += 0.01;
            meshRef.current.rotation.y += 0.01;
            const pulseSpeed = risk > 60 ? 10 : 2;
            const pulse = 1 + Math.sin(state.clock.elapsedTime * pulseSpeed) * 0.05;
            meshRef.current.scale.set(pulse, pulse, pulse);
        }
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <mesh ref={meshRef}>
                <torusGeometry args={[2.5, 0.4, 32, 100]} />
                <MeshDistortMaterial
                    color={color}
                    speed={2}
                    distort={0.3}
                    radius={1}
                    emissive={color}
                    emissiveIntensity={2}
                    transparent
                    opacity={0.6}
                />
            </mesh>
        </Float>
    );
}

export default function RiskHologram({ risk, drawdown, var95 }: { risk: number; drawdown: number; var95: number }) {
    const { handleCircuitBreaker } = useDashboard();

    return (
        <div className="glass-panel w-full h-[400px] relative overflow-hidden group">
            <div className="absolute top-4 left-4 z-10">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--purple)]">Neural Risk Sentry</h3>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">PORTFOLIO EXPOSURE ARCHIVE</p>
            </div>

            <ErrorBoundary>
                <Canvas camera={{ position: [0, 0, 10], fov: 35 }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} />
                    <Torus risk={risk} />
                    <OrbitControls enableZoom={false} />
                </Canvas>
            </ErrorBoundary>

            {/* Replacement HUD in HTML for stability */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="text-center space-y-1">
                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Drawdown</div>
                    <div className="text-4xl font-black text-[var(--cyan)] tracking-tighter shadow-cyan-900/20">
                        {drawdown.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%
                    </div>
                    <div className="pt-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        VaR (95%): <span className="text-white">${var95.toLocaleString('en-US')}</span>
                    </div>
                    <div className="text-[9px] text-gray-600 mono">MARGIN USAGE: {(risk * 0.4).toFixed(1)}% • SYSTEM HEALTH: OPTIMAL</div>
                </div>
            </div>

            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 items-end">
                <div className={`px-2 py-1 rounded text-[10px] mono font-bold uppercase ${risk > 60 ? 'bg-red-500/20 text-red-500 border border-red-500/50 animate-pulse' : 'bg-green-500/20 text-[var(--green)] border border-[var(--green)]/50'}`} suppressHydrationWarning>
                    Risk Level: {risk.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%
                </div>

                <button
                    onClick={handleCircuitBreaker}
                    className="pointer-events-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-[0_0_20px_rgba(255,0,0,0.3)] transition-all active:scale-95 border border-red-500/50"
                >
                    Circuit Breaker
                </button>
            </div>
        </div>
    );
}
