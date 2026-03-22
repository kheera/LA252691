import { STATUS_COLORS } from '../theme';

/** Maps a service status string to the Mantine colour name used across badges, progress bars, etc. */
export function statusColor(s: string | null): string {
  if (s === 'HEALTHY') return STATUS_COLORS.HEALTHY;
  if (s === 'DEGRADED') return STATUS_COLORS.DEGRADED;
  if (s === 'DOWN') return STATUS_COLORS.DOWN;
  return STATUS_COLORS.UNKNOWN;
}
