import { Badge, Card, Code, ScrollArea, Stack, Table, Text } from '@mantine/core';
import { type Deployment, type DeploymentStatus } from '../../../data/mockServiceDetails';

function deployStatusColor(status: DeploymentStatus): string {
  if (status === 'success') return 'green.7';
  if (status === 'failed') return 'red.8';
  if (status === 'in_progress') return 'blue.6';
  return 'orange.7'; // rolled_back
}

function deployStatusLabel(status: DeploymentStatus): string {
  if (status === 'in_progress') return 'In progress';
  if (status === 'rolled_back') return 'Rolled back';
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
}

function formatRelative(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60_000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return 'just now';
}

interface DeploymentHistoryTableProps {
  deployments: Deployment[];
}

export function DeploymentHistoryTable({ deployments }: DeploymentHistoryTableProps) {
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
                <Table.Th>Triggered by</Table.Th>
                <Table.Th>Commit</Table.Th>
                <Table.Th>Duration</Table.Th>
                <Table.Th>Deployed</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {deployments.map((d, i) => (
                <Table.Tr key={d.id}>
                  <Table.Td>
                    <Text size="sm" c="dimmed">{deployments.length - i}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" fw={600}>{d.version}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={deployStatusColor(d.status)} variant="filled" autoContrast size="sm">
                      {deployStatusLabel(d.status)}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{d.triggeredBy}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Code fz="xs">{d.commitSha.slice(0, 7)}</Code>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{formatDuration(d.durationSeconds)}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">{formatRelative(d.deployedAt)}</Text>
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
