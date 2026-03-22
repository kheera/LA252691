import {
  BackgroundImage,
  Box,
  Button,
  Center,
  Group,
  Overlay,
  rem,
  ScrollArea,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconActivity,
  IconChevronLeft,
  IconCloudUpload,
  IconFlask,
  IconHome,
  IconMenu2,
  IconServer,
} from '@tabler/icons-react';
import { useSplash } from '../../components/SplashContext';
import { ColorSchemeToggle } from '../../components/ColorSchemeToggle';
import { useNavigate, useLocation } from 'react-router-dom';
import { useHeroImage } from '../../components/useHeroImage';
import { ServiceCard, type ServiceSummary } from './components/ServiceCard/ServiceCard';

// ── Mock data — replace with useQuery(GET_SERVICES) when wiring up the backend ──
const mockServices: ServiceSummary[] = [
  { id: 's1', name: 'api-gateway',       status: 'HEALTHY',  uptime: 99.9, lastDeployedAt: '2026-03-20T10:00:00Z' },
  { id: 's2', name: 'auth-service',      status: 'DEGRADED', uptime: 95.2, lastDeployedAt: '2026-03-19T09:15:00Z' },
  { id: 's3', name: 'reporting-service', status: 'HEALTHY',  uptime: 98.7, lastDeployedAt: '2026-03-17T08:00:00Z' },
  { id: 's4', name: 'scheduler',         status: 'DOWN',     uptime: 71.3, lastDeployedAt: '2026-03-21T06:45:00Z' },
  { id: 's5', name: 'intake-portal',     status: null,       uptime: null,  lastDeployedAt: null },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export function OverviewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [navOpen, { toggle }] = useDisclosure(false);
  const { show: showSplash } = useSplash();
  const heroImage = useHeroImage();

  const isActive = (path: string) => location.pathname === path;

  return (
    <Box style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>

      {/* ── LEFT: hero splash panel (xxxl / >2576px only) ─────────────── */}
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
              <Text size="xs" fw={600} tt="uppercase" c="blue.3" style={{ letterSpacing: rem(3) }}>
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
                <Box style={{ height: 2, width: rem(36), background: 'var(--mantine-color-blue-4)', borderRadius: 2 }} />
                <Text fw={500} c="blue.2" style={{ fontSize: 'clamp(0.75rem, 1.5vw, 1.1rem)' }}>
                  DevOps Services
                </Text>
                <Box style={{ height: 2, width: rem(36), background: 'var(--mantine-color-blue-4)', borderRadius: 2 }} />
              </Group>
              <Button
                variant="subtle"
                color="gray.4"
                size="xs"
                leftSection={<IconChevronLeft size={14} />}
                onClick={() => navigate('/splash')}
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
            background: 'var(--mantine-color-default)',
            borderBottom: '1px solid var(--mantine-color-default-border)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
          }}
        >
          <Group justify="space-between" style={{ width: '100%' }}>
            <Group gap="sm">
              <Button variant="subtle" size="sm" hiddenFrom="lg" onClick={toggle} px="xs">
                <IconMenu2 size={18} />
              </Button>
              <Button
                variant="subtle"
                size="sm"
                hiddenFrom="sm"
                leftSection={<IconChevronLeft size={16} />}
                onClick={() => navigate('/splash')}
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
            <ColorSchemeToggle />
          </Group>
        </Box>

        {/* Body row */}
        <Box style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* Sidebar — inline from lg */}
          <Box
            visibleFrom="lg"
            style={{
              width: 200,
              flexShrink: 0,
              background: 'var(--mantine-color-default)',
              borderRight: '1px solid var(--mantine-color-default-border)',
              padding: '16px 12px',
              overflow: 'auto',
            }}
          >
            <Stack gap="xs">
              <Text size="xs" c="dimmed" fw={600} tt="uppercase" px={4}>Navigation</Text>
              <Button
                variant="subtle"
                justify="start"
                leftSection={<IconHome size={16} />}
                fullWidth
                size="sm"
                onClick={showSplash}
              >
                Home
              </Button>
              <Button
                variant={isActive('/') ? 'light' : 'subtle'}
                justify="start"
                leftSection={<IconActivity size={16} />}
                fullWidth
                size="sm"
                onClick={() => navigate('/')}
              >
                Overview
              </Button>
              <Button
                variant={isActive('/demo') ? 'light' : 'subtle'}
                justify="start"
                leftSection={<IconFlask size={16} />}
                fullWidth
                size="sm"
                onClick={() => navigate('/demo')}
              >
                Demo
              </Button>
              <Button
                variant="subtle"
                justify="start"
                leftSection={<IconCloudUpload size={16} />}
                fullWidth
                size="sm"
              >
                Deployments
              </Button>
            </Stack>
          </Box>

          {/* Drawer nav — hamburger below lg */}
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
                background: 'var(--mantine-color-default)',
                borderRight: '1px solid var(--mantine-color-default-border)',
                padding: '16px 12px',
                overflow: 'auto',
              }}
            >
              <Stack gap="xs">
                <Text size="xs" c="dimmed" fw={600} tt="uppercase" px={4}>Navigation</Text>
                <Button
                  variant="subtle"
                  justify="start"
                  leftSection={<IconHome size={16} />}
                  fullWidth
                  size="sm"
                  onClick={() => { showSplash(); toggle(); }}
                >
                  Home
                </Button>
                <Button
                  variant="light"
                  justify="start"
                  leftSection={<IconActivity size={16} />}
                  fullWidth
                  size="sm"
                  onClick={() => { navigate('/'); toggle(); }}
                >
                  Overview
                </Button>
                <Button
                  variant="subtle"
                  justify="start"
                  leftSection={<IconFlask size={16} />}
                  fullWidth
                  size="sm"
                  onClick={() => { navigate('/demo'); toggle(); }}
                >
                  Demo
                </Button>
                <Button
                  variant="subtle"
                  justify="start"
                  leftSection={<IconCloudUpload size={16} />}
                  fullWidth
                  size="sm"
                  onClick={toggle}
                >
                  Deployments
                </Button>
              </Stack>
            </Box>
          )}

          {/* Main content */}
          <ScrollArea style={{ flex: 1 }} p="md" offsetScrollbars>
            <Stack gap="lg" pb="xl">
              <Group justify="space-between" align="center">
                <Title order={3}>Services Overview</Title>
                <Text size="xs" c="dimmed">{mockServices.length} services</Text>
              </Group>

              <SimpleGrid cols={{ base: 1, sm: 2, lg: 3, xl: 4 }}>
                {mockServices.map((svc) => (
                  <ServiceCard key={svc.id} svc={svc} />
                ))}
              </SimpleGrid>
            </Stack>
          </ScrollArea>
        </Box>
      </Box>
    </Box>
  );
}

export default OverviewPage;
