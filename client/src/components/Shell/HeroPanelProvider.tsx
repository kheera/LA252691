import { type ReactNode } from 'react';
import { HeroPanelContext } from './HeroPanelContext';

export function HeroPanelProvider({ compact, children }: { compact: boolean; children: ReactNode }) {
  return <HeroPanelContext.Provider value={{ compact }}>{children}</HeroPanelContext.Provider>;
}
