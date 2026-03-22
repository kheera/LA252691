import { Group, SimpleGrid, Title } from '@mantine/core';
import { DashboardLayout } from '../../components/Shell/DashboardLayout';
import { ServiceCard } from '../../components/ServiceCard/ServiceCard';
import { StatusCounts } from '../../components/StatusSummaryBar';
import { mockServices } from '../../data/mockServices';

export function OverviewPage() {
  return (
    <DashboardLayout>
      <Group justify="space-between" align="center" mb="md">
        <Title order={3}>Services Overview</Title>
        <StatusCounts services={mockServices} />
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
