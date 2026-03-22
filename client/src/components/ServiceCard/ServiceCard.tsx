import { Card, Stack } from '@mantine/core';
import { type ServiceSummary } from './types';
import { NameStatusRow } from './NameStatusRow';
import { UptimeBar } from './UptimeBar';
import { LastDeployedRow } from './LastDeployedRow';

export type { ServiceSummary };

export function ServiceCard({ svc }: { svc: ServiceSummary }) {
  return (
    <Card withBorder radius="md" p="md">
      <Stack gap="sm">
        <NameStatusRow name={svc.name} status={svc.status} />
        <UptimeBar uptime={svc.uptime} status={svc.status} />
        <LastDeployedRow lastDeployedAt={svc.lastDeployedAt} />
      </Stack>
    </Card>
  );
}
