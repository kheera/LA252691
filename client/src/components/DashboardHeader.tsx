import { type ReactNode } from 'react';
import { Box, Button, Group, rem, Text, ThemeIcon } from '@mantine/core';
import { IconChevronLeft, IconMenu2, IconServer } from '@tabler/icons-react';
import { ColorSchemeToggle } from './ColorSchemeToggle';

interface DashboardHeaderProps {
  onMenuToggle: () => void;
  onHomeClick: () => void;
  /** Extra buttons/controls rendered on the right side, before ColorSchemeToggle */
  actions?: ReactNode;
}

export function DashboardHeader({ onMenuToggle, onHomeClick, actions }: DashboardHeaderProps) {
  return (
    <Box
      style={{
        height: 56,
        flexShrink: 0,
        background: 'var(--mantine-color-default)',
        borderBottom: '1px solid var(--mantine-color-default-border)',
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
            <ThemeIcon variant="gradient" gradient={{ from: 'blue', to: 'cyan' }} size="sm">
              <IconServer size={14} />
            </ThemeIcon>
            <Text fw={700} size="md">DeployDash</Text>
          </Group>
        </Group>
        <Group gap="xs">
          {actions}
          <ColorSchemeToggle />
        </Group>
      </Group>
    </Box>
  );
}
