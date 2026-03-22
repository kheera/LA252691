import { gql } from '@apollo/client';

export const GET_SERVICES = gql`
  query GetServices {
    services {
      id
      name
      status
      uptime
      lastDeployedAt
    }
  }
`;

export interface GqlDeployment {
  id: string;
  serviceId: string;
  version: string;
  deployedBy: string;
  timestamp: string;
  status: string | null;
  durationSeconds: number;
}

export interface GqlMetric {
  id: string;
  timestamp: string;
  cpuPercent: number | null;
  memoryMb: number | null;
  requestsPerSecond: number | null;
  errorRate: number | null;
}

export interface ServiceDetailResult {
  service: {
    id: string;
    name: string;
    status: string | null;
    uptime: number | null;
    lastDeployedAt: string | null;
  };
  deployments: GqlDeployment[];
  metrics: GqlMetric[];
}

export const GET_SERVICE_DETAIL = gql`
  query GetServiceDetail($id: ID!, $serviceId: ID!) {
    service(id: $id) {
      id
      name
      status
      uptime
      lastDeployedAt
    }
    deployments(serviceId: $serviceId) {
      id
      serviceId
      version
      deployedBy
      timestamp
      status
      durationSeconds
    }
    metrics(serviceId: $serviceId, last: 20) {
      id
      timestamp
      cpuPercent
      memoryMb
      requestsPerSecond
      errorRate
    }
  }
`;
