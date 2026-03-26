import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import type { Service, Deployment } from '../models/index.js';

// Load fixtures with fs.readFileSync rather than a static `import ... with { type: 'json' }`.
// A static import makes tsx watch track fixtures.json as part of the module graph, so every
// time persistFixtures() writes to the file tsx detects the change and restarts the server —
// killing any in-flight setTimeout callbacks (e.g. pending pipeline resolutions) before they fire.
const fixturesPath = fileURLToPath(new URL('../../data/fixtures.json', import.meta.url));
const fixtures = JSON.parse(readFileSync(fixturesPath, 'utf-8')) as {
  services: Service[];
  deployments: Deployment[];
};

export const mockServices: Service[] = fixtures.services;
export const mockDeployments: Deployment[] = fixtures.deployments;

/** Write the current in-memory state back to fixtures.json so changes survive a server restart. */
export function persistFixtures(): void {
  writeFileSync(fixturesPath, JSON.stringify(
    { services: mockServices, deployments: mockDeployments },
    null,
    2,
  ));
}
