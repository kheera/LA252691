import type DataLoader from 'dataloader';
import type { Deployment } from './models/index.js';
import { createDeploymentLoader } from './loaders/index.js';

export interface AppContext {
  deploymentLoader: DataLoader<string, Deployment[]>;
}

export function createContext(): AppContext {
  return {
    deploymentLoader: createDeploymentLoader(),
  };
}
