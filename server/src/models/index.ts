export type ServiceStatus = 'HEALTHY' | 'DEGRADED' | 'DOWN';

export interface Service {
  id: string;
  name: string;
  status: ServiceStatus | null;
  uptime: number | null;
  lastDeployedAt: string | null;
  healthTrend?: string | null;
}

export interface Deployment {
  id: string;
  serviceId: string;
  version: string;
  deployedBy: string;
  timestamp: string;
  status: string | null;
  durationSeconds: number;
}

export interface Metric {
  serviceId: string;
  timestamp: string;
  cpuPercent: number;
  memoryMb: number;
  requestsPerSecond: number;
  errorRate: number;
}
