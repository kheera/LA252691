import {
  BackgroundImage,
  Box,
  Button,
  Center,
  Group,
  Overlay,
  rem,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconLayoutDashboard } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { ColorSchemeToggle } from '../../components/ColorSchemeToggle';
import { useHeroImage } from '../../components/useHeroImage';

export function SplashPage() {
  const navigate = useNavigate();
  const heroImage = useHeroImage();

  return (
    <Box style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      <BackgroundImage
        src={heroImage}
        style={{ height: '100%', backgroundPosition: 'center', backgroundSize: 'cover' }}
      >
        <Overlay
          gradient="linear-gradient(160deg, rgba(0,0,0,0.80) 0%, rgba(0,30,80,0.70) 100%)"
          opacity={1}
          zIndex={1}
        />

        <ColorSchemeToggle variant="white" floating />

        <Center style={{ height: '100%', position: 'relative', zIndex: 2 }}>
          <Stack align="center" gap="xl" maw={720} px="xl">
            <Stack align="center" gap="xs">
              <Text
                size="sm"
                fw={600}
                tt="uppercase"
                c="blue.3"
                style={{ letterSpacing: rem(3) }}
              >
                Province of British Columbia
              </Text>
              <Title
                order={1}
                ta="center"
                c="white"
                style={{ fontSize: 'clamp(1.8rem, 5vw, 3.2rem)', lineHeight: 1.2 }}
              >
                Legislative Assembly
                <br />
                of British Columbia
              </Title>
              <Group gap="xs" justify="center" mt="xs">
                <Box
                  style={{
                    height: 2,
                    width: rem(48),
                    background: 'var(--mantine-color-blue-4)',
                    borderRadius: 2,
                  }}
                />
                <Text
                  fw={500}
                  ta="center"
                  c="blue.2"
                  size="xl"
                  style={{ fontSize: 'clamp(1rem, 2.5vw, 1.35rem)' }}
                >
                  DevOps Services
                </Text>
                <Box
                  style={{
                    height: 2,
                    width: rem(48),
                    background: 'var(--mantine-color-blue-4)',
                    borderRadius: 2,
                  }}
                />
              </Group>
            </Stack>

            <Text c="gray.3" ta="center" size="md" maw={500} lh={1.7}>
              Unified deployment monitoring and service health for parliamentary
              digital infrastructure.
            </Text>

            <Group gap="md" justify="center" mt="md">
              <Button
                size="lg"
                variant="gradient"
                gradient={{ from: 'blue', to: 'cyan' }}
                leftSection={<IconLayoutDashboard size={20} />}
                radius="md"
                onClick={() => navigate('/')}
              >
                Open Dashboard
              </Button>
              <Button size="lg" variant="white" color="dark" radius="md" onClick={() => navigate('/')}>
                View Services
              </Button>
            </Group>
          </Stack>
        </Center>
      </BackgroundImage>
    </Box>
  );
}

export default SplashPage;
