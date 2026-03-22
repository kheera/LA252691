import { type ReactNode } from 'react';
import { BackgroundImage, Center, Overlay, rem, Stack, Text, Title } from '@mantine/core';
import { BrandDivider } from './BrandDivider';
import { HeroPanelProvider } from './HeroPanelProvider';
import { HERO_OVERLAY } from '../theme';

interface HeroBrandingPanelProps {
  src: string;
  /**
   * compact=false (default): full-page hero sizing (SplashPage)
   * compact=true: sidebar/panel sizing (DemoPage xxxl column)
   */
  compact?: boolean;
  /** Max width of the inner content stack; e.g. 720 for the full-page hero */
  maw?: number;
  /**
   * CSS background-position for the hero image.
   * Defaults to 'center'. Pass '25% center' when the panel is a narrow left column
   * beside the dashboard so the subject of the image stays visible.
   */
  backgroundPosition?: string;
  /** Content rendered below the branding block (description + CTAs, or back button) */
  children?: ReactNode;
}

export function HeroBrandingPanel({ src, compact = false, maw, backgroundPosition = 'center', children }: HeroBrandingPanelProps) {
  return (
    <HeroPanelProvider compact={compact}>
    <BackgroundImage
      src={src}
      style={{ height: '100%', backgroundPosition, backgroundSize: 'cover' }}
    >
      <Overlay
        gradient={HERO_OVERLAY}
        opacity={1}
        zIndex={1}
      />
      <Center style={{ height: '100%', position: 'relative', zIndex: 2 }}>
        <Stack align="center" gap={compact ? 'lg' : 'xl'} px="xl" maw={maw}>
          <Stack align="center" gap="xs">
            <Text
              size={compact ? 'xs' : 'sm'}
              fw={600}
              tt="uppercase"
              c="brand.3"
              style={{ letterSpacing: rem(3) }}
            >
              Province of British Columbia
            </Text>
            <Title
              order={compact ? 2 : 1}
              ta="center"
              c="white"
              style={{
                fontSize: compact ? 'clamp(1.1rem, 2.5vw, 2rem)' : 'clamp(1.8rem, 5vw, 3.2rem)',
                lineHeight: compact ? 1.25 : 1.2,
              }}
            >
              Legislative Assembly
              <br />
              of British Columbia
            </Title>
            <BrandDivider label="DevOps Services" mt={compact ? undefined : 'xs'} />
          </Stack>
          {children}
        </Stack>
      </Center>
    </BackgroundImage>
    </HeroPanelProvider>
  );
}
