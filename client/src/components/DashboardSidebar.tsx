import { Box, Button, Stack, Text } from '@mantine/core';
import {
  IconActivity,
  IconCloudUpload,
  IconFlask,
  IconHome,
} from '@tabler/icons-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSplash } from './SplashContext';

interface DashboardSidebarProps {
  navOpen: boolean;
  onClose: () => void;
}

function NavContent({ onClose }: { onClose?: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { show: showSplash } = useSplash();

  const go = (path: string) => { navigate(path); onClose?.(); };
  const isActive = (path: string) => location.pathname === path;

  return (
    <Stack gap="xs">
      <Text size="xs" c="dimmed" fw={600} tt="uppercase" px={4}>Navigation</Text>
      <Button
        variant="subtle"
        justify="start"
        leftSection={<IconHome size={16} />}
        fullWidth
        size="sm"
        onClick={() => { showSplash(); onClose?.(); }}
      >
        Home
      </Button>
      <Button
        variant={isActive('/') ? 'light' : 'subtle'}
        justify="start"
        leftSection={<IconActivity size={16} />}
        fullWidth
        size="sm"
        onClick={() => go('/')}
      >
        Overview
      </Button>
      <Button
        variant={isActive('/demo') ? 'light' : 'subtle'}
        justify="start"
        leftSection={<IconFlask size={16} />}
        fullWidth
        size="sm"
        onClick={() => go('/demo')}
      >
        Demo
      </Button>
      <Button
        variant="subtle"
        justify="start"
        leftSection={<IconCloudUpload size={16} />}
        fullWidth
        size="sm"
        onClick={onClose}
      >
        Deployments
      </Button>
    </Stack>
  );
}

export function DashboardSidebar({ navOpen, onClose }: DashboardSidebarProps) {
  return (
    <>
      {/* Inline sidebar — lg and above */}
      <Box
        visibleFrom="lg"
        style={{
          width: 200,
          flexShrink: 0,
          background: 'var(--mantine-color-default)',
          borderRight: '1px solid var(--mantine-color-default-border)',
          padding: '16px 12px',
          overflow: 'auto',
        }}
      >
        <NavContent />
      </Box>

      {/* Drawer nav — hamburger below lg */}
      {navOpen && (
        <Box
          hiddenFrom="lg"
          style={{
            position: 'absolute',
            top: 56,
            left: 0,
            bottom: 0,
            width: 220,
            zIndex: 200,
            background: 'var(--mantine-color-default)',
            borderRight: '1px solid var(--mantine-color-default-border)',
            padding: '16px 12px',
            overflow: 'auto',
          }}
        >
          <NavContent onClose={onClose} />
        </Box>
      )}
    </>
  );
}
