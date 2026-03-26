import { Badge, Group, Text, ThemeIcon } from '@mantine/core';
import { IconAlertTriangle, IconCheck, IconServer } from '@tabler/icons-react';
import type { ServiceStatus } from '../../graphql/services';
import { statusBadgeColor } from '../../utils/statusColor';

function StatusLabel({ status }: { status: ServiceStatus | null }) {
  return <>{status ?? 'NOT DEPLOYED'}</>;
}

function StatusIcon({ status }: { status: ServiceStatus | null }) {
  if (status === 'HEALTHY') return <IconCheck size={13} />;
  if (status === 'DEGRADED' || status === 'DOWN') return <IconAlertTriangle size={13} />;
  return <IconServer size={13} />;
}

interface NameStatusRowProps {
  name: string;
  status: ServiceStatus | null;
}

export function NameStatusRow({ name, status }: NameStatusRowProps) {
  return (
    <Group justify="space-between" align="center" wrap="nowrap">
      <Group gap="xs" wrap="nowrap" style={{ minWidth: 0 }}>
        <ThemeIcon
          color={statusBadgeColor(status)}
          variant="filled"
          autoContrast
          size={24}
          radius="xl"
          style={{ flexShrink: 0 }}
        >
          <StatusIcon status={status} />
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
        <StatusLabel status={status} />
      </Badge>
    </Group>
  );
}
