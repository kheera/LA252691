import { Badge, Group, Text } from '@mantine/core';
import { IconAlertTriangle, IconCheck, IconServer } from '@tabler/icons-react';

function statusColor(s: string | null): string {
  if (s === 'HEALTHY') return 'green';
  if (s === 'DEGRADED') return 'yellow';
  if (s === 'DOWN') return 'red';
  return 'gray';
}

function statusLabel(s: string | null): string {
  return s ?? 'NOT DEPLOYED';
}

function statusIcon(s: string | null) {
  if (s === 'HEALTHY') return <IconCheck size={12} />;
  if (s === 'DEGRADED' || s === 'DOWN') return <IconAlertTriangle size={12} />;
  return <IconServer size={12} />;
}

interface NameStatusRowProps {
  name: string;
  status: string | null;
}

export function NameStatusRow({ name, status }: NameStatusRowProps) {
  return (
    <Group justify="space-between" align="flex-start" wrap="nowrap">
      <Text fw={600} size="sm" style={{ wordBreak: 'break-word' }}>
        {name}
      </Text>
      <Badge
        color={statusColor(status)}
        size="sm"
        leftSection={statusIcon(status)}
        style={{ flexShrink: 0 }}
      >
        {statusLabel(status)}
      </Badge>
    </Group>
  );
}
