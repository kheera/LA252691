import { type ReactNode } from 'react';
import { Box, Group } from '@mantine/core';
import { AppearancePopover } from './AppearancePopover';
import { HeaderBrand } from './HeaderBrand';
import { HeaderNavControls } from './HeaderNavControls';
import { HEADER_HEIGHT, headerBorderStyle, SHELL_SURFACE } from './headerStyles';

export interface DashboardHeaderProps {
  onMenuToggle: () => void;
  onHomeClick: () => void;
  /** Extra buttons/controls rendered on the right side, before the appearance popover */
  actions?: ReactNode;
}

export function DashboardHeader({ onMenuToggle, onHomeClick, actions }: DashboardHeaderProps) {
  return (
    <Box
      bg={SHELL_SURFACE}
      px="md"
      style={{
        height: HEADER_HEIGHT,
        flexShrink: 0,
        ...headerBorderStyle,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Group justify="space-between" style={{ width: '100%' }}>
        <Group gap="sm">
          <HeaderNavControls onMenuToggle={onMenuToggle} onHomeClick={onHomeClick} />
          <HeaderBrand />
        </Group>
        <Group gap="xs">
          {actions}
          <AppearancePopover />
        </Group>
      </Group>
    </Box>
  );
}
