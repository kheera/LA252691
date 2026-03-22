import { mockServices, mockDeployments, mockMetrics } from '../utils/mockData.js';
import type { Service, Deployment, Metric } from '../models/index.js';

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

function serviceDeployments(parent: { id: string }): Deployment[] {
  return mockDeployments.filter((d) => d.serviceId === parent.id);
}

function triggerDeployment(_: unknown, { serviceId, version }: { serviceId: string; version: string }): Deployment | null {
  console.log('triggerDeployment', { serviceId, version });
  return null;
}

function acknowledgeOutage(_: unknown, { serviceId }: { serviceId: string }): Service | null {
  console.log('acknowledgeOutage', { serviceId });
  return null;
}

export const resolvers = {
  Query: { services, service, deployments, metrics },
  Mutation: { triggerDeployment, acknowledgeOutage },
  Service: { deployments: serviceDeployments },
};
