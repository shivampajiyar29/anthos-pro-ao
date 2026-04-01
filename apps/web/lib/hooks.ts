import { useEffect, useState } from 'react';
import io from 'socket.io-client';

// Use env var or default to localhost
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8001';

export function useDashboardSocket() {
  const [socket, setSocket] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    // Note: This assumes the backend has a Socket.IO compatible wrapper or we use native WebSocket
    // Providing a native WebSocket implementation for the FastAPI backend we built
    const ws = new WebSocket(`${WS_URL.replace('http', 'ws')}/ws`);

    ws.onopen = () => console.log("Connected to Maheshwara Brain 🧠");
    ws.onmessage = (event) => {
        try {
            const parsed = JSON.parse(event.data);
            setData(parsed);
        } catch (e) {
            console.error("Parse error", e);
        }
    };

    setSocket(ws);

    return () => {
        ws.close();
    };
  }, []);

  return { socket, data };
}
