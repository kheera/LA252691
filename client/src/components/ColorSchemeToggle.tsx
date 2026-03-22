import { Button, rem, useMantineColorScheme } from '@mantine/core';
import { IconMoon, IconSun } from '@tabler/icons-react';

interface ColorSchemeToggleProps {
  /** 'white' for use over dark hero images; 'subtle' for use inside UI chrome */
  variant?: 'white' | 'subtle';
  /** When true, positions the button absolutely in the top-right corner (zIndex 300) */
  floating?: boolean;
}

export function ColorSchemeToggle({ variant = 'subtle', floating = false }: ColorSchemeToggleProps) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  return (
    <Button
      variant={variant}
      size="sm"
      style={floating ? { position: 'absolute', top: rem(16), right: rem(16), zIndex: 300 } : undefined}
      onClick={() => toggleColorScheme()}
      leftSection={colorScheme === 'dark' ? <IconSun size={16} /> : <IconMoon size={16} />}
    >
      {colorScheme === 'dark' ? 'Light' : 'Dark'}
    </Button>
  );
}
