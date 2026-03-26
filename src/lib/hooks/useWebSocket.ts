'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseWebSocketOptions {
  url?: string;
  reconnectAttempts?: number;
  reconnectInterval?: number;
}

interface UseWebSocketReturn {
  isConnected: boolean;
  lastMessage: unknown | null;
  sendMessage: (message: unknown) => void;
}

export function useWebSocket(options: UseWebSocketOptions = {}): UseWebSocketReturn {
  const { 
    reconnectAttempts = 5, 
    reconnectInterval = 3000 
  } = options;
  
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<unknown | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectCountRef = useRef(0);

  const connect = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    const wsUrl = options.url || `ws://${window.location.host}/api/socket`;
    
    try {
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        setIsConnected(true);
        reconnectCountRef.current = 0;
      };
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLastMessage(data);
        } catch {
          setLastMessage(event.data);
        }
      };
      
      ws.onclose = () => {
        setIsConnected(false);
        
        if (reconnectCountRef.current < reconnectAttempts) {
          reconnectCountRef.current += 1;
          setTimeout(connect, reconnectInterval);
        }
      };
      
      ws.onerror = () => {
        ws.close();
      };
      
      wsRef.current = ws;
    } catch {
      setIsConnected(false);
    }
  }, [options.url, reconnectAttempts, reconnectInterval]);

  useEffect(() => {
    connect();
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  const sendMessage = useCallback((message: unknown) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  }, []);

  return { isConnected, lastMessage, sendMessage };
}

export function useStockSimulation(initialStock: number) {
  const [stock, setStock] = useState(initialStock);

  useEffect(() => {
    const interval = setInterval(() => {
      setStock(prev => {
        const change = Math.random() > 0.7 ? Math.floor(Math.random() * 3) - 1 : 0;
        return Math.max(0, prev + change);
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return stock;
}
