import { Box, Button, Stack, Text } from '@mantine/core';
import {
  IconActivity,
  IconHome,
} from '@tabler/icons-react';
import { type ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSplash } from './SplashContext';

interface DashboardSidebarProps {
  navOpen: boolean;
  onClose: () => void;
}

interface NavButtonProps {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
}

function NavButton({ icon, label, onClick, active = false }: NavButtonProps) {
  return (
    <Button
      variant={active ? 'light' : 'subtle'}
      justify="start"
      leftSection={icon}
      fullWidth
      size="sm"
      onClick={onClick}
    >
      {label}
    </Button>
  );
}

function NavContent({ onClose }: { onClose?: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { show: showSplash } = useSplash();

  const navigateTo = (path: string) => { navigate(path); onClose?.(); };
  const isActive = (path: string) => location.pathname === path;

  return (
    <Stack gap="xs">
      <Text size="xs" c="dimmed" fw={600} tt="uppercase" px={4}>Navigation</Text>
      <NavButton icon={<IconHome size={16} />}        label="Home"        onClick={() => { showSplash(); onClose?.(); }} />
      <NavButton icon={<IconActivity size={16} />}    label="Overview"    onClick={() => navigateTo('/')}     active={isActive('/')} />
    </Stack>
  );
}

// Mantine's Box has no single-side border prop — borderRight must stay in style.
// The var() reference is still theme-aware via cssVariablesResolver.
const sidebarBorderStyle = { borderRight: '1px solid var(--shell-border)' } as const;

// bg accepts var() strings directly — Mantine passes them through to CSS.
// --shell-surface resolves to different colours per mode via cssVariablesResolver.
const SHELL_SURFACE = 'var(--shell-surface)';

export function DashboardSidebar({ navOpen, onClose }: DashboardSidebarProps) {
  return (
    <>
      {/* Inline sidebar — always inline on lg+, controlled by navOpen */}
      {navOpen && (
        <Box
          visibleFrom="lg"
          bg={SHELL_SURFACE}
          px="sm"
          py="md"
          style={{
            width: 200,
            flexShrink: 0,
            ...sidebarBorderStyle,
            overflow: 'auto',
          }}
        >
          <NavContent />
        </Box>
      )}

      {/* Overlay drawer — hamburger on smaller screens */}
      {navOpen && (
        <Box
          hiddenFrom="lg"
          bg={SHELL_SURFACE}
          px="sm"
          py="md"
          style={{
            position: 'absolute',
            top: 56,
            left: 0,
            bottom: 0,
            width: 220,
            zIndex: 200,
            ...sidebarBorderStyle,
            overflow: 'auto',
          }}
        >
          <NavContent onClose={onClose} />
        </Box>
      )}
    </>
  );
}
