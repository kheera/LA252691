// @refresh reset
// Vite fast-refresh pragma: this file exports both a component (ThemeProfileProvider)
// and a hook (useThemeProfile), which Vite's React plugin cannot partially hot-swap.
// `@refresh reset` tells Vite to do a full remount of the component tree rooted at
// ThemeProfileProvider on every save, rather than attempting an in-place patch that
// could leave stale context state during development.

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  COLOR_PROFILES,
  DEFAULT_PROFILE,
  buildCssVariablesResolver,
  buildTheme,
  type ColorProfileKey,
} from '../theme';

const STORAGE_KEY = 'pipeline-view-theme-profile';

function readStoredProfile(): ColorProfileKey {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && Object.prototype.hasOwnProperty.call(COLOR_PROFILES, stored)) {
      return stored as ColorProfileKey;
    }
  } catch {
    // localStorage unavailable (private-browsing restrictions etc.)
  }
  return DEFAULT_PROFILE;
}

interface ThemeProfileContextValue {
  profileKey: ColorProfileKey;
  setProfileKey: (key: ColorProfileKey) => void;
  mantineTheme: ReturnType<typeof buildTheme>;
  cssVariablesResolver: ReturnType<typeof buildCssVariablesResolver>;
}

const ThemeProfileContext = createContext<ThemeProfileContextValue | null>(null);

export function ThemeProfileProvider({ children }: { children: ReactNode }) {
  const [profileKey, setProfileKeyState] = useState<ColorProfileKey>(readStoredProfile);

  const setProfileKey = (key: ColorProfileKey) => {
    setProfileKeyState(key);
    try {
      localStorage.setItem(STORAGE_KEY, key);
    } catch {
      // ignore
    }
  };

  const mantineTheme = useMemo(() => buildTheme(profileKey), [profileKey]);
  const cssVariablesResolver = useMemo(() => buildCssVariablesResolver(profileKey), [profileKey]);

  const value = useMemo(
    () => ({ profileKey, setProfileKey, mantineTheme, cssVariablesResolver }),
    [profileKey, mantineTheme, cssVariablesResolver],
  );

  return (
    <ThemeProfileContext.Provider value={value}>
      {children}
    </ThemeProfileContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useThemeProfile(): ThemeProfileContextValue {
  const ctx = useContext(ThemeProfileContext);
  if (!ctx) throw new Error('useThemeProfile must be used inside <ThemeProfileProvider>');
  return ctx;
}
