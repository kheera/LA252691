import { Card, Group, SimpleGrid, Text, ThemeIcon } from '@mantine/core';
import {
  IconAlertTriangle,
  IconCheck,
  IconServer,
} from '@tabler/icons-react';
import { STATUS_COLORS } from '../../../theme';

const stats = [
  { label: 'Total Services', value: '4', color: 'brand',              icon: <IconServer size={18} /> },
  { label: 'Healthy',        value: '2', color: STATUS_COLORS.HEALTHY,     icon: <IconCheck size={18} /> },
  { label: 'Degraded',       value: '1', color: STATUS_COLORS.DEGRADED,    icon: <IconAlertTriangle size={18} /> },
  { label: 'Down',           value: '1', color: STATUS_COLORS.DOWN,        icon: <IconAlertTriangle size={18} /> },
];

export function StatCards() {
  return (
    <SimpleGrid cols={{ base: 2, lg: 4 }}>
      {stats.map(({ label, value, color, icon }) => (
        <Card key={label} withBorder radius="md" p="md">
          <Group justify="space-between">
            <Text size="sm" c="dimmed">{label}</Text>
            <ThemeIcon color={color} variant="light" size="md">{icon}</ThemeIcon>
          </Group>
          <Text fw={700} size="xl" mt="xs">{value}</Text>
        </Card>
      ))}
    </SimpleGrid>
  );
}
