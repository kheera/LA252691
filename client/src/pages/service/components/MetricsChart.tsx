import { AreaChart } from '@mantine/charts';
import { Alert, Card, Stack, Text } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';
import { type GqlMetric } from '../../../graphql/services';

interface MetricsChartProps {
  metrics: GqlMetric[];
  serviceStatus: string | null;
}

export function MetricsChart({ metrics, serviceStatus }: MetricsChartProps) {
  const isDown = serviceStatus === 'DOWN';
  const chartData = metrics.map((m) => ({
    time: m.timestamp.slice(11, 19),
    cpu: m.cpuPercent ?? 0,
    memory: m.memoryMb ?? 0,
  }));

  return (
    <Card withBorder radius="md" p="lg" h="100%" style={isDown ? { borderColor: 'var(--mantine-color-red-6)' } : undefined}>
      <Stack gap="md">
        <Text fw={600} size="sm" c="dimmed" tt="uppercase">CPU &amp; Memory — last 20 readings</Text>
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
