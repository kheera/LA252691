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
  { serviceId, status, limit }: { serviceId?: string; status?: string; limit?: number },
): Deployment[] {
  return mockDeployments
    .filter((d) => !serviceId || d.serviceId === serviceId)
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
  const isBeta = /-beta\d*$/i.test(version);

  // Simulate deployment risk: beta builds are more likely to fail
  const BETA_FAILURE_RATE = 0.75; // 75% chance of failure
  const STABLE_FAILURE_RATE = 0.20; // 20% chance of failure
  const failureRate = isBeta ? BETA_FAILURE_RATE : STABLE_FAILURE_RATE;
  const failed = Math.random() < failureRate;
  const newDeployment: Deployment = {
    id: randomUUID(),
    serviceId,
    version,
    deployedBy: 'manual',
    timestamp: now,
    status: failed ? 'FAILED' : 'SUCCESS',
    durationSeconds: failed ? Math.floor(Math.random() * 20) + 5 : Math.floor(Math.random() * 60) + 30,
  };

  mockDeployments.push(newDeployment); // append to end, keeping the array oldest-first so DataLoader's slice(-last) returns the most recent N
  if (failed) {
    service.status = 'DOWN';
  } else {
    service.lastDeployedAt = now;
  }
  persistFixtures();

  return newDeployment;
}

function acknowledgeOutage(_: unknown, { serviceId }: { serviceId: string }): Service | null {
  const service = mockServices.find((s) => s.id === serviceId);
  if (!service) return null;

  service.status = 'DEGRADED';
  persistFixtures();

  return service;
}

export const resolvers = {
  Query: { services, service, deployments, metrics },
  Mutation: { triggerDeployment, acknowledgeOutage },
  Service: { deployments: batchDeploymentsLoader, metrics: batchMetricsLoader },
};
