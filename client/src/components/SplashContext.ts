import { createContext, useContext } from 'react';

interface SplashContextValue {
  show: () => void;
}

export const SplashContext = createContext<SplashContextValue>({ show: () => {} });

export function useSplash(): SplashContextValue {
  return useContext(SplashContext);
}
