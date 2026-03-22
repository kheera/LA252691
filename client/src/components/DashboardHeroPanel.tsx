import { Box, Button } from '@mantine/core';
import { IconChevronLeft } from '@tabler/icons-react';
import { HeroBrandingPanel } from './HeroBrandingPanel';
import { useHeroImage } from './useHeroImage';

interface DashboardHeroPanelProps {
  /** Called when the "Back to home" button is clicked */
  onBack: () => void;
}

/**
 * Left-side hero column shown only on xxxl (≥2576px) screens.
 * Displays the BC Legislative Assembly branding in compact mode.
 */
export function DashboardHeroPanel({ onBack }: DashboardHeroPanelProps) {
  const heroImage = useHeroImage();

  return (
    <Box
      visibleFrom="xxxl"
      w={{ xxxl: '28%' }}
      style={{ flexShrink: 0, position: 'relative', overflow: 'hidden' }}
    >
      <HeroBrandingPanel src={heroImage} compact backgroundPosition="25% center">
        <Button
          variant="subtle"
          color="gray.4"
          size="xs"
          leftSection={<IconChevronLeft size={14} />}
          onClick={onBack}
        >
          Back to home
        </Button>
      </HeroBrandingPanel>
    </Box>
  );
}
