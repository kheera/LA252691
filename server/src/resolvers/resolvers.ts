import { randomUUID } from 'node:crypto';
import { mockServices, mockDeployments, mockMetrics, persistFixtures } from '../utils/mockData.js';
import type { Service, Deployment, Metric } from '../models/index.js';
import type { AppContext } from '../context.js';

function services(): Service[] {
  return mockServices;
}

function service(_: unknown, { id }: { id: string }): Service | null {
  return mockServices.find((s) => s.id === id) ?? null;
}

function deployments(
  _: unknown,
  { serviceId, status, limit }: { serviceId: string; status?: string; limit?: number },
): Deployment[] {
  return mockDeployments
    .filter((d) => d.serviceId === serviceId)
    .filter((d) => !status || d.status === status)
    .slice(0, limit ?? undefined);
}

function metrics(_: unknown, { serviceId, last }: { serviceId: string; last?: number }): Metric[] {
  return mockMetrics
    .filter((m) => m.serviceId === serviceId)
    .slice(last ? -last : 0);
}

/**
 * Uses DataLoader to batch and cache deployments by service ID, avoiding N+1 query issues when fetching deployments for multiple services in the Service resolver.
 * Assumes deployments are stored in ascending chronological order (oldest first), so slice(-last) returns
 * the most recent `last` entries. With a real DB this would be: ORDER BY timestamp DESC LIMIT $last.
 */
function batchDeploymentsLoader(parent: { id: string }, { last }: { last?: number }, context: AppContext): Promise<Deployment[]> {
  return context.deploymentLoader.load(parent.id).then((all) => (last ? all.slice(-last) : all));
}

/**
 * Uses DataLoader to batch and cache metrics by service ID, with optional `last` argument to limit results.
 * Assumes metrics are stored in ascending chronological order (oldest first), so slice(-last) returns the
 * most recent `last` entries.
 */
function batchMetricsLoader(
  parent: { id: string },
  { last }: { last?: number },
  context: AppContext,
): Promise<Metric[]> {
  return context.metricLoader.load(parent.id).then((all) => (last ? all.slice(-last) : all));
}

function triggerDeployment(_: unknown, { serviceId, version }: { serviceId: string; version: string }): Deployment | null {
  const service = mockServices.find((s) => s.id === serviceId);
  if (!service) return null;

  const now = new Date().toISOString();
  const newDeployment: Deployment = {
    id: randomUUID(),
    serviceId,
    version,
    deployedBy: 'manual',
    timestamp: now,
    status: 'SUCCESS',
    durationSeconds: 0,
  };

  mockDeployments.unshift(newDeployment); // newest-first, matching fixture ordering
  service.lastDeployedAt = now;
  persistFixtures();

  return newDeployment;
}

function acknowledgeOutage(_: unknown, { serviceId }: { serviceId: string }): Service | null {
  console.log('acknowledgeOutage', { serviceId });
  return null;
}

export const resolvers = {
  Query: { services, service, deployments, metrics },
  Mutation: { triggerDeployment, acknowledgeOutage },
  Service: { deployments: batchDeploymentsLoader, metrics: batchMetricsLoader },
};
