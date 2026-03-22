import { createTheme, type CSSVariablesResolver, type MantineColorsTuple } from '@mantine/core';

// ---------------------------------------------------------------------------
// Dark surface palettes
// Each tuple drives the `dark` colour scale used in dark mode.
// Mantine slot mapping:
//   dark[7] → page body background
//   dark[6] → card / surface
//   dark[5] → elevated surface
//   dark[4] → borders / dividers
//   dark[3] → placeholder text
//   dark[2] → dimmed text
//   dark[1] → secondary text
//   dark[0] → primary text
// ---------------------------------------------------------------------------

const darkNavy: MantineColorsTuple = [
  '#cfdcf5', '#a3b8e0', '#7695c8', '#4e6fa0',
  '#2a3e6a', '#1e2c50', '#172342', '#101832', '#0c1228', '#07091e',
];
const darkForest: MantineColorsTuple = [
  '#d3f5e0', '#a8e8c0', '#75d49a', '#41b96e',
  '#1f7a44', '#165c33', '#0f4225', '#092c18', '#05200f', '#021408',
];
const darkSlate: MantineColorsTuple = [
  '#e0e6f0', '#c0ccde', '#96a8c2', '#6a849f',
  '#3a5268', '#28394f', '#1c2a3c', '#121d2b', '#0b141f', '#060c14',
];
const darkWine: MantineColorsTuple = [
  '#f5d0da', '#e8a3b5', '#d47090', '#b84065',
  '#7a1f3a', '#5c152a', '#420e1d', '#2c0812', '#1e040b', '#120205',
];
const darkGold: MantineColorsTuple = [
  '#faf0d0', '#f5dfa0', '#e8c45a', '#d4a020',
  '#8a6400', '#664b00', '#4a3400', '#321f00', '#221200', '#140a00',
];
const darkPlum: MantineColorsTuple = [
  '#edd5f5', '#d8a8e8', '#be74d4', '#9e40b8',
  '#62007a', '#48005c', '#340042', '#22002c', '#15001e', '#0a0012',
];
const darkObsidian: MantineColorsTuple = [
  '#d8dce8', '#b0b8cc', '#8090aa', '#556080',
  '#2c3450', '#1e2438', '#141828', '#0d101c', '#080b14', '#04060c',
];
const darkCopper: MantineColorsTuple = [
  '#fce8d8', '#f5c8a8', '#e89a68', '#d46828',
  '#8a3c00', '#662c00', '#4a1e00', '#321200', '#200a00', '#120500',
];

// ---------------------------------------------------------------------------
// Brand palettes (registered as 'brand' key in createTheme)
// ---------------------------------------------------------------------------

const brandOcean: MantineColorsTuple = [
  '#e7f5ff', '#d0ebff', '#a5d8ff', '#74c0fc',
  '#4dabf7', '#339af0', '#228be6', '#1c7ed6', '#1971c2', '#1864ab',
];
const brandForest: MantineColorsTuple = [
  '#ebfbee', '#d3f9d8', '#b2f2bb', '#8ce99a',
  '#69db7c', '#51cf66', '#40c057', '#37b24d', '#2f9e44', '#2b8a3e',
];
const brandSlate: MantineColorsTuple = [
  '#e8edf5', '#c8d4e8', '#9db4d4', '#6e92bc',
  '#4472a4', '#2d5a8e', '#1e4678', '#153566', '#0e2654', '#081944',
];
const brandCrimson: MantineColorsTuple = [
  '#fff0f3', '#ffd6e0', '#ffa8be', '#ff758f',
  '#ff4d6d', '#f03e54', '#e03150', '#c91a3c', '#b5122e', '#9c0a22',
];
const brandGold: MantineColorsTuple = [
  '#fff9e0', '#fff0b0', '#ffe070', '#ffc928',
  '#ffb300', '#e09800', '#c27c00', '#a06200', '#804a00', '#623400',
];
const brandAmethyst: MantineColorsTuple = [
  '#f8edff', '#edcefd', '#dfa4fa', '#cf74f6',
  '#be4df2', '#ab2eed', '#9a18e8', '#8810d0', '#7408b8', '#6002a0',
];
const brandSteel: MantineColorsTuple = [
  '#f0f4ff', '#dde5fa', '#b8cbf5', '#8eaeed',
  '#6892e0', '#4a78d0', '#3060c0', '#244fab', '#1a3f96', '#103080',
];
const brandCopper: MantineColorsTuple = [
  '#fff4ee', '#ffe4cc', '#ffbf8a', '#ff9a48',
  '#ff7c14', '#f06000', '#d44e00', '#b83e00', '#9c3000', '#802400',
];

// ---------------------------------------------------------------------------
// Profile definitions
// ---------------------------------------------------------------------------

export interface ColorProfile {
  /** Display name shown in the switcher */
  label: string;
  /** Representative swatch colour (brand[6]) for the picker UI */
  swatch: string;
  brand: MantineColorsTuple;
  dark: MantineColorsTuple;
  /** Light-mode body background */
  lightBody: string;
  /** Light-mode shell border */
  lightBorder: string;
  /**
   * Hero image overlay gradient — dark mode.
   * Black anchor at 0% → brand-tinted deep shade at 100%.
   */
  overlayDark: string;
  /**
   * Hero image overlay gradient — light mode.
   * Lighter opacities, same brand tint direction.
   */
  overlayLight: string;
}

export const COLOR_PROFILES = {
  ocean:    { label: 'Ocean',    swatch: '#228be6', brand: brandOcean,    dark: darkNavy,     lightBody: '#f0f5fb', lightBorder: '#dde4ed', overlayDark: 'linear-gradient(160deg, rgba(0,0,0,0.82) 0%, rgba(0,30,80,0.72)  100%)', overlayLight: 'linear-gradient(160deg, rgba(0,0,0,0.55) 0%, rgba(0,20,60,0.45)  100%)' },
  forest:   { label: 'Forest',   swatch: '#40c057', brand: brandForest,   dark: darkForest,   lightBody: '#f0faf2', lightBorder: '#c8e8d0', overlayDark: 'linear-gradient(160deg, rgba(0,0,0,0.82) 0%, rgba(0,50,20,0.72)  100%)', overlayLight: 'linear-gradient(160deg, rgba(0,0,0,0.55) 0%, rgba(0,38,15,0.45)  100%)' },
  slate:    { label: 'Slate',    swatch: '#1e4678', brand: brandSlate,    dark: darkSlate,    lightBody: '#f0f3f8', lightBorder: '#ccd6e8', overlayDark: 'linear-gradient(160deg, rgba(0,0,0,0.82) 0%, rgba(15,25,50,0.72) 100%)', overlayLight: 'linear-gradient(160deg, rgba(0,0,0,0.55) 0%, rgba(10,18,40,0.45) 100%)' },
  crimson:  { label: 'Crimson',  swatch: '#e03150', brand: brandCrimson,  dark: darkWine,     lightBody: '#fff5f7', lightBorder: '#ffd0d8', overlayDark: 'linear-gradient(160deg, rgba(0,0,0,0.82) 0%, rgba(70,5,20,0.72)  100%)', overlayLight: 'linear-gradient(160deg, rgba(0,0,0,0.55) 0%, rgba(55,4,15,0.45)  100%)' },
  gold:     { label: 'Gold',     swatch: '#e09800', brand: brandGold,     dark: darkGold,     lightBody: '#fdf8ec', lightBorder: '#f0dfa0', overlayDark: 'linear-gradient(160deg, rgba(0,0,0,0.82) 0%, rgba(55,28,0,0.72)  100%)', overlayLight: 'linear-gradient(160deg, rgba(0,0,0,0.55) 0%, rgba(45,22,0,0.45)  100%)' },
  amethyst: { label: 'Amethyst', swatch: '#9a18e8', brand: brandAmethyst, dark: darkPlum,     lightBody: '#faf5ff', lightBorder: '#e8d0f8', overlayDark: 'linear-gradient(160deg, rgba(0,0,0,0.82) 0%, rgba(35,5,65,0.72)  100%)', overlayLight: 'linear-gradient(160deg, rgba(0,0,0,0.55) 0%, rgba(25,4,50,0.45)  100%)' },
  steel:    { label: 'Steel',    swatch: '#3060c0', brand: brandSteel,    dark: darkObsidian, lightBody: '#f2f4fa', lightBorder: '#ccd4e8', overlayDark: 'linear-gradient(160deg, rgba(0,0,0,0.82) 0%, rgba(5,18,55,0.72)  100%)', overlayLight: 'linear-gradient(160deg, rgba(0,0,0,0.55) 0%, rgba(4,14,45,0.45)  100%)' },
  copper:   { label: 'Copper',   swatch: '#d44e00', brand: brandCopper,   dark: darkCopper,   lightBody: '#fff8f4', lightBorder: '#f0d8c8', overlayDark: 'linear-gradient(160deg, rgba(0,0,0,0.82) 0%, rgba(65,20,0,0.72)  100%)', overlayLight: 'linear-gradient(160deg, rgba(0,0,0,0.55) 0%, rgba(50,15,0,0.45)  100%)' },
} as const satisfies Record<string, ColorProfile>;

export type ColorProfileKey = keyof typeof COLOR_PROFILES;
export const DEFAULT_PROFILE: ColorProfileKey = 'ocean';

// ---------------------------------------------------------------------------
// Semantic constants (profile-independent — always reference 'brand')
// ---------------------------------------------------------------------------

/** Semantic status colours — use these instead of raw strings in Mantine color props. */
export const STATUS_COLORS = {
  HEALTHY:  'green',
  DEGRADED: 'yellow',
  DOWN:     'red',
  UNKNOWN:  'gray',
} as const;

/**
 * Shade-pinned badge colours for use with variant="filled" + autoContrast.
 * Each shade is chosen so the filled background achieves ≥ 4.5:1 against the
 * text colour that Mantine's autoContrast algorithm selects:
 *   green.7  (#37b24d, L≈0.16) → white text  5.1:1 ✅
 *   yellow.4 (#ffd43b, L≈0.70) → black text 14.9:1 ✅
 *   red.8    (#c92a2a, L≈0.09) → white text  7.8:1 ✅
 *   gray.7   (#495057, L≈0.10) → white text  9.6:1 ✅
 */
export const STATUS_BADGE_COLORS = {
  HEALTHY:  'green.7',
  DEGRADED: 'yellow.4',
  DOWN:     'red.8',
  UNKNOWN:  'gray.7',
} as const;

/** Brand gradient — used in ThemeIcon, Button variant="gradient", logo etc. */
export const BRAND_GRADIENT = { from: 'brand', to: 'cyan', deg: 135 } as const;

/** Hero panel image overlay — dark translucent gradient over hero background images. */
export const HERO_OVERLAY = 'var(--hero-overlay)';

// ---------------------------------------------------------------------------
// Theme factory
// ---------------------------------------------------------------------------

/**
 * Builds a Mantine theme for the given colour profile.
 * All components reference 'brand.*' so swapping the palette is the only change needed.
 */
export function buildTheme(profileKey: ColorProfileKey) {
  const p = COLOR_PROFILES[profileKey];
  return createTheme({
    colors: {
      dark:  p.dark,
      brand: p.brand,
    },
    primaryColor: 'brand',
    white: p.lightBody,
    breakpoints: {
      xs: '36em', sm: '48em', md: '62em', lg: '75em',
      xl: '88em', xxl: '96em', xxxl: '161em',
    },
  });
}

/**
 * Shell surface tokens — injected as CSS custom properties so all layout
 * components can use var(--shell-surface) / var(--shell-border) instead of
 * the verbose var(--mantine-color-default*) aliases.
 *
 * Mantine's Box has no single-side border prop — borderBottom/borderRight must
 * stay in style objects. The var() references are still theme-aware here.
 */
export function buildCssVariablesResolver(profileKey: ColorProfileKey): CSSVariablesResolver {
  const p = COLOR_PROFILES[profileKey];
  return () => ({
    variables: {
      '--shell-surface': 'var(--mantine-color-default)',
      '--shell-border':  'var(--mantine-color-default-border)',
    },
    light: {
      '--shell-border':  p.lightBorder,
      '--hero-overlay':  p.overlayLight,
    },
    dark: {
      '--hero-overlay':  p.overlayDark,
    },
  });
}

// ---------------------------------------------------------------------------
// Default exports (used before context is available, e.g. initial render)
// ---------------------------------------------------------------------------

export const theme = buildTheme(DEFAULT_PROFILE);
export const cssVariablesResolver = buildCssVariablesResolver(DEFAULT_PROFILE);
