import { Button, Group } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
  IconArrowBackUp,
  IconArrowLeft,
  IconRefresh,
  IconRocket,
  IconTerminal2,
} from '@tabler/icons-react';

interface ServiceActionBarProps {
  serviceName: string;
  onBack: () => void;
  onDeployClick: () => void;
}

export function ServiceActionBar({ serviceName, onBack, onDeployClick }: ServiceActionBarProps) {
  const handleRollback = () => notifications.show({
    title: 'Rollback initiated',
    message: `Rolling ${serviceName} back to the previous version`,
    color: 'orange',
  });

  const handleRestart = () => notifications.show({
    title: 'Restarting',
    message: `${serviceName} is restarting`,
    color: 'green',
  });

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
        <Button size="sm" variant="default" leftSection={<IconArrowBackUp size={14} />} onClick={handleRollback}>Rollback</Button>
        <Button size="sm" variant="default" leftSection={<IconRefresh size={14} />}     onClick={handleRestart}>Restart</Button>
        <Button size="sm" variant="subtle"  leftSection={<IconTerminal2 size={14} />}   onClick={handleLogs}>Logs</Button>
      </Group>
    </Group>
  );
}
