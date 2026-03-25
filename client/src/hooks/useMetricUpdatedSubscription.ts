import { useState } from 'react';
import { useSubscription } from '@apollo/client/react';
import {
  SUBSCRIBE_METRIC_UPDATES,
  type GqlMetric,
  type MetricUpdatedPayload,
} from '../graphql/services';

const MAX_LIVE_METRICS = 20;

/**
 * Subscribes to live metric updates for a single service.
 * The WS subscription opens when the calling component mounts and closes on
 * unmount — demonstrating proper Apollo subscription lifecycle management.
 *
 * Returns live metrics streamed from the server every 10 s.
 */
export function useMetricUpdatedSubscription(serviceId: string): GqlMetric[] {
  const [liveMetrics, setLiveMetrics] = useState<GqlMetric[]>([]);

  useSubscription<MetricUpdatedPayload>(SUBSCRIBE_METRIC_UPDATES, {
    variables: { serviceId },
    skip: !serviceId,
    onData: ({ data: subData }) => {
      const metricUpdate = subData.data?.metricUpdated;
      if (!metricUpdate) return;
      const { id, timestamp, cpuPercent, memoryMb, requestsPerSecond, errorRate } = metricUpdate;
      setLiveMetrics((prev) => [
        ...prev,
        { id, timestamp, cpuPercent, memoryMb, requestsPerSecond, errorRate },
      ].slice(-MAX_LIVE_METRICS));
    },
  });

  return liveMetrics;
}
