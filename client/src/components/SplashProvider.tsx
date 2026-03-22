import { type ReactNode } from 'react';
import { useLocalStorage } from '@mantine/hooks';
import { SplashContext } from './SplashContext';
import { SplashOverlay } from './SplashOverlay';

export function SplashProvider({ children }: { children: ReactNode }) {
  const [dismissed, setDismissed] = useLocalStorage({
    key: 'splashDismissed',
    defaultValue: false,
  });

  return (
    <SplashContext.Provider value={{ show: () => setDismissed(false) }}>
      {!dismissed && <SplashOverlay onDismiss={() => setDismissed(true)} />}
      {children}
    </SplashContext.Provider>
  );
}
