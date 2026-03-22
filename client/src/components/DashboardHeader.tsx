import { type ReactNode } from 'react';
import { ActionIcon, Box, Button, Group, Popover, rem, Stack, Text, ThemeIcon, Tooltip } from '@mantine/core';
import { IconChevronLeft, IconMenu2, IconPalette, IconServer } from '@tabler/icons-react';
import { ColorSchemeToggle } from './ColorSchemeToggle';
import { ThemeProfileSwitcher } from './ThemeProfileSwitcher';
import { BRAND_GRADIENT } from '../theme';

interface DashboardHeaderProps {
  onMenuToggle: () => void;
  onHomeClick: () => void;
  /** Extra buttons/controls rendered on the right side, before the appearance popover */
  actions?: ReactNode;
}

// Mantine's Box has no single-side border prop — borderBottom must stay in style.
// The var() reference is still theme-aware via cssVariablesResolver.
const headerBorderStyle = { borderBottom: '1px solid var(--shell-border)' } as const;

// bg accepts var() strings directly — Mantine passes them through to CSS.
// --shell-surface resolves to different colours per mode via cssVariablesResolver.
const SHELL_SURFACE = 'var(--shell-surface)';

export function DashboardHeader({ onMenuToggle, onHomeClick, actions }: DashboardHeaderProps) {
  return (
    <Box
      bg={SHELL_SURFACE}
      style={{
        height: 56,
        flexShrink: 0,
        ...headerBorderStyle,
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
      }}
    >
      <Group justify="space-between" style={{ width: '100%' }}>
        <Group gap="sm">
          <Button variant="subtle" size="sm" hiddenFrom="lg" onClick={onMenuToggle} px="xs">
            <IconMenu2 size={18} />
          </Button>
          <Button
            variant="subtle"
            size="sm"
            hiddenFrom="sm"
            leftSection={<IconChevronLeft size={16} />}
            onClick={onHomeClick}
          >
            Home
          </Button>
          <Group gap={rem(8)} visibleFrom="sm">
            <ThemeIcon variant="gradient" gradient={BRAND_GRADIENT} size="sm">
              <IconServer size={14} />
            </ThemeIcon>
            <Text fw={700} size="md">DeployDash</Text>
          </Group>
        </Group>
        <Group gap="xs">
          {actions}
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
        </Group>
      </Group>
    </Box>
  );
}
