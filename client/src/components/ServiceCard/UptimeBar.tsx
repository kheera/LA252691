import { Group, Progress, Skeleton, Stack, Text } from '@mantine/core';
import { statusProgressColor, statusTextStyle } from '../../utils/statusColor';

interface UptimeBarProps {
  uptime: number | null;
  status: string | null;
  loading?: boolean;
}

export function UptimeBar({ uptime, status, loading }: UptimeBarProps) {
  if (!loading && uptime === null) {
    return <Text size="xs" c="dimmed">No uptime data</Text>;
  }

  return (
    <Stack gap={4}>
      <Group justify="space-between">
        {loading ? <Skeleton height={10} width={40} radius="sm" /> : <Text size="xs" c="dimmed">Uptime</Text>}
        {loading ? <Skeleton height={10} width={32} radius="sm" /> : <Text size="xs" fw={500} style={statusTextStyle(status)}>{uptime}%</Text>}
      </Group>
      {loading
        ? <Skeleton height={8} radius="xl" />
        : <Progress value={uptime ?? 0} color={statusProgressColor(status)} size="sm" radius="xl" />}
    </Stack>
  );
}
