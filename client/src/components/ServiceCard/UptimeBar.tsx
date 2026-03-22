import { Group, Progress, Stack, Text } from '@mantine/core';
import { statusColor } from '../../utils/statusColor';

interface UptimeBarProps {
  uptime: number | null;
  status: string | null;
}

export function UptimeBar({ uptime, status }: UptimeBarProps) {
  if (uptime === null) {
    return <Text size="xs" c="dimmed">No uptime data</Text>;
  }

  return (
    <Stack gap={4}>
      <Group justify="space-between">
        <Text size="xs" c="dimmed">Uptime</Text>
        <Text size="xs" fw={500} c={statusColor(status)}>{uptime}%</Text>
      </Group>
      <Progress value={uptime} color={statusColor(status)} size="sm" radius="xl" />
    </Stack>
  );
}
