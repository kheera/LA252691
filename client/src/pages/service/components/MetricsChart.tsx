import { AreaChart } from '@mantine/charts';
import { Card, Group, Stack, Text, Tooltip } from '@mantine/core';
import { IconWifi, IconWifiOff, IconLoader } from '@tabler/icons-react';
import { type GqlMetric } from '../../../graphql/services';
import { type WsStatus } from '../../../hooks/useWsStatus';

interface MetricsChartProps {
  metrics: GqlMetric[];
  wsStatus: WsStatus;
}

const WS_META: Record<WsStatus, { icon: React.ReactNode; label: string; color: string }> = {
  connecting: { icon: <IconLoader size={14} />, label: 'WebSockets connecting…', color: 'dimmed' },
  live: { icon: <IconWifi size={14} />, label: 'WebSockets live', color: 'teal' },
  error: { icon: <IconWifiOff size={14} />, label: 'WebSockets disconnected', color: 'red' },
};

export function MetricsChart({ metrics, wsStatus }: MetricsChartProps) {
  const chartData = metrics.map((m) => ({
    time: m.timestamp.slice(11, 19),
    cpu: m.cpuPercent ?? 0,
    memory: m.memoryMb ?? 0,
  }));

  const ws = WS_META[wsStatus];

  return (
    <Card withBorder radius="md" p="lg" h="100%">
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Text fw={600} size="sm" c="dimmed" tt="uppercase">CPU &amp; Memory — last 20 readings</Text>
          <Tooltip label={ws.label} withArrow>
            <Group gap={4} c={ws.color} style={{ cursor: 'default' }}>
              {ws.icon}
              <Text size="xs" fw={600} c={ws.color}>WS</Text>
            </Group>
          </Tooltip>
        </Group>
        <AreaChart
          h={150}
          data={chartData}
          dataKey="time"
          series={[
            { name: 'cpu', label: 'CPU %', color: 'blue.5' },
            { name: 'memory', label: 'Memory (MB)', color: 'violet.5', yAxisId: 'right' },
          ]}
          withLegend
          withRightYAxis
          yAxisProps={{ domain: [0, 100], tickCount: 5 }}
          rightYAxisProps={{ tickCount: 5 }}
          tickLine="none"
          gridAxis="y"
          curveType="monotone"
          fillOpacity={0.15}
        />
      </Stack>
    </Card>
  );
}
