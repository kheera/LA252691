import { useEffect, useRef, useState } from 'react';
import { useSubscription } from '@apollo/client/react';
import {
  SUBSCRIBE_METRIC_UPDATES,
  type GqlMetric,
  type MetricUpdatedPayload,
} from '../graphql/services';

/** How often the server emits (and the chart should advance), in ms. */
const TICK_MS = 5_000;
/** Maximum number of live metric readings to keep in memory for the chart rolling window. */
const MAX_LIVE_METRICS = 20;

/** Pre-fill the rolling window with null-value placeholders so the chart always
 * has MAX_LIVE_METRICS evenly-spaced x-axis slots from the moment it mounts. */
function makePlaceholders(serviceId: string): GqlMetric[] {
  const now = Date.now();
  return Array.from({ length: MAX_LIVE_METRICS }, (_, i) => ({
    serviceId,
    timestamp: new Date(now - (MAX_LIVE_METRICS - 1 - i) * TICK_MS).toISOString(),
    cpuPercent: null,
    memoryMb: null,
    requestsPerSecond: null,
    errorRate: null,
    healthTrend: null,
  }));
}

export interface MetricSubscriptionResult {
  liveMetrics: GqlMetric[];
  /** True once the first metric arrives — use to show a loading state before that. */
  isReady: boolean;
  /** Set when the subscription itself errors (distinct from WS connection errors). */
  subscriptionError: string | null;
}

/**
 * Subscribes to live metric updates for a single service.
 *
 * A TICK_MS interval unconditionally advances the chart every tick: it consumes
 * the latest buffered metric from the subscription if one arrived, or appends a
 * null-value gap entry if the service was silent. This keeps the x-axis scrolling
 * at a steady cadence regardless of whether data is flowing.
 */
export function useMetricUpdatedSubscription(serviceId: string): MetricSubscriptionResult {
  const [liveMetrics, setLiveMetrics] = useState<GqlMetric[]>(() => makePlaceholders(serviceId));
  const [isReady, setIsReady] = useState(false);
  const [subscriptionError, setSubscriptionError] = useState<string | null>(null);

  // Latest metric received since the last tick — consumed and cleared by the interval.
  const pendingRef = useRef<GqlMetric | null>(null);

  useSubscription<MetricUpdatedPayload>(SUBSCRIBE_METRIC_UPDATES, {
    variables: { serviceId },
    skip: !serviceId,
    onData: ({ data: subData }) => {
      const metricUpdate = subData.data?.metricUpdated;
      if (!metricUpdate) return;
      setSubscriptionError(null);
      setIsReady(true);
      const { timestamp, cpuPercent, memoryMb, requestsPerSecond, errorRate, healthTrend } = metricUpdate;
      // Buffer for the interval to pick up — don't write to state directly so
      // only the interval drives chart updates and the cadence stays constant.
      pendingRef.current = { serviceId, timestamp, cpuPercent, memoryMb, requestsPerSecond, errorRate, healthTrend };
    },
    onError: (err) => {
      setSubscriptionError(err.message);
    },
  });

  // Advance the chart every TICK_MS regardless of whether subscription data arrived.
  // Consumes the buffered metric if present, otherwise appends a null gap so the
  // line breaks cleanly rather than the chart freezing when the service goes quiet.
  useEffect(() => {
    const intervalId = setInterval(() => {
      const next: GqlMetric = pendingRef.current ?? {
        serviceId,
        timestamp: new Date().toISOString(),
        cpuPercent: null,
        memoryMb: null,
        requestsPerSecond: null,
        errorRate: null,
        healthTrend: null,
      };
      pendingRef.current = null;
      setLiveMetrics((prev) => [...prev, next].slice(-MAX_LIVE_METRICS));
    }, TICK_MS);
    return () => clearInterval(intervalId);
  }, [serviceId]);

  return { liveMetrics, isReady, subscriptionError };
}
