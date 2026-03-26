import { Card, Divider, Group, Stack, Text } from '@mantine/core';
import { IconMinus, IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';
import { UptimeBar } from '../../../components/ServiceCard/UptimeBar';
import { LastDeployedRow } from '../../../components/ServiceCard/LastDeployedRow';
import { type ServiceSummary } from '../../../components/ServiceCard/types';
import type { HealthTrend } from '../../../graphql/services';


function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <Stack gap={4}>
      <Text size="xs" c="dimmed" fw={600} tt="uppercase" lh={1}>{label}</Text>
      <Text size="sm" fw={500}>{value}</Text>
    </Stack>
  );
}

function TrendRow({ trend }: { trend: HealthTrend | null }) {
  if (!trend) return <MetaItem label="Trend" value="—" />;
  if (trend === 'IMPROVING') return (
    <Stack gap={4}>
      <Text size="xs" c="dimmed" fw={600} tt="uppercase" lh={1}>Trend</Text>
      <Group gap={4}>
        <IconTrendingUp size={16} color="var(--mantine-color-green-6)" />
        <Text size="sm" fw={500} c="green">Improving</Text>
      </Group>
    </Stack>
  );
  if (trend === 'DEGRADING') return (
    <Stack gap={4}>
      <Text size="xs" c="dimmed" fw={600} tt="uppercase" lh={1}>Trend</Text>
      <Group gap={4}>
        <IconTrendingDown size={16} color="var(--mantine-color-red-6)" />
        <Text size="sm" fw={500} c="red">Degrading</Text>
      </Group>
    </Stack>
  );
  return (
    <Stack gap={4}>
      <Text size="xs" c="dimmed" fw={600} tt="uppercase" lh={1}>Trend</Text>
      <Group gap={4}>
        <IconMinus size={16} color="var(--mantine-color-dimmed)" />
        <Text size="sm" fw={500} c="dimmed">Stable</Text>
      </Group>
    </Stack>
  );
}

interface ServiceHealthCardProps {
  svc: ServiceSummary;
  liveHealthTrend?: HealthTrend | null;
}

export function ServiceHealthCard({ svc, liveHealthTrend }: ServiceHealthCardProps) {
  return (
    <Card withBorder radius="md" p="lg" h="100%">
      <Stack gap="md">
        <Text fw={600} size="sm" c="dimmed" tt="uppercase">Health</Text>
        <UptimeBar uptime={svc.uptime} status={svc.status} />

        <Divider />

        <TrendRow trend={liveHealthTrend !== undefined ? liveHealthTrend : svc.healthTrend} />

        <Divider />

        <Text fw={600} size="sm" c="dimmed" tt="uppercase">Last Deployment</Text>
        <LastDeployedRow lastDeployedAt={svc.lastDeployedAt} />
      </Stack>
    </Card>
  );
}
