export interface ServiceSummary {
  id: string;
  name: string;
  status: string | null;
  uptime: number | null;
  lastDeployedAt: string | null;
}
