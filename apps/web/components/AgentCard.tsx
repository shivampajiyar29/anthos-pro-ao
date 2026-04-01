'use client';
import { motion } from 'framer-motion';

export default function AgentCard({ agent }) {
    // agent = { name, action, confidence, symbol ... }
    return (
        <motion.div
            className={`p-4 bg-black/40 border border-cyan-500/30 rounded-xl backdrop-blur-md transition-all ${agent.disabled ? 'opacity-50 grayscale' : ''}`}
            whileHover={!agent.disabled ? { scale: 1.05 } : {}}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-cyan-400">{agent.name}</h3>
                    <button
                        className={`w-8 h-4 rounded-full relative transition-colors ${agent.disabled ? 'bg-gray-700' : 'bg-green-500'}`}
                    >
                        <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${agent.disabled ? 'left-0.5' : 'left-4.5'}`} />
                    </button>
                </div>
                <span className="text-xs text-gray-400">{agent.model}</span>
            </div>

            <div className="flex items-center space-x-2 my-3">
                <span className={`px-2 py-1 rounded text-xs font-bold ${agent.disabled ? 'bg-gray-800 text-gray-600' : (agent.action === 'BUY' ? 'bg-green-500/20 text-green-400' :
                    agent.action === 'SELL' ? 'bg-red-500/20 text-red-400' : 'bg-gray-500/20 text-gray-400'
                )}`}>
                    {agent.action}
                </span>
                <span className="text-lg font-mono text-white">{agent.symbol || '---'}</span>
            </div>

            <div className="w-full bg-gray-800 h-1 mt-2 rounded-full overflow-hidden">
                <div
                    className="bg-cyan-500 h-full transition-all duration-500"
                    style={{ width: `${agent.confidence || 0}%` }}
                />
            </div>
            <p className="text-xs text-gray-500 mt-1 text-right">{agent.confidence?.toFixed(1) || '0.0'}% Conviction</p>

            <div className="my-4 px-1">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] text-gray-500 font-bold uppercase">Aggressiveness</span>
                    <span className="text-[10px] text-cyan-500 font-black">{agent.aggressiveness || 50}%</span>
                </div>
                <input
                    type="range"
                    className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    defaultValue={agent.aggressiveness || 50}
                />
            </div>

            <p className="text-xs text-gray-300 mt-1 italic border-t border-gray-700 pt-2">
                "{agent.reasoning}"
            </p>

            {/* Trade Controls */}
            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => console.log(`Manual BUY executed for ${agent.name} on ${agent.symbol}`)}
                    className="flex-1 py-2 bg-[var(--green)]/20 hover:bg-[var(--green)]/30 border border-[var(--green)]/30 rounded-lg text-[10px] font-black text-[var(--green)] transition-all uppercase tracking-widest"
                >
                    Manual Buy
                </button>
                <button
                    onClick={() => console.log(`Manual SELL executed for ${agent.name} on ${agent.symbol}`)}
                    className="flex-1 py-2 bg-[var(--red)]/20 hover:bg-[var(--red)]/30 border border-[var(--red)]/30 rounded-lg text-[10px] font-black text-[var(--red)] transition-all uppercase tracking-widest"
                >
                    Manual Sell
                </button>
            </div>

            {/* RLHF Controls */}
            <div className="flex justify-between items-center mt-3">
                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">RLHF Node</span>
                <div className="flex gap-2">
                    <button className="p-1 px-3 rounded-lg bg-green-500/10 text-gray-500 hover:text-green-400 transition-colors border border-transparent hover:border-green-500/30">👍</button>
                    <button className="p-1 px-3 rounded-lg bg-red-500/10 text-gray-500 hover:text-red-400 transition-colors border border-transparent hover:border-red-500/30">👎</button>
                </div>
            </div>
        </motion.div>
    );
}
