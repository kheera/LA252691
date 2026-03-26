import { type ReactNode } from 'react';
import { Stack, Text, Title } from '@mantine/core';
import { useHeroPanelContext } from './HeroPanelContext';

interface HeroTextProps {
  children: ReactNode;
}

/** Compact-aware content stack — outer layout container inside the hero center. */
export function HeroContentStack({ children, maw }: { children: ReactNode; maw?: number }) {
  const { compact } = useHeroPanelContext();
  return (
    <Stack align="center" gap={compact ? 'lg' : 'xl'} px="xl" maw={maw}>
      {children}
    </Stack>
  );
}

/** Compact-aware eyebrow label — uppercase, brand-tinted, letter-spaced. */
export function HeroSubtitle({ children }: HeroTextProps) {
  const { compact } = useHeroPanelContext();
  return (
    <Text
      size={compact ? 'xs' : 'sm'}
      fw={600}
      tt="uppercase"
      c="brand.3"
      style={{ letterSpacing: '0.2em' }}
    >
      {children}
    </Text>
  );
}

/** Compact-aware hero title — fluid font size, white, centred. */
export function HeroTitle({ children }: HeroTextProps) {
  const { compact } = useHeroPanelContext();
  return (
    <Title
      order={compact ? 2 : 1}
      ta="center"
      c="white"
      style={{
        fontSize: compact ? 'clamp(1.1rem, 2.5vw, 2rem)' : 'clamp(1.8rem, 5vw, 3.2rem)',
        lineHeight: compact ? 1.25 : 1.2,
      }}
    >
      {children}
    </Title>
  );
}
