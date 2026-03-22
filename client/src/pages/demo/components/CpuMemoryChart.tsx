import { Card, Text } from '@mantine/core';
import { AreaChart } from '@mantine/charts';

const chartData = [
  { time: '00:00', cpu: 22, memory: 44 },
  { time: '04:00', cpu: 35, memory: 48 },
  { time: '08:00', cpu: 61, memory: 55 },
  { time: '12:00', cpu: 78, memory: 62 },
  { time: '16:00', cpu: 54, memory: 58 },
  { time: '20:00', cpu: 42, memory: 51 },
  { time: '23:59', cpu: 30, memory: 47 },
];

export function CpuMemoryChart() {
  return (
    <Card withBorder radius="md" p="md">
      <Text fw={600} mb="md">CPU &amp; Memory (last 24 h)</Text>
      <AreaChart
        h={200}
        data={chartData}
        dataKey="time"
        series={[
          { name: 'cpu', color: 'brand.6', label: 'CPU %' },
          { name: 'memory', color: 'teal.6', label: 'Memory %' },
        ]}
        curveType="monotone"
        withLegend
      />
    </Card>
  );
}
