import { Group, Skeleton, Text } from '@mantine/core';
import { IconClock } from '@tabler/icons-react';
import { RelativeDate } from '../RelativeDate';

interface LastDeployedRowProps {
  lastDeployedAt: string | null;
  loading?: boolean;
}

export function LastDeployedRow({ lastDeployedAt, loading }: LastDeployedRowProps) {
  return (
    <Group gap="xs">
      <IconClock size={13} color="var(--mantine-color-dimmed)" />
      {loading
        ? <Skeleton height={10} width="55%" radius="sm" />
        : lastDeployedAt
          ? <RelativeDate iso={lastDeployedAt} size="xs" />
          : <Text size="xs" c="dimmed">Never deployed</Text>}
    </Group>
  );
}
