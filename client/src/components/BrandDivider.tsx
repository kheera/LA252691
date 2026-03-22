import { Box, Group, rem, Text } from '@mantine/core';
import { useHeroPanelContext } from './HeroPanelContext';

interface BrandDividerProps {
  label: string;
  mt?: string;
}

/**
 * Decorative section label — a text string flanked by two short blue accent bars.
 *
 * Use it to visually separate or title a section with brand styling, without the
 * structural weight of a `<Title>`. Always centred; not a replacement for headings.
 *
 * @example
 * // Full-size hero label (default, renders inside a non-compact HeroPanelProvider)
 * <BrandDivider label="DevOps Services" mt="xs" />
 *
 * // Compact sizing is inherited automatically inside a compact HeroPanelProvider
 * <BrandDivider label="Recent Deployments" mt="md" />
 */
export function BrandDivider({ label, mt }: BrandDividerProps) {
  const { compact } = useHeroPanelContext();
  const lineWidth = compact ? 36 : 48;
  const fontSize = compact
    ? 'clamp(0.75rem, 1.5vw, 1.1rem)'
    : 'clamp(1rem, 2.5vw, 1.35rem)';

  return (
    <Group gap="xs" justify="center" mt={mt}>
      <Box
        bg="brand.4"
        style={{
          height: 2,
          width: rem(lineWidth),
          borderRadius: 2,
        }}
      />
      <Text fw={500} c="brand.2" style={{ fontSize }}>
        {label}
      </Text>
      <Box
        bg="brand.4"
        style={{
          height: 2,
          width: rem(lineWidth),
          borderRadius: 2,
        }}
      />
    </Group>
  );
}
