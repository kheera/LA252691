import { type ComponentProps } from 'react';
import { GlassPanel } from '../GlassPanel';
import { useHeroPanelContext } from './HeroPanelContext';

type HeroGlassPanelProps = Omit<ComponentProps<typeof GlassPanel>, 'px' | 'py'>;

/** GlassPanel that picks up compact-aware padding from HeroPanelContext. */
export function HeroGlassPanel(props: HeroGlassPanelProps) {
  const { compact } = useHeroPanelContext();
  return (
    <GlassPanel
      px={compact ? 'md' : 'xl'}
      py={compact ? 'sm' : 'md'}
      {...props}
    />
  );
}
