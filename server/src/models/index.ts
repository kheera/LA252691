export interface Service {
  id: string;
  name: string;
  status: string | null;
  uptime: number | null;
  lastDeployedAt: string | null;
  healthTrend: string | null;
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
  id: string;
  timestamp: string;
  createdAt: string;
  serviceId: string;
  cpuPercent: number | null;
  memoryMb: number | null;
  requestsPerSecond: number | null;
  errorRate: number | null;
}
