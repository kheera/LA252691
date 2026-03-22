import React from 'react';
import { Card, Stack } from '@mantine/core';
import { type ServiceSummary } from './types';
import { NameStatusRow } from './NameStatusRow';
import { UptimeBar } from './UptimeBar';
import { LastDeployedRow } from './LastDeployedRow';

export type { ServiceSummary };

const PULSE_STYLE_ID = 'service-card-pulse-keyframes';

function injectPulseKeyframes() {
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

function alertBorderColor(status: string | null): string | undefined {
  if (status === 'DEGRADED') return 'color-mix(in srgb, var(--mantine-color-yellow-5) 25%, transparent)';
  if (status === 'DOWN') return 'color-mix(in srgb, var(--mantine-color-red-6) 50%, transparent)';
  return undefined;
}

function alertPulseColor(status: string | null): string | undefined {
  if (status === 'DEGRADED') return 'color-mix(in srgb, var(--mantine-color-yellow-4) 50%, transparent)';
  if (status === 'DOWN') return 'color-mix(in srgb, var(--mantine-color-red-5) 85%, transparent)';
  return undefined;
}

export function ServiceCard({ svc }: { svc: ServiceSummary }) {
  const isAlert = svc.status === 'DEGRADED' || svc.status === 'DOWN';

  if (isAlert) injectPulseKeyframes();

  const borderColor = alertBorderColor(svc.status);
  const pulseColor = alertPulseColor(svc.status);

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
        <NameStatusRow name={svc.name} status={svc.status} />
        <UptimeBar uptime={svc.uptime} status={svc.status} />
        <LastDeployedRow lastDeployedAt={svc.lastDeployedAt} />
      </Stack>
    </Card>
  );
}
