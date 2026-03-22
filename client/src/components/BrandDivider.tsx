import { Box, Group, rem, Text } from '@mantine/core';

interface BrandDividerProps {
  label: string;
  /** compact=true shrinks line width and font size for sidebar/panel contexts */
  compact?: boolean;
  mt?: string;
}

export function BrandDivider({ label, compact = false, mt }: BrandDividerProps) {
  const lineWidth = compact ? 36 : 48;
  const fontSize = compact
    ? 'clamp(0.75rem, 1.5vw, 1.1rem)'
    : 'clamp(1rem, 2.5vw, 1.35rem)';

  return (
    <Group gap="xs" justify="center" mt={mt}>
      <Box
        style={{
          height: 2,
          width: rem(lineWidth),
          background: 'var(--mantine-color-blue-4)',
          borderRadius: 2,
        }}
      />
      <Text fw={500} c="blue.2" style={{ fontSize }}>
        {label}
      </Text>
      <Box
        style={{
          height: 2,
          width: rem(lineWidth),
          background: 'var(--mantine-color-blue-4)',
          borderRadius: 2,
        }}
      />
    </Group>
  );
}
