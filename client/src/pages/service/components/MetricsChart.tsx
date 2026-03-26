import { AreaChart } from '@mantine/charts';
import { Alert, Card, Group, Loader, Skeleton, Stack, Text } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';
import { type GqlMetric, type ServiceStatus } from '../../../graphql/services';
import { formatRelativeDate } from '../../../utils/dateFormat';

interface MetricsChartProps {
  metrics: GqlMetric[];
  serviceStatus: ServiceStatus | null;
  /** False until the first live metric arrives — shows a loading state. */
  isReady: boolean;
  /** Set when the subscription itself errors; shown as a warning banner. */
  subscriptionError: string | null;
}

export function MetricsChart({ metrics, serviceStatus, isReady, subscriptionError }: MetricsChartProps) {
  const isDown = serviceStatus === 'DOWN';
  // Keep null values as-is: Recharts treats null as a gap in the line, which is
  // the correct visual for placeholder slots before real data arrives.
  const chartData = metrics.map((m) => ({
    time: formatRelativeDate(m.timestamp),
    cpu: m.cpuPercent,
    memory: m.memoryMb,
    rps: m.requestsPerSecond,
  }));

  return (
    <Card withBorder radius="md" p="lg" h="100%" style={isDown ? { borderColor: 'var(--mantine-color-red-6)' } : undefined}>
      <Stack gap="md">
        <Text fw={600} size="sm" c="dimmed" tt="uppercase">CPU, Memory &amp; RPS — last 20 readings</Text>
        {isDown && (
          <Alert color="red" variant="light" icon={<IconAlertTriangle size={16} />} p="xs">
            Service is DOWN — metrics may be stale
          </Alert>
        )}
        {subscriptionError && (
          <Alert color="orange" variant="light" icon={<IconAlertTriangle size={16} />} p="xs">
            Live metrics unavailable — {subscriptionError}.
          </Alert>
        )}
        {!isReady && !subscriptionError && (
          <Group gap={6}>
            <Loader size={12} color="red" />
            <Text size="xs" c="red" fw={600}>Waiting for first metric…</Text>
          </Group>
        )}
        <Skeleton visible={!isReady}>
          <AreaChart
          h={160}
          data={chartData}
          dataKey="time"
          series={[
            { name: 'cpu', label: 'CPU %', color: 'blue.5' },
            { name: 'memory', label: 'Memory (MB)', color: 'violet.5', yAxisId: 'right' },
            { name: 'rps', label: 'Req/sec', color: 'teal.5', yAxisId: 'right' },
          ]}
          withLegend
          withRightYAxis
          yAxisProps={{ domain: [0, 100], tickCount: 5 }}
          rightYAxisProps={{ tickCount: 5 }}
          tickLine="none"
          gridAxis="y"
          curveType="monotone"
          fillOpacity={0.15}
        />
        </Skeleton>
      </Stack>
    </Card>
  );
}
