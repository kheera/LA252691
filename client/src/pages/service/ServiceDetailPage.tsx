import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, SimpleGrid, Skeleton, Stack, Text } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { useQuery } from '@apollo/client/react';
import { DashboardLayout } from '../../components/Shell/DashboardLayout';
import {
  DeploymentHistoryTable,
  DeployModal,
  MetricTicker,
  MetricsChart,
  ServiceActionBar,
  ServiceHealthCard,
  ServiceIdentityHeader,
} from './components';
import { GET_SERVICE_DETAIL, type ServiceDetailResult } from '../../graphql/services';

function ServiceDetailSkeleton() {
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

function ServiceDetailError({ message, onBack }: { message: string; onBack: () => void }) {
  return (
    <DashboardLayout>
      <Stack gap="md">
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={onBack}>
          Back to Overview
        </Button>
        <Text c="dimmed">{message}</Text>
      </Stack>
    </DashboardLayout>
  );
}

export function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const onBack = () => navigate('/');
  const [deployModalOpen, setDeployModalOpen] = useState(false);
  const [deployKey, setDeployKey] = useState(0);

  const { data, loading, error } = useQuery<ServiceDetailResult>(GET_SERVICE_DETAIL, {
    variables: { id },
    skip: !id,
  });

  if (loading) return <ServiceDetailSkeleton />;

  if (error || !data?.service) {
    const message = error ? `Error: ${error.message}` : 'Service not found.';
    return <ServiceDetailError message={message} onBack={onBack} />;
  }

  const { service } = data;
  const { deployments, metrics } = service;
  // Assumes metrics are returned in ascending chronological order (oldest first); the last element is therefore the most recent.
  const latestMetric = metrics[metrics.length - 1] ?? null;
  // Sort a copy by timestamp descending to find the most recent deployment regardless of return order.
  const latestVersion = [...deployments]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]?.version ?? 'v0.0.0';

  return (
    <DashboardLayout>
      <Stack gap="lg">
        <ServiceActionBar serviceName={service.name} onBack={onBack} onDeployClick={() => { setDeployKey((k) => k + 1); setDeployModalOpen(true); }} />
        <ServiceIdentityHeader name={service.name} status={service.status} />
        <MetricTicker metric={latestMetric} />
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
          <ServiceHealthCard svc={service} />
          <MetricsChart metrics={metrics} />
        </SimpleGrid>
        <DeploymentHistoryTable deployments={deployments} />
      </Stack>
      <DeployModal
        key={deployKey}
        opened={deployModalOpen}
        onClose={() => setDeployModalOpen(false)}
        serviceName={service.name}
        latestVersion={latestVersion}
      />
    </DashboardLayout>
  );
}

export default ServiceDetailPage;
