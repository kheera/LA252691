import { useParams, useNavigate } from 'react-router-dom';
import { Button, SimpleGrid, Stack, Text } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { mockServices } from '../../data/mockServices';
import { mockServiceDetails } from '../../data/mockServiceDetails';
import {
  DeploymentHistoryTable,
  MetricTicker,
  MetricsChart,
  ServiceActionBar,
  ServiceHealthCard,
  ServiceIdentityHeader,
} from './components';

export function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const svc = mockServices.find((s) => s.id === id);
  const detail = id ? mockServiceDetails[id] : undefined;

  if (!svc || !detail) {
    return (
      <DashboardLayout>
        <Stack gap="md">
          <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate('/')}>
            Back to Overview
          </Button>
          <Text c="dimmed">Service not found.</Text>
        </Stack>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Stack gap="lg">
        <ServiceActionBar serviceName={svc.name} onBack={() => navigate('/')} />
        <ServiceIdentityHeader name={svc.name} status={svc.status} />
        <MetricTicker metrics={detail.currentMetrics} />
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
          <ServiceHealthCard svc={svc} detail={detail} />
          <MetricsChart data={detail.metrics} />
        </SimpleGrid>
        <DeploymentHistoryTable deployments={detail.deployments} />
      </Stack>
    </DashboardLayout>
  );
}

export default ServiceDetailPage;
