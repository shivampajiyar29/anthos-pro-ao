'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Bot, User, Sparkles, X, Minimize2, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', text: "Systems online. I am VishnuLaxmi, your Pro Trading Assistant. How can I help you optimize your portfolio today?" }
    ]);
    const [inputValue, setInputValue] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const userMsg = { role: 'user', text: inputValue };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');

        // Simulate AI Response
        setTimeout(() => {
            let response = "I'm analyzing that request across our active neural nodes. Specifically, I'm tracking a 2.4% increase in sell-side delta for your core positions.";
            if (inputValue.toLowerCase().includes('risk')) {
                response = "Current portfolio risk is 0.35. Our Value at Risk (95%) is $2,450. I've noted a slight divergence in Sentinel's hedging strategy, but we are well within safety parameters.";
            } else if (inputValue.toLowerCase().includes('top trades')) {
                response = "Today's top performer is Strategist (+3.2% PnL) with the AAPL $175.42 entry. We've captured 12 successful scalps so far.";
            }
            setMessages(prev => [...prev, { role: 'assistant', text: response }]);
        }, 1000);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100]">
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 20 }}
                        onClick={() => setIsOpen(true)}
                        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white shadow-2xl shadow-cyan-500/20 hover:scale-110 transition-transform group"
                    >
                        <Bot size={28} className="group-hover:animate-pulse" />
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-[#0a0a0a] rounded-full animate-ping" />
                    </motion.button>
                )}

                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.9 }}
                        className={`glass-panel border-2 border-cyan-500/30 flex flex-col overflow-hidden transition-all duration-300 ${isMinimized ? 'h-14 w-64' : 'h-[500px] w-[380px]'}`}
                    >
                        {/* Header */}
                        <div className="p-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Sparkles size={16} className="text-cyan-400" />
                                <span className="text-xs font-black text-white uppercase tracking-widest">VishnuLaxmi AI Pro</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setIsMinimized(!isMinimized)} className="text-gray-500 hover:text-white transition-all">
                                    {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
                                </button>
                                <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-red-500 transition-all">
                                    <X size={14} />
                                </button>
                            </div>
                        </div>

                        {!isMinimized && (
                            <>
                                {/* Chat Area */}
                                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
                                    {messages.map((msg, i) => (
                                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[80%] p-3 rounded-2xl text-[11px] leading-relaxed ${msg.role === 'user'
                                                    ? 'bg-cyan-500/20 text-cyan-50 border border-cyan-500/30 rounded-tr-none'
                                                    : 'bg-white/5 text-gray-300 border border-white/10 rounded-tl-none font-medium'
                                                }`}>
                                                {msg.text}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Input Area */}
                                <div className="p-4 bg-white/5 border-t border-white/5">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                            placeholder="Ask VishnuLaxmi..."
                                            className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-4 pr-12 text-xs text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                                        />
                                        <button
                                            onClick={handleSend}
                                            className="absolute right-2 top-1.5 p-1 text-cyan-400 hover:text-cyan-300 transition-all"
                                        >
                                            <Send size={18} />
                                        </button>
                                    </div>
                                    <div className="mt-2 flex gap-2">
                                        <button
                                            onClick={() => setInputValue("Summarize today's top trades.")}
                                            className="text-[8px] font-black text-gray-500 uppercase tracking-widest hover:text-purple-400 transition-all"
                                        >
                                            #TopTrades
                                        </button>
                                        <button
                                            onClick={() => setInputValue("Analyze risk exposure.")}
                                            className="text-[8px] font-black text-gray-500 uppercase tracking-widest hover:text-cyan-400 transition-all"
                                        >
                                            #RiskCheck
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
