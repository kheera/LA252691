import { useState, useEffect } from 'react';
import { wsClient } from '../apollo/client';

export type WsStatus = 'connecting' | 'live' | 'error';

/**
 * Subscribes to the singleton graphql-ws client's connection events and
 * returns the current connection state. Any component can call this without
 * prop drilling or React context — they all share the same underlying socket.
 */
export function useWsStatus(): WsStatus {
  const [status, setStatus] = useState<WsStatus>('connecting');

  useEffect(() => {
    const unsubscribeFns = [
      wsClient.on('connected', () => setStatus('live')),
      wsClient.on('closed', () => setStatus('error')),
      wsClient.on('error', () => setStatus('error')),
    ];
    return () => unsubscribeFns.forEach((unsubscribe) => unsubscribe());
  }, []);

  return status;
}
