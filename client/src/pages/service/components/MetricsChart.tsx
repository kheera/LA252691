import { AreaChart } from '@mantine/charts';
import { Alert, Card, Stack, Text } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';
import { type GqlMetric } from '../../../graphql/services';
import { formatRelativeDate } from '../../../utils/dateFormat';

interface MetricsChartProps {
  metrics: GqlMetric[];
  serviceStatus: string | null;
}

export function MetricsChart({ metrics, serviceStatus }: MetricsChartProps) {
  const isDown = serviceStatus === 'DOWN';
  const chartData = metrics.map((m) => ({
    time: formatRelativeDate(m.timestamp),
    cpu: m.cpuPercent ?? 0,
    memory: m.memoryMb ?? 0,
    rps: m.requestsPerSecond ?? 0,
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
        <AreaChart
          h={150}
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
      </Stack>
    </Card>
  );
}
