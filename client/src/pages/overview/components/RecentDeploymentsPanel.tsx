import { Alert, Card, Group, ScrollArea, SegmentedControl, Skeleton, Stack, Text } from '@mantine/core';
import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { IconAlertCircle } from '@tabler/icons-react';
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

/** Single row showing service name, version, status badge, and relative timestamp. */
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

/** Placeholder skeleton shown while the deployments query is in flight. */
function RecentDeploymentRowSkeleton() {
  return (
    <Stack gap="xs">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} height={24} radius="sm" />
      ))}
    </Stack>
  );
}

/** Empty state shown when the query succeeds but returns no results. */
function NoDeploymentsFound() {
  return (
    <Text size="sm" c="dimmed" ta="center" py="xl">No deployments found</Text>
  );
}

/** Error state shown when the deployments query fails. */
function DeploymentsError({ message }: { message: string }) {
  return (
    <Alert
      color="red"
      variant="light"
      icon={<IconAlertCircle size={16} />}
      title="Failed to load deployments"
    >
      <Text size="xs">{message}</Text>
    </Alert>
  );
}

/** Sidebar panel on the overview page listing the most recent deployments across all services. */
export function RecentDeploymentsPanel({ services }: RecentDeploymentsPanelProps) {
  const [filter, setFilter] = useState<StatusFilter>('ALL');

  const { data, loading, error } = useQuery<RecentDeploymentsResult>(GET_RECENT_DEPLOYMENTS, {
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
          {error && <DeploymentsError message={error.message} />}
          {!error && (!loading || data) && deployments.length === 0 && <NoDeploymentsFound />}
          {!error && (!loading || data) && deployments.length > 0 && (
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
