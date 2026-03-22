import { useState } from 'react';
import { Group, Text, Tooltip } from '@mantine/core';
import { IconClock } from '@tabler/icons-react';

function formatRelative(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function formatAbsolute(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

interface LastDeployedRowProps {
  lastDeployedAt: string | null;
}

export function LastDeployedRow({ lastDeployedAt }: LastDeployedRowProps) {
  const [showAbsolute, setShowAbsolute] = useState(false);

  if (!lastDeployedAt) {
    return (
      <Group gap="xs">
        <IconClock size={13} color="var(--mantine-color-dimmed)" />
        <Text size="xs" c="dimmed">Never deployed</Text>
      </Group>
    );
  }

  const label = showAbsolute ? formatAbsolute(lastDeployedAt) : formatRelative(lastDeployedAt);
  const tooltip = showAbsolute ? 'Click to show relative time' : 'Click to show exact date/time';

  return (
    <Group gap="xs">
      <IconClock size={13} color="var(--mantine-color-dimmed)" />
      <Tooltip label={tooltip} withArrow openDelay={400}>
        <Text
          size="xs"
          c="dimmed"
          style={{ cursor: 'pointer', userSelect: 'none' }}
          onClick={() => setShowAbsolute((v) => !v)}
        >
          {label}
        </Text>
      </Tooltip>
    </Group>
  );
}
