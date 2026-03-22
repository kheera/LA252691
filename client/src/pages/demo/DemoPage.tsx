/* DELETE THIS DEMO PAGE */
import {
  Badge,
  Button,
  Card,
  Grid,
  Group,
  Progress,
  RingProgress,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { AreaChart } from '@mantine/charts';
import {
  IconAlertTriangle,
  IconCheck,
  IconCloudUpload,
  IconServer,
} from '@tabler/icons-react';
import { DashboardLayout } from '../../components/DashboardLayout';

const chartData = [
  { time: '00:00', cpu: 22, memory: 44 },
  { time: '04:00', cpu: 35, memory: 48 },
  { time: '08:00', cpu: 61, memory: 55 },
  { time: '12:00', cpu: 78, memory: 62 },
  { time: '16:00', cpu: 54, memory: 58 },
  { time: '20:00', cpu: 42, memory: 51 },
  { time: '23:59', cpu: 30, memory: 47 },
];

const services = [
  { name: 'api-gateway', status: 'HEALTHY', uptime: 99.9, deploys: 8 },
  { name: 'auth-service', status: 'DEGRADED', uptime: 97.2, deploys: 3 },
  { name: 'data-pipeline', status: 'DOWN', uptime: 81.0, deploys: 12 },
  { name: 'frontend-cdn', status: 'HEALTHY', uptime: 100.0, deploys: 5 },
];

function statusColor(s: string) {
  if (s === 'HEALTHY') return 'green';
  if (s === 'DEGRADED') return 'yellow';
  return 'red';
}

function statusIcon(s: string) {
  return s === 'HEALTHY' ? <IconCheck size={14} /> : <IconAlertTriangle size={14} />;
}

export function DemoPage() {
  const triggerDeploy = (
    <Button
      size="sm"
      leftSection={<IconCloudUpload size={15} />}
      onClick={() =>
        notifications.show({
          title: 'Deployment triggered',
          message: 'api-gateway v2.4.1 is being rolled out',
          color: 'blue',
          icon: <IconCheck size={16} />,
        })
      }
    >
      Trigger Deploy
    </Button>
  );

  return (
    <DashboardLayout headerActions={triggerDeploy}>
      <Title order={3}>Overview</Title>

              {/* Stat cards */}
              <SimpleGrid cols={{ base: 2, lg: 4 }}>
                {[
                  { label: 'Total Services', value: '4', color: 'blue', icon: <IconServer size={18} /> },
                  { label: 'Healthy', value: '2', color: 'green', icon: <IconCheck size={18} /> },
                  { label: 'Degraded', value: '1', color: 'yellow', icon: <IconAlertTriangle size={18} /> },
                  { label: 'Down', value: '1', color: 'red', icon: <IconAlertTriangle size={18} /> },
                ].map(({ label, value, color, icon }) => (
                  <Card key={label} withBorder radius="md" p="md">
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">{label}</Text>
                      <ThemeIcon color={color} variant="light" size="md">{icon}</ThemeIcon>
                    </Group>
                    <Text fw={700} size="xl" mt="xs">{value}</Text>
                  </Card>
                ))}
              </SimpleGrid>

              {/* Chart */}
              <Card withBorder radius="md" p="md">
                <Text fw={600} mb="md">CPU &amp; Memory (last 24 h)</Text>
                <AreaChart
                  h={200}
                  data={chartData}
                  dataKey="time"
                  series={[
                    { name: 'cpu', color: 'blue.6', label: 'CPU %' },
                    { name: 'memory', color: 'teal.6', label: 'Memory %' },
                  ]}
                  curveType="monotone"
                  withLegend
                />
              </Card>

              {/* Services */}
              <Card withBorder radius="md" p="md">
                <Text fw={600} mb="md">Services</Text>
                <Stack gap="sm">
                  {services.map((svc) => (
                    <Card key={svc.name} withBorder radius="sm" p="sm">
                      <Grid align="center">
                        <Grid.Col span={5}>
                          <Group gap="xs">
                            <Text fw={500} size="sm">{svc.name}</Text>
                            <Badge color={statusColor(svc.status)} size="sm" leftSection={statusIcon(svc.status)}>
                              {svc.status}
                            </Badge>
                          </Group>
                        </Grid.Col>
                        <Grid.Col span={5}>
                          <Stack gap={4}>
                            <Text size="xs" c="dimmed">Uptime {svc.uptime}%</Text>
                            <Progress value={svc.uptime} color={statusColor(svc.status)} size="sm" radius="xl" />
                          </Stack>
                        </Grid.Col>
                        <Grid.Col span={2}>
                          <Group justify="flex-end">
                            <RingProgress
                              size={44}
                              thickness={4}
                              sections={[{ value: svc.uptime, color: statusColor(svc.status) }]}
                              label={<Text ta="center" size="xs" lh={1}>{svc.deploys}d</Text>}
                            />
                          </Group>
                        </Grid.Col>
                      </Grid>
                    </Card>
                  ))}
                </Stack>
              </Card>
    </DashboardLayout>
  );
}

export default DemoPage;
