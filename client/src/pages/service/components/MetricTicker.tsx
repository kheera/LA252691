import { Group, Paper, Stack, Text } from '@mantine/core';
import { type GqlMetric } from '../../../graphql/services';

interface TickerStatProps {
  label: string;
  value: string;
  color?: string;
}

function TickerStat({ label, value, color }: TickerStatProps) {
  return (
    <Paper withBorder px="sm" py="xs" radius="md">
      <Group justify="space-between" gap="xs">
        <Text size="xs" c="dimmed" tt="uppercase" fw={600} lh={1}>{label}</Text>
        <Text size="sm" fw={700} c={color} lh={1}>{value}</Text>
      </Group>
    </Paper>
  );
}

interface MetricTickerProps {
  metric: GqlMetric | null;
}

export function MetricTicker({ metric }: MetricTickerProps) {
  const cpu = metric?.cpuPercent ?? null;
  const memMb = metric?.memoryMb ?? null;
  const rps = metric?.requestsPerSecond ?? null;
  const errRate = metric?.errorRate ?? null;

  const cpuColor = cpu !== null && cpu > 80 ? 'red' : cpu !== null && cpu > 60 ? 'orange' : undefined;
  const errColor = errRate !== null && errRate > 1 ? 'red' : errRate !== null && errRate > 0.5 ? 'orange' : undefined;

  return (
    <Stack gap="xs">
      <TickerStat label="CPU" value={cpu !== null ? `${cpu}%` : '—'} color={cpuColor} />
      <TickerStat label="Memory" value={memMb !== null ? `${memMb} MB` : '—'} />
      <TickerStat label="Req / sec" value={rps !== null ? `${rps}` : '—'} />
      <TickerStat label="Error rate" value={errRate !== null ? `${errRate}%` : '—'} color={errColor} />
    </Stack>
  );
}
