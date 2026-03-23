import { type ReactNode } from 'react';
import { Box, ScrollArea, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { DashboardHeroPanel } from './DashboardHeroPanel';
import { DashboardHeader } from './DashboardHeader';
import { DashboardSidebar } from './DashboardSidebar';
import { useSplash } from './SplashContext';

interface DashboardLayoutProps {
  /** Extra controls rendered on the right side of the header (e.g. a deploy button) */
  headerActions?: ReactNode;
  children: ReactNode;
}

export function DashboardLayout({ headerActions, children }: DashboardLayoutProps) {
  const [navOpen, { toggle }] = useDisclosure(true);
  const { show: showSplash } = useSplash();

  return (
    <Box style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>

      {/* Left hero column — xxxl screens only */}
      <DashboardHeroPanel onBack={showSplash} />

      {/* Right panel */}
      <Box style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

        <DashboardHeader
          onMenuToggle={toggle}
          onHomeClick={showSplash}
          actions={headerActions}
        />

        <Box style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          <DashboardSidebar navOpen={navOpen} onClose={toggle} />

          <ScrollArea style={{ flex: 1 }} p="md" offsetScrollbars>
            <Stack gap="lg" pb="xl">
              {children}
            </Stack>
          </ScrollArea>
        </Box>
      </Box>
    </Box>
  );
}
