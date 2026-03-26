import type { Request } from 'express';
import type DataLoader from 'dataloader';
import type { Deployment } from './models/index.js';
import { createDeploymentLoader } from './loaders/index.js';
import { validateHttpApiKey } from './utils/apiKeyAuth.js';

export interface AppContext {
  deploymentLoader: DataLoader<string, Deployment[]>;
}

export function createContext(req: Request): AppContext {
  validateHttpApiKey(req);
  return {
    deploymentLoader: createDeploymentLoader(),
  };
}
