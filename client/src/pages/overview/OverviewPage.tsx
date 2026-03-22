import {
  Group,
  SimpleGrid,
  Text,
  Title,
} from '@mantine/core';
import { DashboardLayout } from '../../components/DashboardLayout';
import { ServiceCard, type ServiceSummary } from '../../components/ServiceCard/ServiceCard';

// ── Mock data — replace with useQuery(GET_SERVICES) when wiring up the backend ──
const mockServices: ServiceSummary[] = [
  { id: 's1', name: 'api-gateway',       status: 'HEALTHY',  uptime: 99.9, lastDeployedAt: '2026-03-20T10:00:00Z' },
  { id: 's2', name: 'auth-service',      status: 'DEGRADED', uptime: 95.2, lastDeployedAt: '2026-03-19T09:15:00Z' },
  { id: 's3', name: 'reporting-service', status: 'HEALTHY',  uptime: 98.7, lastDeployedAt: '2026-03-17T08:00:00Z' },
  { id: 's4', name: 'scheduler',         status: 'DOWN',     uptime: 71.3, lastDeployedAt: '2026-03-21T06:45:00Z' },
  { id: 's5', name: 'intake-portal',     status: null,       uptime: null,  lastDeployedAt: null },
];

export function OverviewPage() {
  return (
    <DashboardLayout>
      <Group justify="space-between" align="center">
        <Title order={3}>Services Overview</Title>
        <Text size="xs" c="dimmed">{mockServices.length} services</Text>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3, xl: 4 }}>
        {mockServices.map((svc) => (
          <ServiceCard key={svc.id} svc={svc} />
        ))}
      </SimpleGrid>
    </DashboardLayout>
  );
}

export default OverviewPage;
