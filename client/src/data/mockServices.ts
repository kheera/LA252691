import { type ServiceSummary } from '../components/ServiceCard/types';

/**
 * Shared mock service list — used by OverviewPage and ServiceDetailPage.
 * Replace with a shared Apollo cache / context once the backend is wired up.
 */
export const mockServices: ServiceSummary[] = [
  { id: 's1', name: 'api-gateway',       status: 'HEALTHY',  uptime: 99.9, lastDeployedAt: '2026-03-20T10:00:00Z', healthTrend: null },
  { id: 's2', name: 'auth-service',      status: 'DEGRADED', uptime: 95.2, lastDeployedAt: '2026-03-19T09:15:00Z', healthTrend: null },
  { id: 's3', name: 'reporting-service', status: 'HEALTHY',  uptime: 98.7, lastDeployedAt: '2026-03-17T08:00:00Z', healthTrend: null },
  { id: 's4', name: 'scheduler',         status: 'DOWN',     uptime: 71.3, lastDeployedAt: '2026-03-21T06:45:00Z', healthTrend: null },
  { id: 's5', name: 'intake-portal',     status: null,       uptime: null,  lastDeployedAt: null,                  healthTrend: null },
];
