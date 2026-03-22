import { Group, Text } from '@mantine/core';
import { IconClock } from '@tabler/icons-react';

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

interface LastDeployedRowProps {
  lastDeployedAt: string | null;
}

export function LastDeployedRow({ lastDeployedAt }: LastDeployedRowProps) {
  return (
    <Group gap="xs">
      <IconClock size={13} color="var(--mantine-color-dimmed)" />
      <Text size="xs" c="dimmed">{formatLastDeployed(lastDeployedAt)}</Text>
    </Group>
  );
}
