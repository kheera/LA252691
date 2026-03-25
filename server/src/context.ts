import type { Request } from 'express';
import type DataLoader from 'dataloader';
import type { Deployment, Metric } from './models/index.js';
import { createDeploymentLoader, createMetricLoader } from './loaders/index.js';
import { validateHttpApiKey } from './utils/apiKeyAuth.js';

export interface AppContext {
  deploymentLoader: DataLoader<string, Deployment[]>;
  metricLoader: DataLoader<string, Metric[]>;
}

export function createContext(req: Request): AppContext {
  validateHttpApiKey(req);
  return {
    deploymentLoader: createDeploymentLoader(),
    metricLoader: createMetricLoader(),
  };
}
