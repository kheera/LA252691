import { type ReactNode } from 'react';
import { Card, Group, Text, ThemeIcon } from '@mantine/core';

interface StatCardProps {
  label: string;
  value: string;
  color: string;
  icon: ReactNode;
}

export function StatCard({ label, value, color, icon }: StatCardProps) {
  return (
    <Card withBorder radius="md" p="md">
      <Group justify="space-between">
        <Text size="sm" c="dimmed">{label}</Text>
        <ThemeIcon color={color} variant="light" size="md">{icon}</ThemeIcon>
      </Group>
      <Text fw={700} size="xl" mt="xs">{value}</Text>
    </Card>
  );
}
