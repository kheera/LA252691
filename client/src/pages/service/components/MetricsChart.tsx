import { AreaChart } from '@mantine/charts';
import { Card, Stack, Text } from '@mantine/core';
import { type GqlMetric } from '../../../graphql/services';

interface MetricsChartProps {
  metrics: GqlMetric[];
}

export function MetricsChart({ metrics }: MetricsChartProps) {
  const chartData = metrics.map((m) => ({
    time: m.timestamp.slice(11, 16),
    cpu: m.cpuPercent ?? 0,
    memory: m.memoryMb ?? 0,
  }));

  return (
    <Card withBorder radius="md" p="lg" h="100%">
      <Stack gap="md">
        <Text fw={600} size="sm" c="dimmed" tt="uppercase">CPU & Memory — last 20 min</Text>
        <AreaChart
          h={200}
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
