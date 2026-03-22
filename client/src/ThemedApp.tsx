import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import App from './App.tsx';
import { useThemeProfile } from './components/ThemeProfileContext.tsx';

/**
 * Consumes the ThemeProfileContext (provided by ThemeProfileProvider in main.tsx)
 * and passes the live theme + cssVariablesResolver down to MantineProvider.
 * Kept in a separate file so Vite's fast-refresh can track it independently.
 */
export function ThemedApp() {
  const { mantineTheme, cssVariablesResolver } = useThemeProfile();
  return (
    <MantineProvider theme={mantineTheme} defaultColorScheme="dark" cssVariablesResolver={cssVariablesResolver}>
      <Notifications />
      <App />
    </MantineProvider>
  );
}
