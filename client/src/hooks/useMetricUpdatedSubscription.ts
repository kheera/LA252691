import { useState } from 'react';
import { useSubscription } from '@apollo/client/react';
import {
  SUBSCRIBE_METRIC_UPDATES,
  type GqlMetric,
  type MetricUpdatedPayload,
} from '../graphql/services';

import { type WsStatus } from './useWsStatus';

const MAX_LIVE_METRICS = 20;

export type { WsStatus };

interface MetricSubscriptionResult {
  metrics: GqlMetric[];
  wsStatus: WsStatus;
}

/**
 * Subscribes to live metric updates for a single service.
 * The WS subscription opens when the calling component mounts and closes on
 * unmount — demonstrating proper Apollo subscription lifecycle management.
 *
 * Returns live metrics and a wsStatus for rendering a connection indicator.
 */
export function useMetricUpdatedSubscription(serviceId: string): MetricSubscriptionResult {
  const [liveMetrics, setLiveMetrics] = useState<GqlMetric[]>([]);
  const [wsStatus, setWsStatus] = useState<WsStatus>('connecting');

  useSubscription<MetricUpdatedPayload>(SUBSCRIBE_METRIC_UPDATES, {
    variables: { serviceId },
    skip: !serviceId,
    onData: ({ data: subData }) => {
      const metricUpdate = subData.data?.metricUpdated;
      if (!metricUpdate) return;
      const { id, timestamp, cpuPercent, memoryMb, requestsPerSecond, errorRate } = metricUpdate;
      setWsStatus('live');
      setLiveMetrics((prev) => [
        ...prev,
        { id, timestamp, cpuPercent, memoryMb, requestsPerSecond, errorRate },
      ].slice(-MAX_LIVE_METRICS));
    },
    onError: () => setWsStatus('error'),
  });

  return { metrics: liveMetrics, wsStatus };
}
