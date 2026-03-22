/**
 * Shared CSS constants for the header shell.
 * Kept here so DashboardHeader.tsx and any future header sub-components
 * can reference the same values without duplication.
 *
 * Mantine's Box has no single-side border prop — borderBottom must stay in style.
 * The var() references are theme-aware via cssVariablesResolver.
 */
export const HEADER_HEIGHT = 56;

export const headerBorderStyle = {
  borderBottom: '1px solid var(--shell-border)',
} as const;

// --shell-surface resolves to different colours per color-scheme via cssVariablesResolver.
export const SHELL_SURFACE = 'var(--shell-surface)';
