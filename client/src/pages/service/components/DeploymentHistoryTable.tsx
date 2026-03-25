import { useEffect, useState } from 'react';
import { Card, ScrollArea, Stack, Table, Text } from '@mantine/core';
import { useInterval } from '@mantine/hooks';
import { type GqlDeployment } from '../../../graphql/services';
import { RelativeDate } from '../../../components/RelativeDate';
import { formatDuration } from '../../../utils/dateFormat';
import { DeployStatusBadge } from '../../../components/DeployStatusBadge';

/** Counts elapsed seconds from `startIso`, incrementing every second while mounted. */
function PendingDeployTimer({ startIso }: { startIso: string }) {
  const [elapsed, setElapsed] = useState(() =>
    Math.floor((Date.now() - new Date(startIso).getTime()) / 1000),
  );
  const interval = useInterval(() => setElapsed((s) => s + 1), 1000);
  useEffect(() => { interval.start(); return interval.stop; }, [interval]);

  return (
    <Text size="sm" c="blue.5" fw={600}>{formatDuration(elapsed)}</Text>
  );
}

interface DeploymentHistoryTableProps {
  deployments: GqlDeployment[];
}

function newestFirst(a: GqlDeployment, b: GqlDeployment): number {
  return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
}

export function DeploymentHistoryTable({ deployments }: DeploymentHistoryTableProps) {
  const sorted = [...deployments].sort(newestFirst);
  return (
    <Card withBorder radius="md" p="lg">
      <Stack gap="md">
        <Text fw={600} size="sm" c="dimmed" tt="uppercase">Deployment History</Text>
        <ScrollArea>
          <Table highlightOnHover striped withTableBorder={false} verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>#</Table.Th>
                <Table.Th>Version</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Deployed by</Table.Th>
                <Table.Th>Duration</Table.Th>
                <Table.Th style={{ minWidth: 168 }}>Deployed</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {sorted.map((d, i) => (
                <Table.Tr key={d.id}>
                  <Table.Td>
                    <Text size="sm" c="dimmed">{sorted.length - i}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" fw={600}>{d.version}</Text>
                  </Table.Td>
                  <Table.Td>
                    <DeployStatusBadge status={d.status} size="sm" />
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{d.deployedBy}</Text>
                  </Table.Td>
                  <Table.Td>
                    {d.status === 'PENDING'
                      ? <PendingDeployTimer startIso={d.timestamp} />
                      : <Text size="sm">{formatDuration(d.durationSeconds)}</Text>}
                  </Table.Td>
                  <Table.Td>
                    <RelativeDate iso={d.timestamp} />
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Stack>
    </Card>
  );
}
