import { Badge, Card, ScrollArea, Stack, Table, Text } from '@mantine/core';
import { type GqlDeployment } from '../../../graphql/services';
import { RelativeDate } from '../../../components/RelativeDate';

function deployStatusColor(status: string | null): string {
  if (status === 'SUCCESS') return 'green.7';
  if (status === 'FAILED') return 'red.8';
  if (status === 'ROLLING_BACK') return 'orange.7';
  return 'gray.6';
}

function deployStatusLabel(status: string | null): string {
  if (status === 'SUCCESS') return 'Success';
  if (status === 'FAILED') return 'Failed';
  if (status === 'ROLLING_BACK') return 'Rolling back';
  return 'Unknown';
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
}

interface DeploymentHistoryTableProps {
  deployments: GqlDeployment[];
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
                <Table.Th visibleFrom="sm">Commit</Table.Th>
                <Table.Th>Duration</Table.Th>
                <Table.Th style={{ minWidth: 168 }}>Deployed</Table.Th>
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
                    <Text size="sm">{d.deployedBy}</Text>
                  </Table.Td>
                  <Table.Td visibleFrom="sm">
                    <Text size="sm" c="dimmed">—</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{formatDuration(d.durationSeconds)}</Text>
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
