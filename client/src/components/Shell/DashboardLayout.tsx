import { type ReactNode } from 'react';
import { Alert, Box, ScrollArea, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconCloudOff } from '@tabler/icons-react';
import { DashboardHeroPanel } from './DashboardHeroPanel';
import { DashboardHeader } from './DashboardHeader';
import { DashboardSidebar } from './DashboardSidebar';
import { useSplash } from './SplashContext';
import { WsStatusIndicator } from '../WsStatusIndicator';
import { useIsServerOffline } from '../../apollo/offlineRetryLink';

interface DashboardLayoutProps {
  /** Extra controls rendered on the right side of the header, before the WS indicator */
  headerActions?: ReactNode;
  children: ReactNode;
}

export function DashboardLayout({ headerActions, children }: DashboardLayoutProps) {
  const [navOpen, { toggle }] = useDisclosure(true);
  const { show: showSplash } = useSplash();
  const serverOffline = useIsServerOffline();

  return (
    <Box style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>

      {/* Left hero column — xxxl screens only */}
      <DashboardHeroPanel onBack={showSplash} />

      {/* Right panel */}
      <Box style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

        <DashboardHeader
          onMenuToggle={toggle}
          onHomeClick={showSplash}
          actions={<>{headerActions}<WsStatusIndicator /></>}
        />

        {serverOffline && (
          <Alert
            color="orange"
            icon={<IconCloudOff size={16} />}
            radius={0}
            py={6}
            px="md"
            styles={{ root: { borderTop: 'none', borderLeft: 'none', borderRight: 'none' } }}
          >
            <Text size="sm">Server offline — displaying cached data if available. Retrying in the background…</Text>
          </Alert>
        )}

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
