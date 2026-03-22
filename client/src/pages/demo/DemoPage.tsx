/* DELETE THIS DEMO PAGE */
import {
  BackgroundImage,
  Badge,
  Box,
  Button,
  Card,
  Center,
  Grid,
  Group,
  Overlay,
  Progress,
  rem,
  RingProgress,
  ScrollArea,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { AreaChart } from '@mantine/charts';
import {
  IconActivity,
  IconAlertTriangle,
  IconCheck,
  IconChevronLeft,
  IconCloudUpload,
  IconFlask,
  IconMenu2,
  IconServer,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { ColorSchemeToggle } from '../../components/ColorSchemeToggle';
import { useHeroImage } from '../../components/useHeroImage';

const chartData = [
  { time: '00:00', cpu: 22, memory: 44 },
  { time: '04:00', cpu: 35, memory: 48 },
  { time: '08:00', cpu: 61, memory: 55 },
  { time: '12:00', cpu: 78, memory: 62 },
  { time: '16:00', cpu: 54, memory: 58 },
  { time: '20:00', cpu: 42, memory: 51 },
  { time: '23:59', cpu: 30, memory: 47 },
];

const services = [
  { name: 'api-gateway', status: 'HEALTHY', uptime: 99.9, deploys: 8 },
  { name: 'auth-service', status: 'DEGRADED', uptime: 97.2, deploys: 3 },
  { name: 'data-pipeline', status: 'DOWN', uptime: 81.0, deploys: 12 },
  { name: 'frontend-cdn', status: 'HEALTHY', uptime: 100.0, deploys: 5 },
];

function statusColor(s: string) {
  if (s === 'HEALTHY') return 'green';
  if (s === 'DEGRADED') return 'yellow';
  return 'red';
}

function statusIcon(s: string) {
  return s === 'HEALTHY' ? <IconCheck size={14} /> : <IconAlertTriangle size={14} />;
}

export function DemoPage() {
  const navigate = useNavigate();
  const [navOpen, { toggle }] = useDisclosure(false);
  const heroImage = useHeroImage();

  return (
    <Box style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>

      {/* ── LEFT: hero splash panel ───────────────────────────────────── */}
      {/* visible only above ~2576px (xxxl / ¾ of a 34" ultrawide) */}
      <Box
        visibleFrom="xxxl"
        w={{ xxxl: '28%' }}
        style={{ flexShrink: 0, position: 'relative', overflow: 'hidden' }}
      >
        <BackgroundImage
          src={heroImage}
          style={{ height: '100%', backgroundPosition: 'center', backgroundSize: 'cover' }}
        >
          <Overlay
            gradient="linear-gradient(160deg, rgba(0,0,0,0.82) 0%, rgba(0,30,80,0.72) 100%)"
            opacity={1}
            zIndex={1}
          />
          <Center style={{ height: '100%', position: 'relative', zIndex: 2 }}>
            <Stack align="center" gap="lg" px="xl">
              <Text
                size="xs"
                fw={600}
                tt="uppercase"
                c="blue.3"
                style={{ letterSpacing: rem(3) }}
              >
                Province of British Columbia
              </Text>
              <Title
                order={2}
                ta="center"
                c="white"
                style={{ fontSize: 'clamp(1.1rem, 2.5vw, 2rem)', lineHeight: 1.25 }}
              >
                Legislative Assembly
                <br />
                of British Columbia
              </Title>
              <Group gap="xs" justify="center">
                <Box
                  style={{
                    height: 2,
                    width: rem(36),
                    background: 'var(--mantine-color-blue-4)',
                    borderRadius: 2,
                  }}
                />
                <Text
                  fw={500}
                  c="blue.2"
                  style={{ fontSize: 'clamp(0.75rem, 1.5vw, 1.1rem)' }}
                >
                  DevOps Services
                </Text>
                <Box
                  style={{
                    height: 2,
                    width: rem(36),
                    background: 'var(--mantine-color-blue-4)',
                    borderRadius: 2,
                  }}
                />
              </Group>
              <Button
                variant="subtle"
                color="gray.4"
                size="xs"
                leftSection={<IconChevronLeft size={14} />}
                onClick={() => navigate('/')}
              >
                Back to home
              </Button>
            </Stack>
          </Center>
        </BackgroundImage>
      </Box>

      {/* ── RIGHT: dashboard panel ────────────────────────────────────── */}
      <Box style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

        {/* Header */}
        <Box
          style={{
            height: 56,
            flexShrink: 0,
            background: 'var(--mantine-color-dark-6)',
            borderBottom: '1px solid var(--mantine-color-dark-4)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
          }}
        >
          <Group justify="space-between" style={{ width: '100%' }}>
            <Group gap="sm">
              {/* Hamburger: visible whenever the inline sidebar is collapsed (< lg) */}
              <Button variant="subtle" size="sm" hiddenFrom="lg" onClick={toggle} px="xs">
                <IconMenu2 size={18} />
              </Button>
              {/* Back to home: only shown on mobile where the hero panel is also hidden */}
              <Button
                variant="subtle"
                size="sm"
                hiddenFrom="sm"
                leftSection={<IconChevronLeft size={16} />}
                onClick={() => navigate('/')}
              >
                Home
              </Button>
              <Group gap={rem(8)} visibleFrom="sm">
                <ThemeIcon variant="gradient" gradient={{ from: 'blue', to: 'cyan' }} size="sm">
                  <IconServer size={14} />
                </ThemeIcon>
                <Text fw={700} size="md">DeployDash</Text>
              </Group>
            </Group>
            <Group gap="xs">
              <Button
                size="sm"
                leftSection={<IconCloudUpload size={15} />}
                onClick={() =>
                  notifications.show({
                    title: 'Deployment triggered',
                    message: 'api-gateway v2.4.1 is being rolled out',
                    color: 'blue',
                    icon: <IconCheck size={16} />,
                  })
                }
              >
                Trigger Deploy
              </Button>
              <ColorSchemeToggle />
            </Group>
          </Group>
        </Box>

        {/* Body row */}
        <Box style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* Sidebar nav — visible from lg (1200px+); collapses to hamburger drawer below that) */}
          <Box
            visibleFrom="lg"
            style={{
              width: 200,
              flexShrink: 0,
              background: 'var(--mantine-color-dark-6)',
              borderRight: '1px solid var(--mantine-color-dark-4)',
              padding: '16px 12px',
              overflow: 'auto',
            }}
          >
            <Stack gap="xs">
              <Text size="xs" c="dimmed" fw={600} tt="uppercase" px={4}>
                Navigation
              </Text>
              <Button variant="subtle" justify="start" leftSection={<IconActivity size={16} />} fullWidth size="sm" onClick={() => navigate('/')}>
                Overview
              </Button>
              <Button variant="light" justify="start" leftSection={<IconFlask size={16} />} fullWidth size="sm">
                Demo
              </Button>
              <Button variant="subtle" justify="start" leftSection={<IconCloudUpload size={16} />} fullWidth size="sm">
                Deployments
              </Button>
            </Stack>
          </Box>

          {/* Drawer nav — shown below lg when hamburger is toggled */}
          {navOpen && (
            <Box
              hiddenFrom="lg"
              style={{
                position: 'absolute',
                top: 56,
                left: 0,
                bottom: 0,
                width: 220,
                zIndex: 200,
                background: 'var(--mantine-color-dark-6)',
                borderRight: '1px solid var(--mantine-color-dark-4)',
                padding: '16px 12px',
                overflow: 'auto',
              }}
            >
              <Stack gap="xs">
                <Text size="xs" c="dimmed" fw={600} tt="uppercase" px={4}>
                  Navigation
                </Text>
                <Button variant="subtle" justify="start" leftSection={<IconActivity size={16} />} fullWidth size="sm" onClick={() => { navigate('/'); toggle(); }}>
                  Overview
                </Button>
                <Button variant="light" justify="start" leftSection={<IconFlask size={16} />} fullWidth size="sm" onClick={toggle}>
                  Demo
                </Button>
                <Button variant="subtle" justify="start" leftSection={<IconCloudUpload size={16} />} fullWidth size="sm" onClick={toggle}>
                  Deployments
                </Button>
              </Stack>
            </Box>
          )}

          {/* Main scrollable content */}
          <ScrollArea style={{ flex: 1 }} p="md" offsetScrollbars>
            <Stack gap="lg" pb="xl">
              <Title order={3}>Overview</Title>

              {/* Stat cards */}
              <SimpleGrid cols={{ base: 2, lg: 4 }}>
                {[
                  { label: 'Total Services', value: '4', color: 'blue', icon: <IconServer size={18} /> },
                  { label: 'Healthy', value: '2', color: 'green', icon: <IconCheck size={18} /> },
                  { label: 'Degraded', value: '1', color: 'yellow', icon: <IconAlertTriangle size={18} /> },
                  { label: 'Down', value: '1', color: 'red', icon: <IconAlertTriangle size={18} /> },
                ].map(({ label, value, color, icon }) => (
                  <Card key={label} withBorder radius="md" p="md">
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">{label}</Text>
                      <ThemeIcon color={color} variant="light" size="md">{icon}</ThemeIcon>
                    </Group>
                    <Text fw={700} size="xl" mt="xs">{value}</Text>
                  </Card>
                ))}
              </SimpleGrid>

              {/* Chart */}
              <Card withBorder radius="md" p="md">
                <Text fw={600} mb="md">CPU &amp; Memory (last 24 h)</Text>
                <AreaChart
                  h={200}
                  data={chartData}
                  dataKey="time"
                  series={[
                    { name: 'cpu', color: 'blue.6', label: 'CPU %' },
                    { name: 'memory', color: 'teal.6', label: 'Memory %' },
                  ]}
                  curveType="monotone"
                  withLegend
                />
              </Card>

              {/* Services */}
              <Card withBorder radius="md" p="md">
                <Text fw={600} mb="md">Services</Text>
                <Stack gap="sm">
                  {services.map((svc) => (
                    <Card key={svc.name} withBorder radius="sm" p="sm">
                      <Grid align="center">
                        <Grid.Col span={5}>
                          <Group gap="xs">
                            <Text fw={500} size="sm">{svc.name}</Text>
                            <Badge color={statusColor(svc.status)} size="sm" leftSection={statusIcon(svc.status)}>
                              {svc.status}
                            </Badge>
                          </Group>
                        </Grid.Col>
                        <Grid.Col span={5}>
                          <Stack gap={4}>
                            <Text size="xs" c="dimmed">Uptime {svc.uptime}%</Text>
                            <Progress value={svc.uptime} color={statusColor(svc.status)} size="sm" radius="xl" />
                          </Stack>
                        </Grid.Col>
                        <Grid.Col span={2}>
                          <Group justify="flex-end">
                            <RingProgress
                              size={44}
                              thickness={4}
                              sections={[{ value: svc.uptime, color: statusColor(svc.status) }]}
                              label={<Text ta="center" size="xs" lh={1}>{svc.deploys}d</Text>}
                            />
                          </Group>
                        </Grid.Col>
                      </Grid>
                    </Card>
                  ))}
                </Stack>
              </Card>

            </Stack>
          </ScrollArea>
        </Box>
      </Box>
    </Box>
  );
}

export default DemoPage;
