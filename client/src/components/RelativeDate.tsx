import { useState } from 'react';
import { Text, Tooltip } from '@mantine/core';
import { formatAbsoluteDate, formatRelativeDate } from '../utils/dateFormat';

interface RelativeDateProps {
  iso: string;
  /** Text size passed to Mantine Text. Defaults to 'sm'. */
  size?: string;
}

/**
 * Inline date text that toggles between relative ("2d ago") and absolute
 * ("20 Mar 2026, 10:00 am") on click. No icon — suitable for table cells
 * or any inline context. Use LastDeployedRow for the icon+row layout variant.
 */
export function RelativeDate({ iso, size = 'sm' }: RelativeDateProps) {
  const [showAbsolute, setShowAbsolute] = useState(false);
  const label = showAbsolute ? formatAbsoluteDate(iso) : formatRelativeDate(iso);
  const tooltip = showAbsolute ? 'Click to show relative time' : 'Click to show exact date/time';

  return (
    <Tooltip label={tooltip} withArrow openDelay={400}>
      <Text
        size={size}
        c="dimmed"
        style={{ cursor: 'pointer', userSelect: 'none' }}
        onClick={() => setShowAbsolute((v) => !v)}
      >
        {label}
      </Text>
    </Tooltip>
  );
}
