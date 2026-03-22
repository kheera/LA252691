import type { Service, Deployment, Metric } from '../models/index.js';

export const mockDeployments: Deployment[] = [
  {
    id: 'd1',
    serviceId: 's1',
    version: '1.2.0',
    deployedBy: 'alice',
    timestamp: '2026-03-20T10:00:00Z',
    status: 'SUCCESS',
    durationSeconds: 42,
  },
  {
    id: 'd2',
    serviceId: 's1',
    version: '1.1.0',
    deployedBy: 'bob',
    timestamp: '2026-03-18T14:30:00Z',
    status: 'FAILED',
    durationSeconds: 15,
  },
  {
    id: 'd3',
    serviceId: 's2',
    version: '2.0.1',
    deployedBy: 'alice',
    timestamp: '2026-03-19T09:15:00Z',
    status: 'SUCCESS',
    durationSeconds: 67,
  },
];

export const mockMetrics: Metric[] = [
  {
    id: 'm1',
    timestamp: '2026-03-21T12:00:00Z',
    createdAt: '2026-03-21T12:00:00Z',
    serviceId: 's1',
    cpuPercent: 23.4,
    memoryMb: 512.0,
    requestsPerSecond: 140.2,
    errorRate: 0.5,
  },
  {
    id: 'm2',
    timestamp: '2026-03-21T11:00:00Z',
    createdAt: '2026-03-21T11:00:00Z',
    serviceId: 's1',
    cpuPercent: 31.1,
    memoryMb: 528.5,
    requestsPerSecond: 155.8,
    errorRate: 1.2,
  },
  {
    id: 'm3',
    timestamp: '2026-03-21T12:00:00Z',
    createdAt: '2026-03-21T12:00:00Z',
    serviceId: 's2',
    cpuPercent: 10.0,
    memoryMb: 256.0,
    requestsPerSecond: 42.5,
    errorRate: 0.0,
  },
];

export const mockServices: Service[] = [
  {
    id: 's1',
    status: 'HEALTHY',
    uptime: 99.9,
    lastDeployedAt: '2026-03-20T10:00:00Z',
    healthTrend: null,
  },
  {
    id: 's2',
    status: 'DEGRADED',
    uptime: 95.2,
    lastDeployedAt: '2026-03-19T09:15:00Z',
    healthTrend: null,
  },
  {
    id: 's3',
    status: null,
    uptime: null,
    lastDeployedAt: null,
    healthTrend: null,
  },
];
