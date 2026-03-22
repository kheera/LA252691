import { type ReactNode } from 'react';
import { BackgroundImage, Center, Overlay } from '@mantine/core';
import { BrandDivider } from './BrandDivider';
import { HeroGlassPanel } from './HeroGlassPanel';
import { HeroPanelProvider } from './HeroPanelProvider';
import { HeroContentStack, HeroSubtitle, HeroTitle } from './HeroText';
import { HERO_OVERLAY } from '../../theme';

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
        <HeroContentStack maw={maw}>
          <HeroGlassPanel
            align="center"
            gap="xs"
          >
            <HeroSubtitle>Province of British Columbia</HeroSubtitle>
            <HeroTitle>
              Legislative Assembly
              <br />
              of British Columbia
            </HeroTitle>
            <BrandDivider label="DevOps Services" />
          </HeroGlassPanel>
          {children && (
            <HeroGlassPanel
              align="center"
              gap="sm"
              w="100%"
              bgOpacity={0.5}
            >
              {children}
            </HeroGlassPanel>
          )}
        </HeroContentStack>
      </Center>
    </BackgroundImage>
    </HeroPanelProvider>
  );
}
