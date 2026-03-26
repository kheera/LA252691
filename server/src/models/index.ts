export type ServiceStatus = 'HEALTHY' | 'DEGRADED' | 'DOWN';
export type HealthTrend = 'IMPROVING' | 'STABLE' | 'DEGRADING';

export interface Service {
  id: string;
  name: string;
  status: ServiceStatus | null;
  uptime: number | null;
  lastDeployedAt: string | null;
  healthTrend?: HealthTrend | null;
}

export type DeploymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'ROLLING_BACK';

export interface Deployment {
  id: string;
  serviceId: string;
  version: string;
  deployedBy: string;
  timestamp: string;
  status: DeploymentStatus | null;
  durationSeconds: number;
}

export interface Metric {
  serviceId: string;
  timestamp: string;
  cpuPercent: number;
  memoryMb: number;
  requestsPerSecond: number;
  errorRate: number;
  healthTrend: HealthTrend | null;
}
