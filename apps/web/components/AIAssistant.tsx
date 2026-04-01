"use client";

import React, { useState } from 'react';
import { Bot, Send, Sparkles, Wand2, Info } from 'lucide-react';
import api from '@/lib/api';

const AIAssistant = () => {
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [explanation, setExplanation] = useState('');

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            // Simulated AI Call
            const response = await api.post('/strategy-dsl/validate', {
                name: "AI Strategy",
                legs: [
                    { instrument_prefix: "NIFTY", side: "SELL", quantity: 50, option_type: "CE", exit_rule: { stop_loss_pct: 20 } },
                    { instrument_prefix: "NIFTY", side: "SELL", quantity: 50, option_type: "PE", exit_rule: { stop_loss_pct: 20 } }
                ]
            });
            
            // Simulating an explanation response
            setExplanation(`### AI Strategy Generated
This strategy is an **Intraday Short Straddle** on NIFTY.
It involves selling both ATM Call and Put options with a strict **20% Stop Loss** on each leg.
            `);
        } catch (error) {
            console.error("AI Generation failed", error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col h-[600px]">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-blue-600/5">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-900/40">
                        <Bot size={20} className="text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-sm">AI Strategy Assistant</h3>
                        <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">GPT-4 Turbo Enabled</p>
                    </div>
                </div>
                <Sparkles size={18} className="text-amber-400 animate-pulse" />
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-6">
                {!explanation ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 px-12">
                        <div className="p-4 bg-slate-800 rounded-3xl">
                            <Wand2 size={32} className="text-slate-600" />
                        </div>
                        <h4 className="text-white font-bold text-lg">What strategy are you thinking of?</h4>
                        <p className="text-sm text-slate-500">
                            Describe your strategy in plain English (e.g., "Sell a 9:20 Nifty Straddle with 25% SL") and I'll build the code for you.
                        </p>
                    </div>
                ) : (
                    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 prose prose-invert prose-sm max-w-none animate-in fade-in slide-in-from-bottom-2">
                        <div className="flex items-center gap-2 mb-4 text-blue-400">
                            <Info size={16} />
                            <span className="text-xs font-bold uppercase tracking-widest">Strategy Breakdown</span>
                        </div>
                        <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                            {explanation}
                        </div>
                    </div>
                )}
            </div>

            <div className="p-6 bg-slate-950/50 border-t border-slate-800">
                <div className="relative group">
                    <textarea 
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Type your strategy instructions..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-2xl py-4 pl-4 pr-16 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all resize-none h-24"
                    />
                    <button 
                        onClick={handleGenerate}
                        disabled={!prompt || isGenerating}
                        className="absolute right-3 bottom-3 p-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white rounded-xl transition-all shadow-lg shadow-blue-900/20"
                    >
                        {isGenerating ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send size={20} />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AIAssistant;
