import type { ReactElement } from 'react';
import { Badge, Group, Text, ThemeIcon } from '@mantine/core';
import { IconAlertTriangle, IconCheck, IconMinus, IconServer, IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';
import type { HealthTrend, ServiceStatus } from '../../graphql/services';
import { statusBadgeColor } from '../../utils/statusColor';

const STATUS_ICON: Record<ServiceStatus, ReactElement> = {
  HEALTHY:  <IconCheck size={13} />,
  DEGRADED: <IconAlertTriangle size={13} />,
  DOWN:     <IconAlertTriangle size={13} />,
};

const TREND_CONFIG: Record<HealthTrend, { color: string; icon: ReactElement; label: string }> = {
  IMPROVING: { color: 'green', icon: <IconTrendingUp size={10} />,  label: 'Improving' },
  DEGRADING: { color: 'red',   icon: <IconTrendingDown size={10} />, label: 'Degrading' },
  STABLE:    { color: 'gray',  icon: <IconMinus size={10} />,        label: 'Stable'    },
};

function StatusLabel({ status }: { status: ServiceStatus | null }) {
  return <>{status ?? 'NOT DEPLOYED'}</>;
}

function StatusIcon({ status }: { status: ServiceStatus | null }) {
  return status ? STATUS_ICON[status] : <IconServer size={13} />;
}

function TrendBadge({ trend }: { trend: HealthTrend | null }) {
  if (!trend) return null;
  const { color, icon, label } = TREND_CONFIG[trend];
  return (
    <Badge color={color} variant="light" size="xs" leftSection={icon}>
      {label}
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
