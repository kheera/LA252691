import { Button, Group } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
  IconArrowLeft,
  IconRocket,
  IconTerminal2,
} from '@tabler/icons-react';

interface ServiceActionBarProps {
  onBack: () => void;
  onDeployClick: () => void;
}

export function ServiceActionBar({ onBack, onDeployClick }: ServiceActionBarProps) {
  const handleLogs = () => notifications.show({
    title: 'Log viewer',
    message: 'Log streaming not yet connected to backend',
    color: 'gray',
  });

  return (
    <Group justify="space-between" align="center" wrap="wrap" gap="sm">
      <Button
        variant="subtle"
        size="sm"
        leftSection={<IconArrowLeft size={16} />}
        onClick={onBack}
      >
        Overview
      </Button>
      <Group gap="sm" wrap="wrap">
        <Button size="sm" variant="filled"  leftSection={<IconRocket size={14} />}      onClick={onDeployClick}>Deploy</Button>
        <Button size="sm" variant="subtle"  leftSection={<IconTerminal2 size={14} />}   onClick={handleLogs}>Logs</Button>
      </Group>
    </Group>
  );
}
