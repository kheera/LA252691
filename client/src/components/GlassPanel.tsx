import { rem, Stack, type StackProps } from '@mantine/core';

const frostedStyle = {
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)',
  borderRadius: rem(12),
  border: '1px solid rgba(255, 255, 255, 0.08)',
} as const;

interface GlassPanelProps extends StackProps {
  /** Background darkness; 0–1. Defaults to 0.35. */
  bgOpacity?: number;
}

export function GlassPanel({ bgOpacity = 0.35, style, ...rest }: GlassPanelProps) {
  return (
    <Stack
      style={{ ...frostedStyle, background: `rgba(0, 0, 0, ${bgOpacity})`, ...style }}
      {...rest}
    />
  );
}
