import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import type { Service, Deployment, Metric } from '../models/index.js';
import fixtures from '../data/fixtures.json' with { type: 'json' };

export const mockServices: Service[] = fixtures.services;
export const mockDeployments: Deployment[] = fixtures.deployments;
export const mockMetrics: Metric[] = fixtures.metrics;

const fixturesPath = fileURLToPath(new URL('../data/fixtures.json', import.meta.url));

/** Write the current in-memory state back to fixtures.json so changes survive a server restart. */
export function persistFixtures(): void {
  writeFileSync(fixturesPath, JSON.stringify(
    { services: mockServices, deployments: mockDeployments, metrics: mockMetrics },
    null,
    2,
  ));
}
