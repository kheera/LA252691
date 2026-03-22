import { useComputedColorScheme } from '@mantine/core';
import heroLight from '../../assets/leg-hero-light-image.jpg';
import heroDark from '../../assets/leg-hero-dark-image.jpg';

export function useHeroImage(): string {
  const scheme = useComputedColorScheme('dark');
  return scheme === 'dark' ? heroDark : heroLight;
}
