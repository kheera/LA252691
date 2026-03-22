import { AreaChart } from '@mantine/charts';
import { Card, Stack, Text } from '@mantine/core';
import { type MetricPoint } from '../../../data/mockServiceDetails';

interface MetricsChartProps {
  data: MetricPoint[];
}

export function MetricsChart({ data }: MetricsChartProps) {
  return (
    <Card withBorder radius="md" p="lg" h="100%">
      <Stack gap="md">
        <Text fw={600} size="sm" c="dimmed" tt="uppercase">CPU &amp; Memory — last 20 min</Text>
        <AreaChart
          h={200}
          data={data}
          dataKey="time"
          series={[
            { name: 'cpu',    label: 'CPU %',    color: 'blue.5' },
            { name: 'memory', label: 'Memory %', color: 'violet.5' },
          ]}
          withLegend
          yAxisProps={{ domain: [0, 100], tickCount: 5 }}
          tickLine="none"
          gridAxis="y"
          curveType="monotone"
          fillOpacity={0.15}
        />
      </Stack>
    </Card>
  );
}
