"use client";

import { useEffect, useRef, useState, useCallback } from 'react';

interface WebSocketMessage {
    channel?: string;
    type?: string;
    data?: any;
    [key: string]: any;
}


export const useWebSocket = (url: string = process.env.NEXT_PUBLIC_WS_URL ? `${process.env.NEXT_PUBLIC_WS_URL}/ws/updates` : 'ws://localhost:8000/ws/updates') => {

    const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const connect = useCallback(() => {
        if (socketRef.current?.readyState === WebSocket.OPEN) return;

        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const authenticatedUrl = token ? `${url}${url.includes('?') ? '&' : '?'}token=${token}` : url;
        
        const socket = new WebSocket(authenticatedUrl);


        socket.onopen = () => {
            console.log('WebSocket Connected');
            setIsConnected(true);
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
                reconnectTimeoutRef.current = null;
            }
        };

        socket.onmessage = (event) => {
            try {
                const message: WebSocketMessage = JSON.parse(event.data);
                setLastMessage(message);
            } catch (err) {
                console.error('Failed to parse WebSocket message', err);
            }
        };

        socket.onclose = () => {
            console.log('WebSocket Disconnected');
            setIsConnected(false);
            // Reconnect logic
            reconnectTimeoutRef.current = setTimeout(() => {
                console.log('Attempting to reconnect...');
                connect();
            }, 3000);
        };

        socket.onerror = (error) => {
            console.error('WebSocket Error', error);
            socket.close();
        };

        socketRef.current = socket;
    }, [url]);

    useEffect(() => {
        connect();
        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };
    }, [connect]);

    const sendMessage = useCallback((message: any) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify(message));
        }
    }, []);

    return { lastMessage, isConnected, sendMessage };
};
