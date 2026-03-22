import { type ReactNode } from 'react';
import { Button, Stack, Text } from '@mantine/core';
import { IconActivity, IconCloudUpload, IconServer } from '@tabler/icons-react';

export type NavKey = 'overview' | 'services' | 'deployments';

interface NavItem {
  key: NavKey;
  label: string;
  icon: ReactNode;
}

interface SidebarNavProps {
  activeItem?: NavKey;
  /** Called when any nav item is clicked; useful for closing a drawer */
  onItemClick?: () => void;
}

const NAV_ITEMS: NavItem[] = [
  { key: 'overview', label: 'Overview', icon: <IconActivity size={16} /> },
  { key: 'services', label: 'Services', icon: <IconServer size={16} /> },
  { key: 'deployments', label: 'Deployments', icon: <IconCloudUpload size={16} /> },
];

export function SidebarNav({ activeItem = 'overview', onItemClick }: SidebarNavProps) {
  return (
    <Stack gap="xs">
      <Text size="xs" c="dimmed" fw={600} tt="uppercase" px={4}>
        Navigation
      </Text>
      {NAV_ITEMS.map(({ key, label, icon }) => (
        <Button
          key={key}
          variant={activeItem === key ? 'light' : 'subtle'}
          justify="start"
          leftSection={icon}
          fullWidth
          size="sm"
          onClick={onItemClick}
        >
          {label}
        </Button>
      ))}
    </Stack>
  );
}
