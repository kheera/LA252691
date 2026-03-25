import { randomUUID } from 'node:crypto';
import { mockServices } from './utils/mockData.js';
import { pubsub, EVENTS } from './pubsub.js';

const INTERVAL_MS = 10_000;

function rand(min: number, max: number, decimals = 1): number {
  const value = Math.random() * (max - min) + min;
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

/**
 * Starts a 10-second interval that publishes a ServiceMetricUpdate for every
 * service. Subscribers filter by serviceId via withFilter in the resolver, so
 * each client only receives metrics for the service it is viewing.
 *
 * Metrics are not persisted — they are ephemeral live data only.
 */
export function startMetricTicker(): void {
  setInterval(() => {
    const timestamp = new Date().toISOString();
    for (const service of mockServices) {
      pubsub.publish(EVENTS.METRIC_UPDATED, {
        metricUpdated: {
          id: randomUUID(),
          serviceId: service.id,
          timestamp,
          cpuPercent: rand(5, 85),
          memoryMb: rand(150, 750, 0),
          requestsPerSecond: rand(10, 200, 1),
          errorRate: rand(0, 3, 2),
        },
      });
    }
  }, INTERVAL_MS);
}
