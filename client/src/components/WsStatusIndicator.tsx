import { Group, Text, Tooltip } from '@mantine/core';
import { IconWifi, IconWifiOff, IconLoader } from '@tabler/icons-react';
import { useMatch } from 'react-router-dom';
import { useWsStatus, type WsStatus } from '../hooks/useWsStatus';

const WS_META: Record<WsStatus, { icon: React.ReactNode; label: string; color: string }> = {
  connecting: { icon: <IconLoader size={14} />, label: 'WebSockets connecting…', color: 'dimmed' },
  live: { icon: <IconWifi size={14} />, label: 'WebSockets live', color: 'teal' },
  error: { icon: <IconWifiOff size={14} />, label: 'WebSockets disconnected', color: 'red' },
};

const INACTIVE = { icon: <IconWifiOff size={14} />, label: 'WebSockets inactive', color: 'dimmed' };

/** Renders a WS connection badge. Active (red/green) only on /service/:id; greyed out everywhere else. */
export function WsStatusIndicator() {
  const onServicePage = useMatch('/service/:id');
  const wsStatus = useWsStatus();
  const ws = onServicePage ? WS_META[wsStatus] : INACTIVE;
  return (
    <Tooltip label={ws.label} withArrow>
      <Group gap={4} c={ws.color} style={{ cursor: 'default' }}>
        {ws.icon}
        <Text size="xs" fw={600} c={ws.color}>WS</Text>
      </Group>
    </Tooltip>
  );
}
