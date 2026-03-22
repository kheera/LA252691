import { Group, SimpleGrid, Text, Title } from '@mantine/core';
import { useQuery } from '@apollo/client/react';
import { DashboardLayout } from '../../components/Shell/DashboardLayout';
import { ServiceCard } from '../../components/ServiceCard/ServiceCard';
import { StatusCounts } from '../../components/StatusSummaryBar';
import { GET_SERVICES } from '../../graphql/services';
import { type ServiceSummary } from '../../components/ServiceCard/types';

function OverviewSimpleGrid({ children }: { children: React.ReactNode }) {
  return <SimpleGrid cols={{ base: 1, sm: 2, lg: 3, xl: 4 }}>{children}</SimpleGrid>;
}

function ServiceGridSkeleton() {
  const count = 6;
  return (
    <OverviewSimpleGrid>
      {Array.from({ length: count }).map((_, i) => <ServiceCard key={i} loading />)}
    </OverviewSimpleGrid>
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
      {loading && <ServiceGridSkeleton />}
      {data && (
        <OverviewSimpleGrid>
          {data.services.map((svc) => <ServiceCard key={svc.id} svc={svc} />)}
        </OverviewSimpleGrid>
      )}
    </DashboardLayout>
  );
}

export default OverviewPage;
