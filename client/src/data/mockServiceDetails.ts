export type DeploymentStatus = 'success' | 'failed' | 'in_progress' | 'rolled_back';

export interface Deployment {
  id: string;
  version: string;
  status: DeploymentStatus;
  triggeredBy: string;
  commitSha: string;
  durationSeconds: number;
  deployedAt: string;
}

export interface MetricPoint {
  time: string;
  cpu: number;
  memory: number;
}

export interface CurrentMetrics {
  cpu: number;
  memory: number;
  requestRate: number;
  errorRate: number;
  p99Latency: number;
}

export interface ServiceDetail {
  environment: string;
  region: string;
  version: string;
  owner: string;
  currentMetrics: CurrentMetrics;
  metrics: MetricPoint[];
  deployments: Deployment[];
}

// Deterministic variation arrays — no Math.random() so values are stable across reloads.
const CPU_VAR = [0, 2, -1, 3, -2, 4, 1, -3, 5, -1, 2, -4, 3, 1, -2, 4, -1, 3, -3, 2];
const MEM_VAR = [1, -1, 2, -2, 3, -1, 0, 2, -3, 1, -2, 3, -1, 0, 2, -2, 1, -1, 3, -3];

function makeMetrics(cpuBase: number, memBase: number): MetricPoint[] {
  return CPU_VAR.map((cpuOff, i) => ({
    time: `15:${String(i + 1).padStart(2, '0')}`,
    cpu: Math.max(0, Math.min(100, cpuBase + cpuOff)),
    memory: Math.max(0, Math.min(100, memBase + MEM_VAR[i])),
  }));
}

export const mockServiceDetails: Record<string, ServiceDetail> = {
  s1: {
    environment: 'production',
    region: 'us-east-1',
    version: 'v2.4.1',
    owner: 'platform-team',
    currentMetrics: { cpu: 25, memory: 45, requestRate: 1240, errorRate: 0.02, p99Latency: 45 },
    metrics: makeMetrics(25, 45),
    deployments: [
      { id: 'd1-1', version: 'v2.4.1', status: 'success',  triggeredBy: 'CI/CD',      commitSha: 'a1b2c3d4e5f6', durationSeconds: 94,  deployedAt: '2026-03-20T10:00:00Z' },
      { id: 'd1-2', version: 'v2.4.0', status: 'success',  triggeredBy: 'john.smith', commitSha: 'f6e5d4c3b2a1', durationSeconds: 87,  deployedAt: '2026-03-15T14:30:00Z' },
      { id: 'd1-3', version: 'v2.3.9', status: 'success',  triggeredBy: 'CI/CD',      commitSha: '1a2b3c4d5e6f', durationSeconds: 102, deployedAt: '2026-03-10T09:00:00Z' },
      { id: 'd1-4', version: 'v2.3.8', status: 'failed',   triggeredBy: 'CI/CD',      commitSha: 'deadbeef1234', durationSeconds: 45,  deployedAt: '2026-03-09T16:00:00Z' },
      { id: 'd1-5', version: 'v2.3.7', status: 'success',  triggeredBy: 'sarah.j',    commitSha: '9f8e7d6c5b4a', durationSeconds: 91,  deployedAt: '2026-03-05T11:15:00Z' },
      { id: 'd1-6', version: 'v2.3.6', status: 'success',  triggeredBy: 'CI/CD',      commitSha: '3c4d5e6f7a8b', durationSeconds: 85,  deployedAt: '2026-03-01T08:00:00Z' },
    ],
  },
  s2: {
    environment: 'production',
    region: 'eu-west-1',
    version: 'v1.8.2',
    owner: 'identity-team',
    currentMetrics: { cpu: 68, memory: 74, requestRate: 320, errorRate: 2.8, p99Latency: 890 },
    metrics: makeMetrics(65, 72),
    deployments: [
      { id: 'd2-1', version: 'v1.8.2', status: 'success',     triggeredBy: 'CI/CD',  commitSha: 'b3c4d5e6f7a8', durationSeconds: 78, deployedAt: '2026-03-19T09:15:00Z' },
      { id: 'd2-2', version: 'v1.8.1', status: 'rolled_back', triggeredBy: 'CI/CD',  commitSha: 'a2b3c4d5e6f7', durationSeconds: 34, deployedAt: '2026-03-18T15:30:00Z' },
      { id: 'd2-3', version: 'v1.8.0', status: 'success',     triggeredBy: 'mike.t', commitSha: '7a8b9c0d1e2f', durationSeconds: 95, deployedAt: '2026-03-12T10:00:00Z' },
      { id: 'd2-4', version: 'v1.7.9', status: 'success',     triggeredBy: 'CI/CD',  commitSha: '6f5e4d3c2b1a', durationSeconds: 88, deployedAt: '2026-03-07T09:00:00Z' },
      { id: 'd2-5', version: 'v1.7.8', status: 'failed',      triggeredBy: 'CI/CD',  commitSha: 'cafebabe0001', durationSeconds: 22, deployedAt: '2026-03-06T14:00:00Z' },
    ],
  },
  s3: {
    environment: 'production',
    region: 'us-east-1',
    version: 'v3.1.0',
    owner: 'analytics-team',
    currentMetrics: { cpu: 38, memory: 57, requestRate: 180, errorRate: 0.1, p99Latency: 120 },
    metrics: makeMetrics(38, 55),
    deployments: [
      { id: 'd3-1', version: 'v3.1.0', status: 'success', triggeredBy: 'CI/CD',   commitSha: 'e1d2c3b4a5f6', durationSeconds: 143, deployedAt: '2026-03-17T08:00:00Z' },
      { id: 'd3-2', version: 'v3.0.5', status: 'success', triggeredBy: 'sarah.j', commitSha: 'd2e3f4a5b6c7', durationSeconds: 138, deployedAt: '2026-03-10T10:30:00Z' },
      { id: 'd3-3', version: 'v3.0.4', status: 'success', triggeredBy: 'CI/CD',   commitSha: 'c3b4a5d6e7f8', durationSeconds: 125, deployedAt: '2026-03-03T09:45:00Z' },
      { id: 'd3-4', version: 'v3.0.3', status: 'success', triggeredBy: 'CI/CD',   commitSha: 'b4a5c6d7e8f9', durationSeconds: 131, deployedAt: '2026-02-24T14:00:00Z' },
    ],
  },
  s4: {
    environment: 'production',
    region: 'ap-southeast-1',
    version: 'v0.9.3',
    owner: 'infra-team',
    currentMetrics: { cpu: 0, memory: 0, requestRate: 0, errorRate: 100, p99Latency: 0 },
    metrics: makeMetrics(88, 85),
    deployments: [
      { id: 'd4-1', version: 'v0.9.3', status: 'failed',      triggeredBy: 'CI/CD',      commitSha: 'deadc0de1234', durationSeconds: 12, deployedAt: '2026-03-21T06:45:00Z' },
      { id: 'd4-2', version: 'v0.9.2', status: 'success',     triggeredBy: 'CI/CD',      commitSha: 'a1c2e3f4d5b6', durationSeconds: 68, deployedAt: '2026-03-14T12:00:00Z' },
      { id: 'd4-3', version: 'v0.9.1', status: 'success',     triggeredBy: 'john.smith', commitSha: 'b2d3e4f5a6c7', durationSeconds: 72, deployedAt: '2026-03-07T08:30:00Z' },
      { id: 'd4-4', version: 'v0.9.0', status: 'success',     triggeredBy: 'CI/CD',      commitSha: 'c3e4f5a6b7d8', durationSeconds: 65, deployedAt: '2026-02-28T16:00:00Z' },
      { id: 'd4-5', version: 'v0.8.9', status: 'rolled_back', triggeredBy: 'CI/CD',      commitSha: 'fail00000001', durationSeconds: 28, deployedAt: '2026-02-27T10:00:00Z' },
    ],
  },
  s5: {
    environment: 'staging',
    region: 'us-east-1',
    version: '—',
    owner: 'portal-team',
    currentMetrics: { cpu: 0, memory: 0, requestRate: 0, errorRate: 0, p99Latency: 0 },
    metrics: makeMetrics(0, 0),
    deployments: [
      { id: 'd5-1', version: 'v0.1.0-alpha', status: 'failed', triggeredBy: 'sam.dev', commitSha: '0000cafef001', durationSeconds: 7, deployedAt: '2026-03-15T11:00:00Z' },
    ],
  },
};
