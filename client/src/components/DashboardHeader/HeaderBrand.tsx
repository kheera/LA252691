import { Group, rem, Text, ThemeIcon } from '@mantine/core';
import { IconServer } from '@tabler/icons-react';
import { BRAND_GRADIENT } from '../../theme';

/** App logo mark + wordmark. Hidden below the `sm` breakpoint on mobile. */
export function HeaderBrand() {
  return (
    <Group gap={rem(8)} visibleFrom="sm">
      <ThemeIcon variant="gradient" gradient={BRAND_GRADIENT} size="sm">
        <IconServer size={14} />
      </ThemeIcon>
      <Text fw={700} size="md">DeployDash</Text>
    </Group>
  );
}
