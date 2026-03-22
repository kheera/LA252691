import { Box, Button, Group, Text } from '@mantine/core';
import { IconLayoutDashboard } from '@tabler/icons-react';
import { useHeroImage } from './useHeroImage';
import { HeroBrandingPanel } from './HeroBrandingPanel';
import { BRAND_GRADIENT } from '../theme';

interface SplashOverlayProps {
  onDismiss: () => void;
}

export function SplashOverlay({ onDismiss }: SplashOverlayProps) {
  const heroImage = useHeroImage();
  return (
    <Box style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>
      <HeroBrandingPanel src={heroImage} maw={720}>
        <Text c="gray.3" ta="center" size="md" maw={500} lh={1.7}>
          Unified deployment monitoring and service health for parliamentary
          digital infrastructure.
        </Text>
        <Group gap="md" justify="center" mt="md">
          <Button
            size="lg"
            variant="gradient"
            gradient={BRAND_GRADIENT}
            leftSection={<IconLayoutDashboard size={20} />}
            radius="md"
            onClick={onDismiss}
          >
            Open Dashboard
          </Button>
          <Button size="lg" variant="white" color="dark" radius="md" onClick={onDismiss}>
            View Services
          </Button>
        </Group>
      </HeroBrandingPanel>
    </Box>
  );
}
