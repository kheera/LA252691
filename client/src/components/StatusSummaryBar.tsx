import { Divider, Group, Paper, ThemeIcon, Text } from '@mantine/core';
import { IconAlertTriangle, IconCheck, IconCircleDot, IconX } from '@tabler/icons-react';
import { type ServiceSummary } from './ServiceCard/types';

interface ChipProps {
  count: number;
  label: string;
  /** Mantine shade-pinned colour, e.g. "green.7" */
  color: string;
  icon: React.ReactNode;
}

function StatusChip({ count, label, color, icon }: ChipProps) {
  return (
    <Group gap="xs" wrap="nowrap">
      <ThemeIcon color={color} variant="filled" autoContrast size={20} radius="xl">
        {icon}
      </ThemeIcon>
      <Text size="sm" fw={700} lh={1}>{count}</Text>
      <Text size="sm" c="dimmed" lh={1}>{label}</Text>
    </Group>
  );
}

interface StatusCountsProps {
  services: ServiceSummary[];
}

/**
 * Inline chip row — no wrapper. Drop this anywhere in a header/title bar.
 */
export function StatusCounts({ services }: StatusCountsProps) {
  const healthy  = services.filter((s) => s.status === 'HEALTHY').length;
  const degraded = services.filter((s) => s.status === 'DEGRADED').length;
  const down     = services.filter((s) => s.status === 'DOWN').length;
  const unknown  = services.filter(
    (s) => s.status !== 'HEALTHY' && s.status !== 'DEGRADED' && s.status !== 'DOWN',
  ).length;

  return (
    <Group gap="sm" wrap="nowrap">
      <StatusChip count={healthy}  label="Healthy"  color="green.7"  icon={<IconCheck size={11} />} />
      <Divider orientation="vertical" />
      <StatusChip count={degraded} label="Degraded" color="yellow.4" icon={<IconAlertTriangle size={11} />} />
      <Divider orientation="vertical" />
      <StatusChip count={down}     label="Down"     color="red.8"    icon={<IconX size={11} />} />
      {unknown > 0 && (
        <>
          <Divider orientation="vertical" />
          <StatusChip count={unknown} label="Unknown" color="gray.6" icon={<IconCircleDot size={11} />} />
        </>
      )}
      <Divider orientation="vertical" />
      <Text size="sm" c="dimmed" lh={1}>{services.length} total</Text>
    </Group>
  );
}

/**
 * Bordered paper wrapper around StatusCounts — useful as a standalone section.
 */
export function StatusSummaryBar({ services }: StatusCountsProps) {
  return (
    <Paper withBorder radius="md" px="md" py="xs">
      <StatusCounts services={services} />
    </Paper>
  );
}
