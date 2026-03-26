import React from 'react';
import { Anchor, Card, Divider, Group, Stack } from '@mantine/core';
import { Link } from 'react-router-dom';
import { IconArrowRight } from '@tabler/icons-react';
import type { ServiceStatus } from '../../graphql/services';
import { type ServiceSummary } from './types';
import { NameStatusRow } from './NameStatusRow';
import { UptimeBar } from './UptimeBar';
import { LastDeployedRow } from './LastDeployedRow';
import { ServiceCardSkeleton } from './ServiceCardSkeleton';

export type { ServiceSummary };

// Injects the @keyframes rule that makes the card border glow.
// Primarily used to draw the eye when a service is down or degraded
function injectPulseKeyframes() {
  const PULSE_STYLE_ID = 'service-card-pulse-keyframes';
  if (typeof document === 'undefined' || document.getElementById(PULSE_STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = PULSE_STYLE_ID;
  style.textContent = `
    @keyframes alert-pulse {
      0%, 50%  { box-shadow: none; }
      72%      { box-shadow: 0 0 6px 0px var(--pulse-color); }
      100%     { box-shadow: none; }
    }
  `;
  document.head.appendChild(style);
}

function alertBorderColor(status: ServiceStatus | null): string | undefined {
  if (status === 'DEGRADED') return 'color-mix(in srgb, var(--mantine-color-yellow-5) 25%, transparent)';
  if (status === 'DOWN') return 'color-mix(in srgb, var(--mantine-color-red-6) 50%, transparent)';
  return undefined;
}

function alertPulseColor(status: ServiceStatus | null): string | undefined {
  if (status === 'DEGRADED') return 'color-mix(in srgb, var(--mantine-color-yellow-4) 50%, transparent)';
  if (status === 'DOWN') return 'color-mix(in srgb, var(--mantine-color-red-5) 85%, transparent)';
  return undefined;
}

export function ServiceCard({ svc: service, loading = false }: { svc?: ServiceSummary; loading?: boolean }) {
  if (loading) return <ServiceCardSkeleton />;

  const { name, status, uptime, lastDeployedAt, id, healthTrend } = service!;
  const isAlert = status === 'DEGRADED' || status === 'DOWN';

  if (isAlert) injectPulseKeyframes();

  const borderColor = alertBorderColor(status);
  const pulseColor = alertPulseColor(status);

  const style: React.CSSProperties = {
    ...(borderColor ? { borderColor, borderWidth: 2 } : {}),
    ...(pulseColor ? {
      '--pulse-color': pulseColor,
      animation: 'alert-pulse 5s ease-in-out infinite',
    } as React.CSSProperties : {}),
  };

  return (
    <Card withBorder radius="md" p="md" style={style}>
      <Stack gap="sm">
        <NameStatusRow name={name} status={status} healthTrend={healthTrend} />
        <UptimeBar uptime={uptime} status={status} />
        <LastDeployedRow lastDeployedAt={lastDeployedAt} />
        <Divider />
        <Group justify="flex-end">
          <Anchor
            component={Link}
            to={`/service/${id}`}
            size="xs"
            style={{ display: 'flex', alignItems: 'center', gap: 4 }}
          >
            View details <IconArrowRight size={12} />
          </Anchor>
        </Group>
      </Stack>
    </Card>
  );
}
