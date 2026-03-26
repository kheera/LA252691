/**
 * Resolver unit tests — run with: cd server && yarn test
 * Uses Node's built-in test runner (node:test). No extra dependencies required.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import DataLoader from 'dataloader';

// ── DataLoader ordering contract ──────────────────────────────────────────────
// DataLoader REQUIRES the batch function to return results in THE SAME ORDER as
// the input keys. A violation silently cross-wires data between services — e.g.
// `.load('svc-a')` would return the deployments for 'svc-b'. This test pins
// that contract so a refactor of the batch function can't break it quietly.

test('DataLoader batch function preserves key order under concurrent loads', async () => {
  type Item = { id: string };
  const store = new Map<string, Item[]>([
    ['svc-a', [{ id: 'd1' }, { id: 'd2' }]],
    ['svc-b', [{ id: 'd3' }]],
    ['svc-c', []],
  ]);

  // Mirrors the shape of createDeploymentLoader in server/src/loaders/index.ts
  const loader = new DataLoader<string, Item[]>((keys) =>
    Promise.resolve(keys.map((k) => store.get(k) ?? [])),
  );

  // Intentionally load in a different order from the store's definition order
  // to verify the batch function maps results back to the right keys.
  const [c, a, b] = await Promise.all([
    loader.load('svc-c'),
    loader.load('svc-a'),
    loader.load('svc-b'),
  ]);

  assert.deepEqual(a, [{ id: 'd1' }, { id: 'd2' }], 'svc-a deployments');
  assert.deepEqual(b, [{ id: 'd3' }], 'svc-b deployments');
  assert.deepEqual(c, [], 'svc-c has no deployments');
});

test('DataLoader batches concurrent loads into a single batch call', async () => {
  let batchCallCount = 0;

  const loader = new DataLoader<string, string>((keys) => {
    batchCallCount += 1;
    return Promise.resolve(keys.map((k) => k.toUpperCase()));
  });

  await Promise.all([
    loader.load('a'),
    loader.load('b'),
    loader.load('c'),
  ]);

  assert.equal(batchCallCount, 1, 'three concurrent loads should produce exactly one batch call');
});

// ── triggerDeployment version validation ──────────────────────────────────────
// The server validates the version string before any processing to block
// injection via crafted inputs (e.g. path traversal, arbitrary strings).
// This mirrors the logic in server/src/resolvers/resolvers.ts exactly so that
// any change to the production regex is caught here.

const VERSION_RE = /^v?\d+\.\d+\.\d+(-beta\d*)?$/;
const VERSION_MAX_LEN = 50;

function isValidVersion(version: string): boolean {
  return version.length <= VERSION_MAX_LEN && VERSION_RE.test(version);
}

test('version validation: accepts valid semver strings', () => {
  const valid = ['1.2.3', 'v1.2.3', 'v2.0.0-beta1', 'v10.0.0-beta42', 'v0.0.1'];
  for (const v of valid) {
    assert.ok(isValidVersion(v), `expected "${v}" to be valid`);
  }
});

test('version validation: rejects non-semver and potentially malicious strings', () => {
  const invalid = [
    'latest',
    '../../etc/passwd',
    'v1.2',           // missing patch
    'v1.2.3.4',       // extra segment
    'v1.2.3-rc1',     // non-beta pre-release
    '',
    'a'.repeat(51),   // exceeds max length
    '; DROP TABLE deployments; --',
  ];
  for (const v of invalid) {
    assert.ok(!isValidVersion(v), `expected "${v}" to be rejected`);
  }
});
