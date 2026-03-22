import { useParams, useNavigate } from 'react-router-dom';
import {
  Badge,
  Button,
  Card,
  Divider,
  Group,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { IconAlertTriangle, IconArrowLeft, IconCheck, IconServer } from '@tabler/icons-react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { UptimeBar } from '../../components/ServiceCard/UptimeBar';
import { LastDeployedRow } from '../../components/ServiceCard/LastDeployedRow';
import { statusBadgeColor } from '../../utils/statusColor';
import { mockServices } from '../../data/mockServices';

function statusIcon(s: string | null) {
  if (s === 'HEALTHY') return <IconCheck size={16} />;
  if (s === 'DEGRADED' || s === 'DOWN') return <IconAlertTriangle size={16} />;
  return <IconServer size={16} />;
}

export function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const svc = mockServices.find((s) => s.id === id);

  if (!svc) {
    return (
      <DashboardLayout>
        <Stack gap="md">
          <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate('/')}>
            Back to Overview
          </Button>
          <Text c="dimmed">Service not found.</Text>
        </Stack>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <Button
            variant="subtle"
            size="sm"
            leftSection={<IconArrowLeft size={16} />}
            onClick={() => navigate('/')}
          >
            Overview
          </Button>
        </Group>

        <Group gap="sm" align="center">
          <ThemeIcon
            color={statusBadgeColor(svc.status)}
            variant="filled"
            autoContrast
            size={32}
            radius="xl"
          >
            {statusIcon(svc.status)}
          </ThemeIcon>
          <Title order={2}>{svc.name}</Title>
          <Badge color={statusBadgeColor(svc.status)} variant="filled" autoContrast size="md">
            {svc.status ?? 'NOT DEPLOYED'}
          </Badge>
        </Group>

        <Card withBorder radius="md" p="lg">
          <Stack gap="md">
            <Text fw={600} size="sm" c="dimmed" tt="uppercase">Health</Text>
            <UptimeBar uptime={svc.uptime} status={svc.status} />

            <Divider />

            <Text fw={600} size="sm" c="dimmed" tt="uppercase">Last Deployment</Text>
            <LastDeployedRow lastDeployedAt={svc.lastDeployedAt} />
          </Stack>
        </Card>
      </Stack>
    </DashboardLayout>
  );
}

export default ServiceDetailPage;
