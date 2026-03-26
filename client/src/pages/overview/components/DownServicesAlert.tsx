import { Anchor, Badge, Box, Group, Stack, Text } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { type ServiceSummary } from '../../../components/ServiceCard/types';

// Inject the flash keyframes once — alternates background so the alert is
// impossible to miss even in peripheral vision, and doesn't rely on colour
// alone (the icon + "DOWN" text remain readable for all colour-vision types).
function injectFlashKeyframes() {
  const STYLE_ID = 'down-alert-flash-keyframes';
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  // 1.4 s cycle: sits at a dark-red tint, briefly flashes to near-white, back.
  // Uses CSS custom properties so it adapts to light/dark mode via Mantine vars.
  style.textContent = `
    @keyframes down-alert-flash {
      0%,  60% { background-color: light-dark(var(--mantine-color-red-1), var(--mantine-color-red-9)); }
      75%       { background-color: light-dark(var(--mantine-color-red-3), var(--mantine-color-red-6)); }
      100%      { background-color: light-dark(var(--mantine-color-red-1), var(--mantine-color-red-9)); }
    }
  `;
  document.head.appendChild(style);
}

interface DownServicesAlertProps {
  services: ServiceSummary[];
}

export function DownServicesAlert({ services }: DownServicesAlertProps) {
  const downServices = services.filter((s) => s.status === 'DOWN');
  if (downServices.length === 0) return null;

  injectFlashKeyframes();

  return (
    <Box
      role="alert"
      aria-label={`${downServices.length} service${downServices.length > 1 ? 's' : ''} down`}
      style={{
        animation: 'down-alert-flash 1.4s ease-in-out infinite',
        border: '2px solid var(--mantine-color-red-6)',
        borderRadius: 'var(--mantine-radius-md)',
        padding: 'var(--mantine-spacing-sm)',
      }}
    >
      {/* Header — icon + text + count badge: three distinct signals, not just colour */}
      <Group gap={6} mb="xs" wrap="nowrap">
        <IconAlertTriangle size={18} color="var(--mantine-color-red-6)" aria-hidden />
        <Text fw={800} tt="uppercase" size="sm" c="red" style={{ letterSpacing: '0.06em', flex: 1 }}>
          Service{downServices.length > 1 ? 's' : ''} Down
        </Text>
        <Badge color="red" variant="filled" size="sm" aria-label={`${downServices.length} down`}>
          {downServices.length}
        </Badge>
      </Group>

      {/* One row per DOWN service */}
      <Stack gap={4}>
        {downServices.map((svc) => (
          <Group key={svc.id} gap={6} wrap="nowrap" align="center">
            <IconAlertTriangle size={12} color="var(--mantine-color-red-5)" aria-hidden />
            <Anchor
              component={Link}
              to={`/service/${svc.id}`}
              size="sm"
              fw={600}
              c="red"
              style={{ lineHeight: 1.3 }}
            >
              {svc.name}
            </Anchor>
          </Group>
        ))}
      </Stack>
    </Box>
  );
}
