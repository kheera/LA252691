import type DataLoader from 'dataloader';
import type { Deployment, Metric } from './models/index.js';
import { createDeploymentLoader, createMetricLoader } from './loaders/index.js';

export interface AppContext {
  deploymentLoader: DataLoader<string, Deployment[]>;
  metricLoader: DataLoader<string, Metric[]>;
}

export function createContext(): AppContext {
  return {
    deploymentLoader: createDeploymentLoader(),
    metricLoader: createMetricLoader(),
  };
}
