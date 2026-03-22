import { Badge, Card, Grid, Group, Progress, RingProgress, Stack, Text } from '@mantine/core';
import { IconAlertTriangle, IconCheck } from '@tabler/icons-react';
import { statusBadgeColor, statusProgressColor } from '../../../utils/statusColor';

export interface DemoService {
  name: string;
  status: string;
  uptime: number;
  deploys: number;
}

function statusIcon(s: string) {
  return s === 'HEALTHY' ? <IconCheck size={14} /> : <IconAlertTriangle size={14} />;
}

export function ServiceRow({ svc }: { svc: DemoService }) {
  const color = statusProgressColor(svc.status);
  return (
    <Card withBorder radius="sm" p="sm">
      <Grid align="center">
        <Grid.Col span={5}>
          <Group gap="xs">
            <Text fw={500} size="sm">{svc.name}</Text>
            <Badge color={statusBadgeColor(svc.status)} variant="filled" autoContrast size="sm" leftSection={statusIcon(svc.status)}>
              {svc.status}
            </Badge>
          </Group>
        </Grid.Col>
        <Grid.Col span={5}>
          <Stack gap={4}>
            <Text size="xs" c="dimmed">Uptime {svc.uptime}%</Text>
            <Progress value={svc.uptime} color={color} size="sm" radius="xl" />
          </Stack>
        </Grid.Col>
        <Grid.Col span={2}>
          <Group justify="flex-end">
            <RingProgress
              size={44}
              thickness={4}
              sections={[{ value: svc.uptime, color }]}
              label={<Text ta="center" size="xs" lh={1}>{svc.deploys}d</Text>}
            />
          </Group>
        </Grid.Col>
      </Grid>
    </Card>
  );
}
