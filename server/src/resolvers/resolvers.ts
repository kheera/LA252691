import { mockServices, mockDeployments, mockMetrics } from '../utils/mockData.js';

function services() {
  return mockServices;
}

function service(_: unknown, { id }: { id: string }) {
  return mockServices.find((s) => s.id === id) ?? null;
}

function deployments(
  _: unknown,
  { serviceId, status, limit }: { serviceId: string; status?: string; limit?: number },
) {
  return mockDeployments
    .filter((d) => d.serviceId === serviceId)
    .filter((d) => !status || d.status === status)
    .slice(0, limit ?? undefined);
}

function metrics(_: unknown, { serviceId, last }: { serviceId: string; last?: number }) {
  return mockMetrics
    .filter((m) => m.serviceId === serviceId)
    .slice(last ? -last : 0);
}

function serviceDeployments(parent: { id: string }) {
  return mockDeployments.filter((d) => d.serviceId === parent.id);
}

export const resolvers = {
  Query: { services, service, deployments, metrics },
  Service: { deployments: serviceDeployments },
};
