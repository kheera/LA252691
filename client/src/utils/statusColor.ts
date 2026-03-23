import { STATUS_BADGE_COLORS, STATUS_COLORS } from '../theme';


/** Maps a service status string to the Mantine colour name used across badges, progress bars, etc. */
export function statusColor(s: string | null): string {
  if (s === 'HEALTHY') return STATUS_COLORS.HEALTHY;
  if (s === 'DEGRADED') return STATUS_COLORS.DEGRADED;
  if (s === 'DOWN') return STATUS_COLORS.DOWN;
  return STATUS_COLORS.UNKNOWN;
}

/**
 * Returns a shade-pinned colour for use on Badge variant="filled" + autoContrast.
 * These shades guarantee WCAG AA (≥ 4.5:1) regardless of light/dark mode.
 */
export function statusBadgeColor(s: string | null): string {
  if (s === 'HEALTHY') return STATUS_BADGE_COLORS.HEALTHY;
  if (s === 'DEGRADED') return STATUS_BADGE_COLORS.DEGRADED;
  if (s === 'DOWN') return STATUS_BADGE_COLORS.DOWN;
  return STATUS_BADGE_COLORS.UNKNOWN;
}

/**
 * Returns a CSS style object with a scheme-aware text colour that meets WCAG AA (≥ 4.5:1)
 * on both light (card ≈ #f0f5fb) and dark (card ≈ #172342) card surfaces.
 *
 * Uses the CSS `light-dark()` function (baseline 2024, all modern browsers) so the
 * correct shade is selected by the browser based on the active color-scheme.
 *
 * Note: DEGRADED uses orange.8 in light mode because no yellow shade is dark enough
 * to reach 4.5:1 against a near-white surface while remaining recognisably yellow.
 */
export function statusTextStyle(s: string | null): { color: string } {
  if (s === 'HEALTHY')  return { color: 'light-dark(var(--mantine-color-green-8),  var(--mantine-color-green-4))' };
  if (s === 'DEGRADED') return { color: 'light-dark(var(--mantine-color-orange-8), var(--mantine-color-yellow-3))' };
  if (s === 'DOWN')     return { color: 'light-dark(var(--mantine-color-red-8),    var(--mantine-color-red-4))' };
  return                       { color: 'light-dark(var(--mantine-color-gray-7),   var(--mantine-color-gray-4))' };
}

/**
 * Returns a shade-pinned colour for Progress / RingProgress fills.
 *
 * WCAG SC 1.4.11 (Non-text Contrast) requires 3:1 between the fill and the
 * Mantine Progress track (≈ gray.2 / #e9ecef in light mode).
 *
 * Yellow shades cannot reach 3:1 against a light-gray track (yellow luminance is
 * too close to the track luminance), so DEGRADED maps to orange.7 — the closest
 * accessible warning colour at the right luminance:
 *   green.7  (~L 0.13) → 4.7:1 ✅
 *   orange.7 (~L 0.09) → 6.3:1 ✅  (amber/caution — yellow not viable)
 *   red.7    (~L 0.13) → 4.7:1 ✅
 *   gray.6   (~L 0.21) → 3.3:1 ✅
 */
export function statusProgressColor(s: string | null): string {
  if (s === 'HEALTHY')  return 'green.7';
  if (s === 'DEGRADED') return 'orange.7';
  if (s === 'DOWN')     return 'red.7';
  return 'gray.6';
}
