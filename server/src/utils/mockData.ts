import type { Service, Deployment, Metric } from '../models/index.js';
import fixtures from '../data/fixtures.json' with { type: 'json' };

export const mockServices: Service[] = fixtures.services;
export const mockDeployments: Deployment[] = fixtures.deployments;
export const mockMetrics: Metric[] = fixtures.metrics;
