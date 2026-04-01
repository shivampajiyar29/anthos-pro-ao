'use client';

import React from 'react';
import { History, Play, Pause, FastForward } from 'lucide-react';

interface TimeMachineProps {
    currentIndex: number;
    maxIndex: number;
    onIndexChange: (index: number) => void;
    isPaused: boolean;
    setIsPaused: (paused: boolean) => void;
}

export default function TimeMachine({
    currentIndex,
    maxIndex,
    onIndexChange,
    isPaused,
    setIsPaused
}: TimeMachineProps) {
    return (
        <div className="glass-panel px-6 py-4 flex flex-col gap-3 relative overflow-hidden group">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[var(--purple)]/20 flex items-center justify-center border border-[var(--purple)]/30">
                        <History size={16} className="text-[var(--purple)]" />
                    </div>
                    <div>
                        <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Time Machine</h3>
                        <p className="text-[8px] text-gray-500 font-bold uppercase">TEMPORAL REPLAY ENGINE</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsPaused(!isPaused)}
                        className="p-1.5 rounded bg-black/40 border border-[var(--glass-border)] text-gray-400 hover:text-white transition-all"
                    >
                        {isPaused ? <Play size={12} fill="currentColor" /> : <Pause size={12} fill="currentColor" />}
                    </button>
                    <button
                        onClick={() => onIndexChange(maxIndex)}
                        className="p-1.5 rounded bg-black/40 border border-[var(--glass-border)] text-gray-400 hover:text-white transition-all group"
                        title="Jump to Live"
                    >
                        <FastForward size={12} className="group-hover:scale-110 transition-transform" />
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <span className="mono text-[10px] text-gray-500 font-bold w-12">- {maxIndex - currentIndex}s</span>
                <div className="flex-1 relative h-6 flex items-center">
                    <input
                        type="range"
                        min="0"
                        max={maxIndex}
                        value={currentIndex}
                        onChange={(e) => onIndexChange(parseInt(e.target.value))}
                        className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[var(--purple)]"
                    />
                    <div
                        className="absolute h-1 bg-gradient-to-r from-[var(--purple)]/20 to-[var(--purple)] rounded-lg pointer-events-none"
                        style={{ width: `${maxIndex > 0 ? (currentIndex / maxIndex) * 100 : 0}%` }}
                    />
                </div>
                <span className="mono text-[10px] text-[var(--purple)] font-bold w-12">LIVE</span>
            </div>
        </div>
    );
}
