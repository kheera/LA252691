import { gql } from '@apollo/client';

export type ServiceStatus = 'HEALTHY' | 'DEGRADED' | 'DOWN';

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
  __typename?: 'Deployment';
  id: string;
  serviceId: string;
  version: string;
  deployedBy: string;
  timestamp: string;
  status: string | null;
  durationSeconds: number;
}

export interface GqlMetric {
  serviceId: string;
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
    status: ServiceStatus | null;
    uptime: number | null;
    lastDeployedAt: string | null;
    deployments: GqlDeployment[];
  };
}

export const GET_SERVICE_DETAIL = gql`
  query GetServiceDetail($id: ID!) {
    service(id: $id) {
      id
      name
      status
      uptime
      lastDeployedAt
      deployments(last: 20) {
        id
        serviceId
        version
        deployedBy
        timestamp
        status
        durationSeconds
      }
    }
  }
`;

export interface TriggerDeploymentResult {
  triggerDeployment: GqlDeployment;
}

export const TRIGGER_DEPLOYMENT = gql`
  mutation TriggerDeployment($serviceId: ID!, $version: String!) {
    triggerDeployment(serviceId: $serviceId, version: $version) {
      id
      serviceId
      version
      deployedBy
      timestamp
      status
      durationSeconds
    }
  }
`;

export interface RecentDeployment {
  id: string;
  serviceId: string;
  version: string;
  timestamp: string;
  status: string | null;
}

export interface RecentDeploymentsResult {
  deployments: RecentDeployment[];
}

export const GET_RECENT_DEPLOYMENTS = gql`
  query GetRecentDeployments($status: DeploymentStatus, $limit: Int) {
    deployments(status: $status, limit: $limit) {
      id
      serviceId
      version
      timestamp
      status
    }
  }
`;

export interface AcknowledgeOutageResult {
  acknowledgeOutage: {
    id: string;
    name: string;
    status: ServiceStatus | null;
  };
}

export const ACKNOWLEDGE_OUTAGE = gql`
  mutation AcknowledgeOutage($serviceId: ID!) {
    acknowledgeOutage(serviceId: $serviceId) {
      id
      name
      status
    }
  }
`;

export interface DeploymentSettledPayload {
  deploymentSettled: {
    id: string;
    serviceId: string;
    version: string;
    status: string;
    timestamp: string;
    durationSeconds: number;
  };
}

export const SUBSCRIBE_DEPLOYMENT_SETTLED = gql`
  subscription OnDeploymentSettled {
    deploymentSettled {
      id
      serviceId
      version
      status
      timestamp
      durationSeconds
    }
  }
`;

export interface MetricUpdatedPayload {
  metricUpdated: {
    serviceId: string;
    timestamp: string;
    cpuPercent: number | null;
    memoryMb: number | null;
    requestsPerSecond: number | null;
    errorRate: number | null;
  };
}

export const SUBSCRIBE_METRIC_UPDATES = gql`
  subscription OnMetricUpdated($serviceId: ID!) {
    metricUpdated(serviceId: $serviceId) {
      serviceId
      timestamp
      cpuPercent
      memoryMb
      requestsPerSecond
      errorRate
    }
  }
`;
