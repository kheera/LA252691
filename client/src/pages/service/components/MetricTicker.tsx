import { Paper, SimpleGrid, Stack, Text } from '@mantine/core';
import { type CurrentMetrics } from '../../../data/mockServiceDetails';

interface TickerStatProps {
  label: string;
  value: string;
  color?: string;
}

function TickerStat({ label, value, color }: TickerStatProps) {
  return (
    <Paper withBorder p="sm" radius="md">
      <Stack gap={4}>
        <Text size="xs" c="dimmed" tt="uppercase" fw={600} lh={1}>{label}</Text>
        <Text size="xl" fw={700} c={color} lh={1.2}>{value}</Text>
      </Stack>
    </Paper>
  );
}

interface MetricTickerProps {
  metrics: CurrentMetrics;
}

export function MetricTicker({ metrics }: MetricTickerProps) {
  const cpuColor = metrics.cpu > 80 ? 'red' : metrics.cpu > 60 ? 'orange' : undefined;
  const memColor = metrics.memory > 85 ? 'red' : metrics.memory > 70 ? 'orange' : undefined;
  const errColor = metrics.errorRate > 1 ? 'red' : metrics.errorRate > 0.5 ? 'orange' : undefined;

  return (
    <SimpleGrid cols={{ base: 2, sm: 3, md: 5 }} spacing="sm">
      <TickerStat label="CPU" value={`${metrics.cpu}%`} color={cpuColor} />
      <TickerStat label="Memory" value={`${metrics.memory}%`} color={memColor} />
      <TickerStat label="Req / s" value={metrics.requestRate.toLocaleString()} />
      <TickerStat label="Error rate" value={`${metrics.errorRate}%`} color={errColor} />
      <TickerStat label="P99 latency" value={metrics.p99Latency > 0 ? `${metrics.p99Latency} ms` : '—'} />
    </SimpleGrid>
  );
}
