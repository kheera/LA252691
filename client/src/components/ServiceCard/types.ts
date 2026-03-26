import type { ServiceStatus } from '../../graphql/services';

export interface ServiceSummary {
  id: string;
  name: string;
  status: ServiceStatus | null;
  uptime: number | null;
  lastDeployedAt: string | null;
}
