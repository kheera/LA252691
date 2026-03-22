/**
 * Returns a human-readable relative time string from an ISO date.
 *
 * @param iso - ISO 8601 date string
 * @returns e.g. `"5m ago"`, `"3h ago"`, `"2d ago"`
 */
export function formatRelativeDate(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

/**
 * Returns a locale-formatted absolute date+time string from an ISO date.
 *
 * @param iso - ISO 8601 date string
 * @returns e.g. `"20 Mar 2026, 10:00 am"`
 */
export function formatAbsoluteDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}
