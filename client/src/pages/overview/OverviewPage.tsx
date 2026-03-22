import { Group, SimpleGrid, Text, Title } from '@mantine/core';
import { useQuery } from '@apollo/client/react';
import { DashboardLayout } from '../../components/Shell/DashboardLayout';
import { ServiceCard } from '../../components/ServiceCard/ServiceCard';
import { StatusCounts } from '../../components/StatusSummaryBar';
import { GET_SERVICES } from '../../graphql/services';
import { type ServiceSummary } from '../../components/ServiceCard/types';

const SKELETON_COUNT = 6;

export function OverviewPage() {
  const { data, loading, error } = useQuery<{ services: ServiceSummary[] }>(GET_SERVICES);

  return (
    <DashboardLayout>
      <Group justify="space-between" align="center" mb="md">
        <Title order={3}>Services Overview</Title>
        {data && <StatusCounts services={data.services} />}
      </Group>

      {error && <Text c="red">Failed to load services: {error.message}</Text>}

      {(loading || data) && (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3, xl: 4 }}>
          {loading
            ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <ServiceCard key={i} loading />
              ))
            : data!.services.map((svc) => (
                <ServiceCard key={svc.id} svc={svc} />
              ))}
        </SimpleGrid>
      )}
    </DashboardLayout>
  );
}

export default OverviewPage;
