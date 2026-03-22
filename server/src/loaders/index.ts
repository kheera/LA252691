import DataLoader from 'dataloader';
import type { Deployment, Metric } from '../models/index.js';
import { mockDeployments, mockMetrics } from '../utils/mockData.js';

/**
 * Batch function for DataLoader to load deployments by service IDs. It takes an array of service IDs and
 * returns a Promise that resolves to an array of arrays of Deployments, where each inner array corresponds
 * to the deployments for the respective service ID.
 *
 * Order of results matches the order of input service IDs, ensuring correct mapping when DataLoader resolves the promises.
 */
function batchDeploymentsByServiceId(serviceIds: readonly string[]): Promise<Deployment[][]> {
  return Promise.resolve(
    serviceIds.map((id) => mockDeployments.filter((d) => d.serviceId === id)),
  );
}

export function createDeploymentLoader(): DataLoader<string, Deployment[]> {
  return new DataLoader(batchDeploymentsByServiceId);
}

/**
 * Batch function for DataLoader to load metrics by service IDs.
 */
function batchMetricsByServiceId(serviceIds: readonly string[]): Promise<Metric[][]> {
  return Promise.resolve(
    serviceIds.map((id) => mockMetrics.filter((m) => m.serviceId === id)),
  );
}

export function createMetricLoader(): DataLoader<string, Metric[]> {
  return new DataLoader(batchMetricsByServiceId);
}
