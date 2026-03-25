import { Card, Group, ScrollArea, SegmentedControl, Skeleton, Stack, Text } from '@mantine/core';
import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import {
  GET_RECENT_DEPLOYMENTS,
  type RecentDeployment,
  type RecentDeploymentsResult,
} from '../../../graphql/services';
import { type ServiceSummary } from '../../../components/ServiceCard/types';
import { RelativeDate } from '../../../components/RelativeDate';
import { DeployStatusBadge } from '../../../components/DeployStatusBadge';

type StatusFilter = 'ALL' | 'FAILED';

interface RecentDeploymentsPanelProps {
  services: ServiceSummary[];
}

function DeploymentRow({ deployment, serviceName }: { deployment: RecentDeployment; serviceName: string }) {
  return (
    <Group justify="space-between" wrap="nowrap" gap="xs">
      {/* name:version */}
      <Group gap={0} wrap="nowrap" style={{ minWidth: 0, flexShrink: 1 }}>
        <Text
          size="xs"
          fw={600}
          style={{ flexShrink: 1 }}
        >
          {serviceName}
        </Text>
        <Text size="xs" c="dimmed" style={{ flexShrink: 0 }}>
          :{deployment.version}
        </Text>
      </Group>

      {/* status — recency */}
      <Group gap="xs" wrap="nowrap" style={{ flexShrink: 0 }}>
        <DeployStatusBadge status={deployment.status} size="xs" />
        <RelativeDate iso={deployment.timestamp} size="xs" />
      </Group>
    </Group>
  );
}

function RecentDeploymentRowSkeleton() {
  return (
    <Stack gap="xs">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} height={24} radius="sm" />
      ))}
    </Stack>
  );
}

function NoDeploymentsFound() {
  return (
    <Text size="sm" c="dimmed" ta="center" py="xl">No deployments found</Text>
  );
}

export function RecentDeploymentsPanel({ services }: RecentDeploymentsPanelProps) {
  const [filter, setFilter] = useState<StatusFilter>('ALL');

  const { data, loading } = useQuery<RecentDeploymentsResult>(GET_RECENT_DEPLOYMENTS, {
    variables: {
      limit: 30,
      ...(filter === 'FAILED' && { status: 'FAILED' }),
    },
  });

  const serviceNameById = Object.fromEntries(services.map((s) => [s.id, s.name]));
  const deployments = data?.deployments ?? [];

  return (
    <Card withBorder radius="md" p="lg" h="100%">
      <Stack gap="md" h="100%">
        <Group justify="space-between" align="center">
          <Text fw={600} size="sm" c="dimmed" tt="uppercase">Recent Deployments</Text>
          <SegmentedControl
            size="xs"
            value={filter}
            onChange={(v) => setFilter(v as StatusFilter)}
            data={[
              { label: 'All', value: 'ALL' },
              { label: 'Failed only', value: 'FAILED' },
            ]}
          />
        </Group>

        <ScrollArea flex={1} mah={420}>
          {loading && !data && <RecentDeploymentRowSkeleton />}
          {(!loading || data) && deployments.length === 0 && <NoDeploymentsFound />}
          {(!loading || data) && deployments.length > 0 && (
            <Stack gap={8}>
              {deployments.map((deployment) => (
                <DeploymentRow
                  key={deployment.id}
                  deployment={deployment}
                  serviceName={serviceNameById[deployment.serviceId] ?? deployment.serviceId}
                />
              ))}
            </Stack>
          )}
        </ScrollArea>
      </Stack>
    </Card>
  );
}
