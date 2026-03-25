import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Grid, Skeleton, Stack, Text } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { useQuery } from '@apollo/client/react';
import { DashboardLayout } from '../../components/Shell/DashboardLayout';
import {
  DeploymentHistoryTable,
  AcknowledgeOutageModal,
  DeployModal,
  MetricTicker,
  MetricsChart,
  ServiceActionBar,
  ServiceIdentityHeader,
} from './components';
import { GET_SERVICE_DETAIL, type ServiceDetailResult } from '../../graphql/services';
import { useDeploymentSettledSubscription } from '../../hooks/useDeploymentSettledSubscription';
import { useMetricUpdatedSubscription } from '../../hooks/useMetricUpdatedSubscription';

function ServiceDetailSkeleton() {
  return (
    <DashboardLayout>
      <Stack gap="lg">
        <Skeleton height={36} width={320} radius="md" />
        <Grid gutter="md" align="stretch">
          <Grid.Col span={{ base: 12, md: 9 }}>
            <Skeleton height={210} radius="md" />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Stack gap="sm">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} height={72} radius="md" />)}
            </Stack>
          </Grid.Col>
        </Grid>
        <Skeleton height={280} radius="md" />
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
  const [ackOutageOpen, setAckOutageOpen] = useState(false);
  const [ackOutageKey, setAckOutageKey] = useState(0);

  const { data, loading, error } = useQuery<ServiceDetailResult>(GET_SERVICE_DETAIL, {
    variables: { id },
    skip: !id,
  });

  // WS subscription — opens when this page mounts, closes on unmount.
  useDeploymentSettledSubscription(id ?? '');
  const liveMetrics = useMetricUpdatedSubscription(id ?? '');

  if (loading) return <ServiceDetailSkeleton />;

  if (error || !data?.service) {
    const message = error ? `Error: ${error.message}` : 'Service not found.';
    return <ServiceDetailError message={message} onBack={onBack} />;
  }

  const { service } = data;
  const { deployments, metrics } = service;
  // Seed the chart with the last 20 from the query, then append live subscription
  // updates as they arrive every 10 s — the chart re-renders automatically.
  const allMetrics = [...metrics, ...liveMetrics].slice(-20);
  // Assumes metrics are returned in ascending chronological order (oldest first); the last element is therefore the most recent.
  const latestMetric = allMetrics[allMetrics.length - 1] ?? null;
  // Sort a copy by timestamp descending to find the most recent deployment regardless of return order.
  const latestVersion = [...deployments]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]?.version ?? 'v0.0.0';

  return (
    <DashboardLayout>
      <Stack gap="lg">
        <ServiceActionBar
          onBack={onBack}
          onDeployClick={() => { setDeployKey((prev) => prev + 1); setDeployModalOpen(true); }}
          serviceStatus={service.status}
          onAcknowledgeOutageClick={() => { setAckOutageKey((prev) => prev + 1); setAckOutageOpen(true); }}
        />
        <ServiceIdentityHeader name={service.name} status={service.status} />
        <Grid gutter="md" align="stretch">
          <Grid.Col span={{ base: 12, md: 9 }}>
            <MetricsChart metrics={allMetrics} serviceStatus={service.status} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <MetricTicker metric={latestMetric} />
          </Grid.Col>
        </Grid>
        <DeploymentHistoryTable deployments={deployments} />
      </Stack>
      <DeployModal
        key={deployKey}
        opened={deployModalOpen}
        onClose={() => setDeployModalOpen(false)}
        serviceId={service.id}
        serviceName={service.name}
        latestVersion={latestVersion}
      />
      <AcknowledgeOutageModal
        key={ackOutageKey}
        opened={ackOutageOpen}
        onClose={() => setAckOutageOpen(false)}
        serviceId={service.id}
        serviceName={service.name}
      />
    </DashboardLayout>
  );
}

export default ServiceDetailPage;
