'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

interface Tick {
    symbol: string;
    price: number;
    change_pct: number;
    source: string;
    timestamp: string;
}

interface MarketContextType {
    ticks: Record<string, Tick>;
    subscribe: (symbol: string) => void;
    unsubscribe: (symbol: string) => void;
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

const normalizeSymbol = (s: string) => {
    let clean = s.toUpperCase().replace(/[/_-]/g, '');
    if (clean === 'ETHUSD' || clean === 'BTCUSD' || clean === 'BNBUSD' || clean === 'SOLUSD') {
        return clean + 'T'; // Normalize to USDT for Binance
    }
    return clean;
};

export function MarketProvider({ children }: { children: React.ReactNode }) {
    const [ticks, setTicks] = useState<Record<string, Tick>>({});
    const [subscriptions, setSubscriptions] = useState<Set<string>>(new Set());
    const websocketsRef = useRef<Record<string, WebSocket>>({});

    const subscribe = useCallback((symbol: string) => {
        setSubscriptions(prev => {
            if (prev.has(symbol)) return prev;
            const next = new Set(prev);
            next.add(symbol);
            return next;
        });
    }, []);

    const unsubscribe = useCallback((symbol: string) => {
        setSubscriptions(prev => {
            if (!prev.has(symbol)) return prev;
            const next = new Set(prev);
            next.delete(symbol);
            return next;
        });
    }, []);

    useEffect(() => {
        // Connect to the Realtime service on Port 8001
        const ws = new WebSocket('ws://localhost:8001/ws');

        ws.onopen = () => console.log("Real-time Network Mesh Connected [8001]");

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                // The Maheshwara Realtime broadcasts TICK and TRADE_UPDATE
                if (data.type === 'TICK' || data.price) {
                    const symbol = data.symbol;
                    setTicks(prev => ({
                        ...prev,
                        [symbol]: {
                            symbol: symbol,
                            price: data.price,
                            change_pct: data.change_pct || 0,
                            source: data.source || 'REALTIME',
                            timestamp: data.timestamp || new Date().toISOString()
                        }
                    }));
                }
            } catch (error) {
                console.warn("Real-time parse error:", error);
            }
        };

        ws.onclose = () => {
            console.warn("Real-time Mesh Disconnected. Polling fallback active.");
        };

        return () => ws.close();
    }, []);

    return (
        <MarketContext.Provider value={{ ticks, subscribe, unsubscribe }}>
            {children}
        </MarketContext.Provider>
    );
}

export function useMarket(symbol?: string) {
    const context = useContext(MarketContext);
    if (!context) {
        throw new Error('useMarket must be used within a MarketProvider');
    }

    const { subscribe, unsubscribe } = context;

    useEffect(() => {
        if (symbol) {
            subscribe(symbol);
            return () => unsubscribe(symbol);
        }
    }, [symbol, subscribe, unsubscribe]);

    return {
        tick: symbol ? context.ticks[symbol] : null,
        ticks: context.ticks
    };
}
