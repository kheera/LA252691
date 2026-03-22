import { useParams, useNavigate } from 'react-router-dom';
import { Button, SimpleGrid, Skeleton, Stack, Text } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { useQuery } from '@apollo/client/react';
import { DashboardLayout } from '../../components/Shell/DashboardLayout';
import {
  DeploymentHistoryTable,
  MetricTicker,
  MetricsChart,
  ServiceActionBar,
  ServiceHealthCard,
  ServiceIdentityHeader,
} from './components';
import { GET_SERVICE_DETAIL, type ServiceDetailResult } from '../../graphql/services';

export function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, loading, error } = useQuery<ServiceDetailResult>(GET_SERVICE_DETAIL, {
    variables: { id, serviceId: id },
    skip: !id,
  });

  if (loading) {
    return (
      <DashboardLayout>
        <Stack gap="lg">
          <Skeleton height={36} width={320} radius="md" />
          <SimpleGrid cols={{ base: 2, sm: 3, md: 5 }} spacing="sm">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} height={72} radius="md" />)}
          </SimpleGrid>
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
            <Skeleton height={280} radius="md" />
            <Skeleton height={280} radius="md" />
          </SimpleGrid>
          <Skeleton height={240} radius="md" />
        </Stack>
      </DashboardLayout>
    );
  }

  if (error || !data?.service) {
    return (
      <DashboardLayout>
        <Stack gap="md">
          <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate('/')}>
            Back to Overview
          </Button>
          <Text c="dimmed">{error ? `Error: ${error.message}` : 'Service not found.'}</Text>
        </Stack>
      </DashboardLayout>
    );
  }

  const { service, deployments, metrics } = data;
  const latestMetric = metrics[metrics.length - 1] ?? null;

  return (
    <DashboardLayout>
      <Stack gap="lg">
        <ServiceActionBar serviceName={service.name} onBack={() => navigate('/')} />
        <ServiceIdentityHeader name={service.name} status={service.status} />
        <MetricTicker metric={latestMetric} />
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
          <ServiceHealthCard svc={service} />
          <MetricsChart metrics={metrics} />
        </SimpleGrid>
        <DeploymentHistoryTable deployments={deployments} />
      </Stack>
    </DashboardLayout>
  );
}

export default ServiceDetailPage;
