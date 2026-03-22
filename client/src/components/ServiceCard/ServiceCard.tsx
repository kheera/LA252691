import React from 'react';
import { Anchor, Card, Divider, Group, Skeleton, Stack } from '@mantine/core';
import { Link } from 'react-router-dom';
import { IconArrowRight } from '@tabler/icons-react';
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

export function ServiceCard({ svc, loading = false }: { svc?: ServiceSummary; loading?: boolean }) {
  const isAlert = !loading && (svc?.status === 'DEGRADED' || svc?.status === 'DOWN');

  if (isAlert) injectPulseKeyframes();

  const borderColor = alertBorderColor(svc?.status ?? null);
  const pulseColor = alertPulseColor(svc?.status ?? null);

  const style: React.CSSProperties = {
    ...(!loading && borderColor ? { borderColor, borderWidth: 2 } : {}),
    ...(!loading && pulseColor ? {
      '--pulse-color': pulseColor,
      animation: 'alert-pulse 5s ease-in-out infinite',
    } as React.CSSProperties : {}),
  };

  return (
    <Card withBorder radius="md" p="md" style={style}>
      <Stack gap="sm">
        <NameStatusRow name={svc?.name ?? ''} status={svc?.status ?? null} loading={loading} />
        <UptimeBar uptime={svc?.uptime ?? null} status={svc?.status ?? null} loading={loading} />
        <LastDeployedRow lastDeployedAt={svc?.lastDeployedAt ?? null} loading={loading} />
        <Divider />
        <Group justify="flex-end">
          {loading
            ? <Skeleton height={12} width={70} radius="sm" />
            : (
              <Anchor
                component={Link}
                to={`/service/${svc?.id ?? ''}`}
                size="xs"
                style={{ display: 'flex', alignItems: 'center', gap: 4 }}
              >
                View details <IconArrowRight size={12} />
              </Anchor>
            )}
        </Group>
      </Stack>
    </Card>
  );
}
