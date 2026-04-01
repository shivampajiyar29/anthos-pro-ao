'use client';

import React, { useState } from 'react';
import { Settings as SettingsIcon, Shield, Cpu, Bell, Globe, Key, AlertCircle } from 'lucide-react';

interface SettingsProps {
    isLiveMode: boolean;
    setIsLiveMode: (val: boolean) => void;
    apiKeys: Record<string, string>;
    onUpdateApiKey: (broker: string, key: string) => void;
}

export default function Settings({ isLiveMode, setIsLiveMode, apiKeys, onUpdateApiKey }: SettingsProps) {
    const [editingBroker, setEditingBroker] = useState<string | null>(null);
    const [tempKey, setTempKey] = useState('');

    const handleSaveKey = () => {
        if (editingBroker) {
            onUpdateApiKey(editingBroker, tempKey);
            setEditingBroker(null);
            setTempKey('');
        }
    };

    return (
        <div className="glass-panel p-8 max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30">
                        <SettingsIcon size={24} className="text-cyan-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tighter">System Configuration</h2>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Global Parameters & Node Security</p>
                    </div>
                </div>

                {/* Live Mode Toggle */}
                <div className="flex items-center gap-4 p-2 bg-black/40 border border-white/10 rounded-2xl">
                    <button
                        onClick={() => setIsLiveMode(false)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!isLiveMode ? 'bg-[var(--glass-border)] text-white' : 'text-gray-500 hover:text-white'}`}
                    >
                        Paper Trading
                    </button>
                    <button
                        onClick={() => setIsLiveMode(true)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isLiveMode ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.3)]' : 'text-gray-500 hover:text-white'}`}
                    >
                        Live Production
                    </button>
                </div>
            </div>

            {isLiveMode && (
                <div className="p-4 bg-red-600/10 border border-red-500/30 rounded-xl flex items-center gap-4 animate-pulse">
                    <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
                    <div className="text-[10px] font-bold text-red-500 uppercase tracking-widest leading-relaxed">
                        WARNING: Live Production Mode Active. All agents are currently authorized to execute real capital trades using configured API keys.
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Broker Connections */}
                <div className="space-y-4">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                        <Globe size={16} className="text-purple-400" />
                        Broker Integration
                    </h3>
                    <div className="space-y-3">
                        {Object.keys(apiKeys).map(broker => (
                            <div key={broker} className={`flex items-center justify-between p-3 bg-white/5 rounded-xl border transition-all ${editingBroker === broker ? 'border-purple-500' : 'border-white/5 group hover:border-purple-500/30'}`}>
                                <div className="space-y-1">
                                    <span className="text-xs font-bold text-gray-300">{broker}</span>
                                    {apiKeys[broker] && (
                                        <div className="text-[8px] mono text-purple-400">••••••••{apiKeys[broker].slice(-4)}</div>
                                    )}
                                </div>
                                <button
                                    onClick={() => {
                                        setEditingBroker(broker);
                                        setTempKey(apiKeys[broker]);
                                    }}
                                    className="text-[10px] font-black text-purple-400 uppercase tracking-widest hover:text-white"
                                >
                                    {apiKeys[broker] ? 'Update' : 'Configure'}
                                </button>
                            </div>
                        ))}
                    </div>

                    {editingBroker && (
                        <div className="p-4 bg-black/60 border border-purple-500/50 rounded-xl space-y-3">
                            <label className="text-[9px] font-black text-white uppercase tracking-widest">Enter API Key for {editingBroker}</label>
                            <input
                                type="password"
                                value={tempKey}
                                onChange={(e) => setTempKey(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-xs mono text-purple-400"
                                placeholder="sk-..."
                            />
                            <div className="flex gap-2">
                                <button onClick={handleSaveKey} className="flex-1 py-2 bg-purple-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest">Apply Key</button>
                                <button onClick={() => setEditingBroker(null)} className="px-4 py-2 text-gray-500 hover:text-white text-[10px] font-black uppercase tracking-widest">Cancel</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Agent Hyperparameters */}
                <div className="space-y-4">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                        <Cpu size={16} className="text-cyan-400" />
                        Neural Parameters
                    </h3>
                    <div className="space-y-6 p-4 bg-white/5 rounded-xl border border-white/5">
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-bold">
                                <span className="text-gray-500 uppercase">Global Temperature</span>
                                <span className="text-cyan-400">0.72</span>
                            </div>
                            <input type="range" className="w-full accent-cyan-500" defaultValue={72} />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-bold">
                                <span className="text-gray-500 uppercase">Top-P Sampling</span>
                                <span className="text-cyan-400">0.90</span>
                            </div>
                            <input type="range" className="w-full accent-cyan-500" defaultValue={90} />
                        </div>
                    </div>
                </div>

                {/* API Keys & Secrets */}
                <div className="space-y-4">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                        <Key size={16} className="text-yellow-400" />
                        Encryption & Keys
                    </h3>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-4">
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-gray-500 uppercase">Primary API Node</label>
                            <input type="password" value="••••••••••••••••" readOnly className="w-full bg-black/40 border border-white/5 rounded-lg p-2 text-xs mono text-yellow-500" />
                        </div>
                        <button className="w-full py-2 bg-yellow-500/10 text-yellow-500 border border-yellow-500/30 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-yellow-500 hover:text-black transition-all">
                            Rotate Session Keys
                        </button>
                    </div>
                </div>

                {/* Notifications */}
                <div className="space-y-4">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                        <Bell size={16} className="text-green-400" />
                        Alert Protocols
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        {['Telegram', 'Email', 'SMS', 'Webhooks'].map(notif => (
                            <div key={notif} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 transition-all hover:border-green-500/30">
                                <span className="text-xs font-bold text-gray-300">{notif}</span>
                                <div className="w-4 h-4 rounded bg-green-500/20 border border-green-500/50 flex items-center justify-center">
                                    <div className="w-2 h-2 bg-green-500 rounded-sm" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="pt-8 border-t border-white/5 flex justify-end gap-4">
                <button className="px-8 py-3 rounded-xl text-xs font-black text-gray-500 hover:text-white transition-all uppercase tracking-widest">Reset Defaults</button>
                <button
                    onClick={() => {
                        const btn = document.activeElement as HTMLButtonElement;
                        btn.innerText = "Applying...";
                        setTimeout(() => {
                            btn.innerText = "Applied Successfully";
                            setTimeout(() => btn.innerText = "Apply Changes", 2000);
                        }, 1500);
                    }}
                    className="px-8 py-3 rounded-xl bg-cyan-500 text-black text-xs font-black uppercase tracking-widest hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20"
                >
                    Apply Changes
                </button>
            </div>
        </div>
    );
}
