import { Card, Divider, Group, Skeleton, Stack } from '@mantine/core';

export function ServiceCardSkeleton() {
  return (
    <Card withBorder radius="md" p="md">
      <Stack gap="sm">
        {/* NameStatusRow */}
        <Group justify="space-between" align="center" wrap="nowrap">
          <Group gap="xs" wrap="nowrap">
            <Skeleton circle height={22} style={{ flexShrink: 0 }} />
            <Skeleton height={14} width={120} radius="sm" />
          </Group>
          <Skeleton height={20} width={72} radius="xl" style={{ flexShrink: 0 }} />
        </Group>

        {/* UptimeBar */}
        <Stack gap={4}>
          <Group justify="space-between">
            <Skeleton height={10} width={40} radius="sm" />
            <Skeleton height={10} width={32} radius="sm" />
          </Group>
          <Skeleton height={8} radius="xl" />
        </Stack>

        {/* LastDeployedRow */}
        <Skeleton height={10} width="55%" radius="sm" />

        <Divider />

        {/* View details link */}
        <Group justify="flex-end">
          <Skeleton height={12} width={70} radius="sm" />
        </Group>
      </Stack>
    </Card>
  );
}
