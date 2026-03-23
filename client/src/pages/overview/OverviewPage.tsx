import { Grid, Group, Text, Title } from '@mantine/core';
import { useQuery } from '@apollo/client/react';
import { DashboardLayout } from '../../components/Shell/DashboardLayout';
import { ServiceCard } from '../../components/ServiceCard/ServiceCard';
import { StatusCounts } from '../../components/StatusSummaryBar';
import { GET_SERVICES } from '../../graphql/services';
import { type ServiceSummary } from '../../components/ServiceCard/types';
import { RecentDeploymentsPanel } from './components/RecentDeploymentsPanel';

function ServiceGridSkeleton() {
  const count = 6;
  return (
    <Grid gutter="md">
      {Array.from({ length: count }).map((_, i) => (
        <Grid.Col key={i} span={{ base: 12, sm: 6, xl: 4 }}>
          <ServiceCard key={i} loading />
        </Grid.Col>
      ))}
    </Grid>
  );
}

export function OverviewPage() {
  const { data, loading, error } = useQuery<{ services: ServiceSummary[] }>(GET_SERVICES);

  return (
    <DashboardLayout>
      <Group justify="space-between" align="center" mb="md">
        <Title order={3}>Services Overview</Title>
        {data && <StatusCounts services={data.services} />}
      </Group>

      {error && <Text c="red">Failed to load services: {error.message}</Text>}

      {/* Side-by-side: service cards left, recent deployments right.
          Panel stays in the viewport so the 6 service cards are never pushed below the fold. */}
      <Grid gutter="md" align="stretch">
        <Grid.Col span={{ base: 12, lg: 8 }}>
          {loading && <ServiceGridSkeleton />}
          {data && (
            <Grid gutter="md">
              {data.services.map((svc) => (
                <Grid.Col key={svc.id} span={{ base: 12, sm: 6, xl: 4 }}>
                  <ServiceCard svc={svc} />
                </Grid.Col>
              ))}
            </Grid>
          )}
        </Grid.Col>

        <Grid.Col span={{ base: 12, lg: 4 }}>
          <RecentDeploymentsPanel services={data?.services ?? []} />
        </Grid.Col>
      </Grid>
    </DashboardLayout>
  );
}

export default OverviewPage;
