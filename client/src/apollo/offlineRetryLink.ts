import { ApolloLink, Observable, type FetchResult } from '@apollo/client';
import { useEffect, useState } from 'react';
import { notifications } from '@mantine/notifications';

const NOTIFICATION_ID = 'apollo-server-offline';

// Backoff delays in ms; the last value is reused for all subsequent retries.
const RETRY_DELAYS_MS = [1_000, 2_000, 4_000, 8_000, 15_000];

// Module-level flag so every concurrent query shares one toast.
let isOffline = false;

// Reactive listeners — components subscribe via useIsServerOffline().
type OfflineListener = (offline: boolean) => void;
const listeners = new Set<OfflineListener>();

function notifyListeners(offline: boolean) {
  listeners.forEach((fn) => fn(offline));
}

function markOffline() {
  if (isOffline) return;
  isOffline = true;
  notifyListeners(true);
  notifications.show({
    id: NOTIFICATION_ID,
    title: 'Server unreachable',
    message: 'Cannot reach the server — retrying in the background…',
    color: 'red',
    loading: true,
    autoClose: false,
    withCloseButton: false,
  });
}

function markOnline() {
  if (!isOffline) return;
  isOffline = false;
  notifyListeners(false);
  notifications.update({
    id: NOTIFICATION_ID,
    title: 'Reconnected',
    message: 'Server connection restored.',
    color: 'teal',
    loading: false,
    autoClose: 3_000,
  });
}

/**
 * React hook that returns true whenever the HTTP server is unreachable.
 * Updates reactively — components re-render as soon as markOffline / markOnline fires.
 */
export function useIsServerOffline(): boolean {
  // Lazy initialiser reads the current module-level flag at render time,
  // so the component starts with the correct value even if the server was
  // already offline before this component first mounted.
  const [offline, setOffline] = useState(() => isOffline);
  useEffect(() => {
    listeners.add(setOffline);
    return () => { listeners.delete(setOffline); };
  }, []);
  return offline;
}

function isNetworkError(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  const msg = err.message.toLowerCase();
  return (
    msg.includes('failed to fetch')
    || msg.includes('network request failed')
    || msg.includes('networkerror')
    || msg.includes('load failed') // Safari
  );
}

/**
 * Apollo link that intercepts network-level failures (server offline / unreachable).
 * - Shows a single persistent toast notification with a loading spinner.
 * - Retries the request with exponential back-off (capped at 15 s).
 * - Clears the toast and shows a "Reconnected" confirmation when the server responds.
 * - Non-network errors (GraphQL errors, 4xx/5xx) pass through unchanged.
 * - Proper cleanup cancels pending retries when the component unmounts.
 *
 * Should be applied to the HTTP branch only (not subscriptions, which manage
 * their own reconnect via graphql-ws retryAttempts / shouldRetry).
 */
export const offlineRetryLink = new ApolloLink((operation, forward) =>
  new Observable<FetchResult>((observer) => {
    let cancelled = false;
    let retryCount = 0;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;
    let currentSub: { unsubscribe: () => void } | null = null;

    function run() {
      if (cancelled) return;
      currentSub = forward(operation).subscribe({
        next(value) {
          markOnline();
          retryCount = 0;
          observer.next(value);
        },
        error(err) {
          if (cancelled) return;
          if (isNetworkError(err)) {
            markOffline();
            const delay = RETRY_DELAYS_MS[Math.min(retryCount, RETRY_DELAYS_MS.length - 1)];
            retryCount += 1;
            retryTimer = setTimeout(run, delay);
          } else {
            // GraphQL errors, auth errors, etc. — let Apollo/components handle them.
            observer.error(err);
          }
        },
        complete() {
          observer.complete();
        },
      });
    }

    run();

    return () => {
      cancelled = true;
      if (retryTimer) clearTimeout(retryTimer);
      currentSub?.unsubscribe();
    };
  }),
);
