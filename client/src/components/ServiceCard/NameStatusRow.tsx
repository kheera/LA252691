import { Badge, Group, Text, ThemeIcon } from '@mantine/core';
import { IconAlertTriangle, IconCheck, IconServer } from '@tabler/icons-react';
import { statusBadgeColor } from '../../utils/statusColor';

function statusLabel(s: string | null): string {
  return s ?? 'NOT DEPLOYED';
}

function statusIcon(s: string | null) {
  if (s === 'HEALTHY') return <IconCheck size={13} />;
  if (s === 'DEGRADED' || s === 'DOWN') return <IconAlertTriangle size={13} />;
  return <IconServer size={13} />;
}

interface NameStatusRowProps {
  name: string;
  status: string | null;
}

export function NameStatusRow({ name, status }: NameStatusRowProps) {
  return (
    <Group justify="space-between" align="center" wrap="nowrap">
      <Group gap="xs" wrap="nowrap" style={{ minWidth: 0 }}>
        <ThemeIcon
          color={statusBadgeColor(status)}
          variant="filled"
          autoContrast
          size={22}
          radius="xl"
          style={{ flexShrink: 0 }}
        >
          {statusIcon(status)}
        </ThemeIcon>
        <Text fw={600} size="sm" style={{ wordBreak: 'break-word' }}>
          {name}
        </Text>
      </Group>
      <Badge
        color={statusBadgeColor(status)}
        variant="filled"
        autoContrast
        size="sm"
        style={{ flexShrink: 0 }}
      >
        {statusLabel(status)}
      </Badge>
    </Group>
  );
}
