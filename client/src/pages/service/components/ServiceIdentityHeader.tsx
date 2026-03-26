import { Badge, Group, ThemeIcon, Title } from '@mantine/core';
import { IconAlertTriangle, IconCheck, IconServer } from '@tabler/icons-react';
import type { ServiceStatus } from '../../../graphql/services';
import { statusBadgeColor } from '../../../utils/statusColor';

function statusIcon(s: ServiceStatus | null) {
  if (s === 'HEALTHY') return <IconCheck size={16} />;
  if (s === 'DEGRADED' || s === 'DOWN') return <IconAlertTriangle size={16} />;
  return <IconServer size={16} />;
}

interface ServiceIdentityHeaderProps {
  name: string;
  status: ServiceStatus | null;
}

export function ServiceIdentityHeader({ name, status }: ServiceIdentityHeaderProps) {
  return (
    <Group gap="sm" align="center">
      <ThemeIcon
        color={statusBadgeColor(status)}
        variant="filled"
        autoContrast
        size={32}
        radius="xl"
      >
        {statusIcon(status)}
      </ThemeIcon>
      <Title order={2}>{name}</Title>
      <Badge color={statusBadgeColor(status)} variant="filled" autoContrast size="md">
        {status ?? 'NOT DEPLOYED'}
      </Badge>
    </Group>
  );
}
