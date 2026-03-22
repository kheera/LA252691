/* DELETE THIS DEMO PAGE */
import { Title } from '@mantine/core';
import { DashboardLayout } from '../../components/DashboardLayout';
import { TriggerDeployButton } from './components/TriggerDeployButton';
import { StatCards } from './components/StatCards';
import { CpuMemoryChart } from './components/CpuMemoryChart';
import { ServiceList } from './components/ServiceList';

export function DemoPage() {
  return (
    <DashboardLayout headerActions={<TriggerDeployButton />}>
      <Title order={3}>Overview</Title>
      <StatCards />
      <CpuMemoryChart />
      <ServiceList />
    </DashboardLayout>
  );
}

export default DemoPage;
