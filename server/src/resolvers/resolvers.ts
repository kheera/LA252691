import { randomUUID } from 'node:crypto';
import { GraphQLError } from 'graphql';
import { withFilter } from 'graphql-subscriptions';
import { mockServices, mockDeployments, persistFixtures } from '../utils/mockData.js';
import type { Service, Deployment } from '../models/index.js';
import type { AppContext } from '../context.js';
import { pubsub, EVENTS } from '../pubsub.js';

function services(): Service[] {
  return mockServices;
}

function service(_: unknown, { id }: { id: string }): Service | null {
  return mockServices.find((s) => s.id === id) ?? null;
}

// Hard ceiling to prevent a caller from requesting an unbounded slice of the
// in-memory store. In production this would be enforced at the DB query layer.
const DEPLOYMENTS_MAX_LIMIT = 500;

function deployments(
  _: unknown,
  { serviceId, status, limit }: { serviceId?: string; status?: string; limit?: number },
): Deployment[] {
  const effectiveLimit = limit !== undefined ? Math.min(limit, DEPLOYMENTS_MAX_LIMIT) : undefined;
  return mockDeployments
    .filter((d) => !serviceId || d.serviceId === serviceId)
    .filter((d) => !status || d.status === status)
    .slice(0, effectiveLimit);
}

/**
 * Uses DataLoader to batch and cache deployments by service ID, avoiding N+1 query issues when fetching deployments for multiple services in the Service resolver.
 * Assumes deployments are stored in ascending chronological order (oldest first), so slice(-last) returns
 * the most recent `last` entries. With a real DB this would be: ORDER BY timestamp DESC LIMIT $last.
 */
function batchDeploymentsLoader(parent: { id: string }, { last }: { last?: number }, context: AppContext): Promise<Deployment[]> {
  return context.deploymentLoader.load(parent.id).then((all) => (last ? all.slice(-last) : all));
}

/**
 * Simulates handing off to a CI/CD pipeline (e.g. dispatching a GitHub Actions workflow).
 * The pipeline reports back after 5–10 seconds with a success or failure outcome.
 */
function dispatchPipeline(deployment: Deployment, service: Service, version: string): void {
  // Simulate deployment risk: beta builds are more likely to fail
  const BETA_FAILURE_RATE = 0.75;
  const STABLE_FAILURE_RATE = 0.20;
  const failureRate = /-beta\d*$/i.test(version) ? BETA_FAILURE_RATE : STABLE_FAILURE_RATE;
  const startedAt = Date.now();
  const onPipelineComplete = () => {
    const failed = Math.random() < failureRate;
    deployment.status = failed ? 'FAILED' : 'SUCCESS';
    deployment.durationSeconds = Math.round((Date.now() - startedAt) / 1000);

    if (failed) {
      service.status = 'DOWN';
    } else {
      service.status = 'HEALTHY';
      service.lastDeployedAt = new Date().toISOString();
    }
    persistFixtures();
    pubsub.publish(EVENTS.DEPLOYMENT_SETTLED, { deploymentSettled: deployment });
  };
  const delayMs = (Math.floor(Math.random() * 6) + 5) * 1000;
  setTimeout(onPipelineComplete, delayMs);
}

/**
 * Accepted version format: optional "v" prefix, then MAJOR.MINOR.PATCH semver,
 * with an optional "-beta<N>" pre-release suffix (e.g. v1.2.3, 1.2.3, v2.0.0-beta1).
 * Max length 50 characters. Anything else is rejected with BAD_USER_INPUT.
 */
const VERSION_RE = /^v?\d+\.\d+\.\d+(-beta\d*)?$/;
const VERSION_MAX_LEN = 50;

/**
 * In-memory rate limiter: max 3 triggerDeployment calls per service per 60-second fixed window.
 * Each entry records the start of the current window and the call count within it.
 * In production this should be replaced with a distributed store — see README.
 */
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 60_000;
interface RateWindow { windowStart: number; count: number; }
const deployRateWindows = new Map<string, RateWindow>();

function checkDeployRateLimit(serviceId: string): void {
  const now = Date.now();
  const entry = deployRateWindows.get(serviceId);
  if (!entry || now - entry.windowStart >= RATE_LIMIT_WINDOW_MS) {
    deployRateWindows.set(serviceId, { windowStart: now, count: 1 });
    return;
  }
  if (entry.count >= RATE_LIMIT_MAX) {
    const retryAfter = Math.ceil((entry.windowStart + RATE_LIMIT_WINDOW_MS - now) / 1000);
    throw new GraphQLError(
      `Rate limit exceeded: no more than ${RATE_LIMIT_MAX} deployments per service per minute. Retry in ${retryAfter}s.`,
      { extensions: { code: 'RATE_LIMIT_EXCEEDED', retryAfter, serviceId } },
    );
  }
  entry.count += 1;
}

function triggerDeployment(_: unknown, { serviceId, version }: { serviceId: string; version: string }): Deployment {
  const service = mockServices.find((s) => s.id === serviceId);
  if (!service) {
    throw new GraphQLError(`Service '${serviceId}' not found.`, { extensions: { code: 'NOT_FOUND', serviceId } });
  }

  if (version.length > VERSION_MAX_LEN || !VERSION_RE.test(version)) {
    throw new GraphQLError(
      `Invalid version '${version}'. Must be a semver string (e.g. v1.2.3 or v1.2.3-beta1), max ${VERSION_MAX_LEN} characters.`,
      { extensions: { code: 'BAD_USER_INPUT', argumentName: 'version' } },
    );
  }

  checkDeployRateLimit(serviceId);

  // NOTE — this is an intentionally narrow rule: it only blocks re-deploying the EXACT same
  // version string while that version is rolling back. A different version can be deployed to
  // the same service even while a rollback is in progress. This is deliberate — it lets teams
  // push a hotfix forward without waiting, but prevents blindly re-queuing the broken version
  // that caused the rollback in the first place.
  const rollingBack = mockDeployments.find(
    (d) => d.serviceId === serviceId && d.version === version && d.status === 'ROLLING_BACK',
  );
  if (rollingBack) {
    throw new GraphQLError(
      `Cannot deploy version ${version}: that exact version is currently rolling back. Deploy a different version, or wait for the rollback to complete before re-deploying this one.`,
      { extensions: { code: 'VERSION_COLLISION', serviceId, version } },
    );
  }

  const now = new Date().toISOString();

  // Create a PENDING deployment and return it immediately — resolution happens asynchronously below.
  const newDeployment: Deployment = {
    id: randomUUID(),
    serviceId,
    version,
    deployedBy: 'manual',
    timestamp: now,
    status: 'PENDING',
    durationSeconds: 0,
  };

  mockDeployments.push(newDeployment); // append oldest-first so DataLoader's slice(-last) returns the most recent N
  persistFixtures();

  dispatchPipeline(newDeployment, service, version);

  return newDeployment;
}

function acknowledgeOutage(_: unknown, { serviceId }: { serviceId: string }): Service {
  const service = mockServices.find((s) => s.id === serviceId);
  if (!service) {
    throw new GraphQLError(`Service '${serviceId}' not found.`, { extensions: { code: 'NOT_FOUND', serviceId } });
  }

  service.status = 'DEGRADED';
  persistFixtures();

  return service;
}

export const resolvers = {
  Query: { services, service, deployments },
  Mutation: { triggerDeployment, acknowledgeOutage },
  Service: { deployments: batchDeploymentsLoader },
  Subscription: {
    metricUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterableIterator(EVENTS.METRIC_UPDATED),
        (payload: { metricUpdated: { serviceId: string } } | undefined, variables: { serviceId: string } | undefined) =>
          payload?.metricUpdated.serviceId === variables?.serviceId,
      ),
    },
    deploymentSettled: {
      subscribe: () => pubsub.asyncIterableIterator(EVENTS.DEPLOYMENT_SETTLED),
    },
  },
};
