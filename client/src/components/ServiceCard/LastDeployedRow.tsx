import { Group, Text } from '@mantine/core';
import { IconClock } from '@tabler/icons-react';
import { RelativeDate } from '../RelativeDate';

interface LastDeployedRowProps {
  lastDeployedAt: string | null;
}

export function LastDeployedRow({ lastDeployedAt }: LastDeployedRowProps) {
  return (
    <Group gap="xs">
      <IconClock size={13} color="var(--mantine-color-dimmed)" />
      <Text size="xs" c="dimmed">Last deployed:</Text>
      {lastDeployedAt
        ? <RelativeDate iso={lastDeployedAt} size="xs" />
        : <Text size="xs" c="dimmed">Never</Text>}
    </Group>
  );
}
