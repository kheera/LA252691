import { Button, Group } from '@mantine/core';
import {
  IconAlertTriangle,
  IconArrowLeft,
  IconRocket,
} from '@tabler/icons-react';
import type { ServiceStatus } from '../../../graphql/services';

interface ServiceActionBarProps {
  onBack: () => void;
  onDeployClick: () => void;
  serviceStatus: ServiceStatus | null;
  onAcknowledgeOutageClick: () => void;
}

export function ServiceActionBar({ onBack, onDeployClick, serviceStatus, onAcknowledgeOutageClick }: ServiceActionBarProps) {
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
        {serviceStatus === 'DOWN' && (
          <Button size="sm" variant="outline" color="orange" leftSection={<IconAlertTriangle size={14} />} onClick={onAcknowledgeOutageClick}>
            Acknowledge Outage
          </Button>
        )}
        <Button size="sm" variant="filled"  leftSection={<IconRocket size={14} />}      onClick={onDeployClick}>Deploy</Button>
      </Group>
    </Group>
  );
}
