import { ActionIcon, Popover, Stack, Text, Tooltip } from '@mantine/core';
import { IconPalette } from '@tabler/icons-react';
import { ColorSchemeToggle } from '../ColorSchemeToggle';
import { ThemeProfileSwitcher } from '../ThemeProfileSwitcher';

export function AppearancePopover() {
  return (
    <Popover position="bottom-end" withArrow shadow="md" width={220}>
      <Popover.Target>
        <Tooltip label="Appearance" withArrow openDelay={400}>
          <ActionIcon variant="subtle" size="md" aria-label="Appearance settings">
            <IconPalette size={18} />
          </ActionIcon>
        </Tooltip>
      </Popover.Target>
      <Popover.Dropdown>
        <Stack gap="sm">
          <Text size="xs" fw={600} c="dimmed" tt="uppercase">Colour theme</Text>
          <ThemeProfileSwitcher />
          <Text size="xs" fw={600} c="dimmed" tt="uppercase">Color scheme</Text>
          <ColorSchemeToggle />
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}
