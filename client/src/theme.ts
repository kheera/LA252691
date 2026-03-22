import { createTheme, type CSSVariablesResolver, type MantineColorsTuple } from '@mantine/core';

/**
 * Navy-blue dark palette — replaces Mantine's default grey-dark scale.
 *
 * Mantine dark-mode slot mapping:
 *   dark[7] → --mantine-color-body         (page background)
 *   dark[6] → card / surface background
 *   dark[5] → slightly elevated surface
 *   dark[4] → borders, dividers
 *   dark[3] → placeholder / disabled text
 *   dark[2] → dimmed text
 *   dark[1] → secondary text
 *   dark[0] → primary text
 */
const navyDark: MantineColorsTuple = [
  '#cfdcf5', // 0  primary text
  '#a3b8e0', // 1  secondary text
  '#7695c8', // 2  dimmed text
  '#4e6fa0', // 3  placeholder / disabled
  '#2a3e6a', // 4  borders / dividers
  '#1e2c50', // 5  elevated surface (hover states)
  '#172342', // 6  card / surface background
  '#101832', // 7  page body background  ← the main bg colour
  '#0c1228', // 8  deeper wells
  '#07091e', // 9  deepest (tooltips etc.)
];

/**
 * Brand colour palette — Mantine's blue scale, registered under the 'brand' key
 * so all colour props use brand.N instead of leaking the implementation detail 'blue'.
 * Seed: #228be6 (Mantine blue-6). Swap this tuple to rebrand the entire app.
 */
const brandPalette: MantineColorsTuple = [
  '#e7f5ff', // 0
  '#d0ebff', // 1
  '#a5d8ff', // 2
  '#74c0fc', // 3
  '#4dabf7', // 4
  '#339af0', // 5
  '#228be6', // 6  ← primary shade
  '#1c7ed6', // 7
  '#1971c2', // 8
  '#1864ab', // 9
];

/** Semantic status colours — use these instead of raw strings in Mantine color props. */
export const STATUS_COLORS = {
  HEALTHY:  'green',
  DEGRADED: 'yellow',
  DOWN:     'red',
  UNKNOWN:  'gray',
} as const;

/** Brand gradient — used in ThemeIcon, Button variant="gradient", logo etc. */
export const BRAND_GRADIENT = { from: 'brand', to: 'cyan', deg: 135 } as const;

/** Hero panel image overlay — dark translucent gradient over hero background images. */
export const HERO_OVERLAY = 'var(--hero-overlay)';

/**
 * Shell surface tokens — injected as CSS custom properties so all layout
 * components can use var(--shell-surface) / var(--shell-border) instead of
 * the verbose var(--mantine-color-default*) aliases.
 */
export const cssVariablesResolver: CSSVariablesResolver = () => ({
  variables: {
    '--shell-surface': 'var(--mantine-color-default)',
    '--shell-border':  'var(--mantine-color-default-border)',
    '--hero-overlay':  'linear-gradient(160deg, rgba(0,0,0,0.82) 0%, rgba(0,30,80,0.72) 100%)',
  },
  light: {
    '--shell-border': '#dde4ed', // muted blue-gray dividers in light mode
  },
  dark: {},
});

export const theme = createTheme({
  colors: {
    dark:  navyDark,
    brand: brandPalette,
  },

  primaryColor: 'brand',

  /**
   * white / black control --mantine-color-body and surface defaults in light/dark mode.
   * Setting white to a soft blue-tinted off-white gives the light theme a warm, non-stark feel.
   */
  white: '#f0f5fb',

  /** Custom breakpoints — xxxl hides the splash panel on everything up to ~3/4 of a 34" ultrawide */
  breakpoints: {
    xs: '36em',
    sm: '48em',
    md: '62em',
    lg: '75em',
    xl: '88em',
    xxl: '96em',   // ~1536px
    xxxl: '161em', // ~2576px — splash panel appears only above this
  },
});
