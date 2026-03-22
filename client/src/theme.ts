import { createTheme, type MantineColorsTuple } from '@mantine/core';

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

export const theme = createTheme({
  colors: {
    dark: navyDark,
  },

  primaryColor: 'blue',

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
