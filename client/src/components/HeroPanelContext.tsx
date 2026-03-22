import { createContext, useContext } from 'react';

interface HeroPanelContextValue {
  compact: boolean;
}

export const HeroPanelContext = createContext<HeroPanelContextValue>({ compact: false });

export function useHeroPanelContext(): HeroPanelContextValue {
  return useContext(HeroPanelContext);
}
