import { Badge, Card, Grid, Group, Progress, RingProgress, Stack, Text } from '@mantine/core';
import { IconAlertTriangle, IconCheck } from '@tabler/icons-react';

export interface ServiceRowProps {
  name: string;
  /** 'HEALTHY' | 'DEGRADED' | 'DOWN' */
  status: string;
  uptime: number;
  deploys: number;
}

function statusColor(status: string) {
  if (status === 'HEALTHY') return 'green';
  if (status === 'DEGRADED') return 'yellow';
  return 'red';
}

function statusIcon(status: string) {
  return status === 'HEALTHY' ? <IconCheck size={14} /> : <IconAlertTriangle size={14} />;
}

export function ServiceRow({ name, status, uptime, deploys }: ServiceRowProps) {
  const color = statusColor(status);
  return (
    <Card withBorder radius="sm" p="sm">
      <Grid align="center">
        <Grid.Col span={5}>
          <Group gap="xs">
            <Text fw={500} size="sm">{name}</Text>
            <Badge color={color} size="sm" leftSection={statusIcon(status)}>
              {status}
            </Badge>
          </Group>
        </Grid.Col>
        <Grid.Col span={5}>
          <Stack gap={4}>
            <Text size="xs" c="dimmed">Uptime {uptime}%</Text>
            <Progress value={uptime} color={color} size="sm" radius="xl" />
          </Stack>
        </Grid.Col>
        <Grid.Col span={2}>
          <Group justify="flex-end">
            <RingProgress
              size={44}
              thickness={4}
              sections={[{ value: uptime, color }]}
              label={<Text ta="center" size="xs" lh={1}>{deploys}d</Text>}
            />
          </Group>
        </Grid.Col>
      </Grid>
    </Card>
  );
}
