import { Badge, Card, Group, Progress, Stack, Text } from '@mantine/core';
import { IconAlertTriangle, IconCheck, IconClock, IconServer } from '@tabler/icons-react';

export interface ServiceSummary {
  id: string;
  name: string;
  status: string | null;
  uptime: number | null;
  lastDeployedAt: string | null;
}

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

function formatLastDeployed(iso: string | null): string {
  if (!iso) return 'Never deployed';
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function ServiceCard({ svc }: { svc: ServiceSummary }) {
  return (
    <Card withBorder radius="md" p="md">
      <Stack gap="sm">
        {/* Name + status */}
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <Text fw={600} size="sm" style={{ wordBreak: 'break-word' }}>
            {svc.name}
          </Text>
          <Badge
            color={statusColor(svc.status)}
            size="sm"
            leftSection={statusIcon(svc.status)}
            style={{ flexShrink: 0 }}
          >
            {statusLabel(svc.status)}
          </Badge>
        </Group>

        {/* Uptime */}
        {svc.uptime !== null ? (
          <Stack gap={4}>
            <Group justify="space-between">
              <Text size="xs" c="dimmed">Uptime</Text>
              <Text size="xs" fw={500} c={statusColor(svc.status)}>{svc.uptime}%</Text>
            </Group>
            <Progress
              value={svc.uptime}
              color={statusColor(svc.status)}
              size="sm"
              radius="xl"
            />
          </Stack>
        ) : (
          <Text size="xs" c="dimmed">No uptime data</Text>
        )}

        {/* Last deployed */}
        <Group gap="xs">
          <IconClock size={13} color="var(--mantine-color-dimmed)" />
          <Text size="xs" c="dimmed">{formatLastDeployed(svc.lastDeployedAt)}</Text>
        </Group>
      </Stack>
    </Card>
  );
}
