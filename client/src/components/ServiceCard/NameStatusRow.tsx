import { Badge, Group, Text, ThemeIcon } from '@mantine/core';
import { IconAlertTriangle, IconCheck, IconMinus, IconServer, IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';
import type { HealthTrend, ServiceStatus } from '../../graphql/services';
import { statusBadgeColor } from '../../utils/statusColor';

function StatusLabel({ status }: { status: ServiceStatus | null }) {
  return <>{status ?? 'NOT DEPLOYED'}</>;
}

function StatusIcon({ status }: { status: ServiceStatus | null }) {
  if (status === 'HEALTHY') return <IconCheck size={13} />;
  if (status === 'DEGRADED' || status === 'DOWN') return <IconAlertTriangle size={13} />;
  return <IconServer size={13} />;
}

function TrendBadge({ trend }: { trend: HealthTrend | null }) {
  if (!trend) return null;
  if (trend === 'IMPROVING') return (
    <Badge color="green" variant="light" size="xs" leftSection={<IconTrendingUp size={10} />}>
      Improving
    </Badge>
  );
  if (trend === 'DEGRADING') return (
    <Badge color="red" variant="light" size="xs" leftSection={<IconTrendingDown size={10} />}>
      Degrading
    </Badge>
  );
  return (
    <Badge color="gray" variant="light" size="xs" leftSection={<IconMinus size={10} />}>
      Stable
    </Badge>
  );
}

interface NameStatusRowProps {
  name: string;
  status: ServiceStatus | null;
  healthTrend: HealthTrend | null;
}

export function NameStatusRow({ name, status, healthTrend }: NameStatusRowProps) {
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
      <Group gap={4} wrap="nowrap" style={{ flexShrink: 0 }}>
        <TrendBadge trend={healthTrend} />
        <Badge
          color={statusBadgeColor(status)}
          variant="filled"
          autoContrast
          size="sm"
        >
          <StatusLabel status={status} />
        </Badge>
      </Group>
    </Group>
  );
}
