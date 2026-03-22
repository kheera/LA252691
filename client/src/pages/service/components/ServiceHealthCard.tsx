import { Card, Divider, SimpleGrid, Stack, Text } from '@mantine/core';
import { UptimeBar } from '../../../components/ServiceCard/UptimeBar';
import { LastDeployedRow } from '../../../components/ServiceCard/LastDeployedRow';
import { type ServiceSummary } from '../../../components/ServiceCard/types';
import { type ServiceDetail } from '../../../data/mockServiceDetails';

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <Stack gap={4}>
      <Text size="xs" c="dimmed" fw={600} tt="uppercase" lh={1}>{label}</Text>
      <Text size="sm" fw={500}>{value}</Text>
    </Stack>
  );
}

interface ServiceHealthCardProps {
  svc: ServiceSummary;
  detail: ServiceDetail;
}

export function ServiceHealthCard({ svc, detail }: ServiceHealthCardProps) {
  return (
    <Card withBorder radius="md" p="lg" h="100%">
      <Stack gap="md">
        <Text fw={600} size="sm" c="dimmed" tt="uppercase">Health</Text>
        <UptimeBar uptime={svc.uptime} status={svc.status} />

        <Divider />

        <Text fw={600} size="sm" c="dimmed" tt="uppercase">Last Deployment</Text>
        <LastDeployedRow lastDeployedAt={svc.lastDeployedAt} />

        <Divider />

        <SimpleGrid cols={2} spacing="sm">
          <MetaItem label="Environment" value={detail.environment} />
          <MetaItem label="Region"      value={detail.region} />
          <MetaItem label="Version"     value={detail.version} />
          <MetaItem label="Owner"       value={detail.owner} />
        </SimpleGrid>
      </Stack>
    </Card>
  );
}
