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

function deployments(
  _: unknown,
  { serviceId, status, limit }: { serviceId?: string; status?: string; limit?: number },
): Deployment[] {
  return mockDeployments
    .filter((d) => !serviceId || d.serviceId === serviceId)
    .filter((d) => !status || d.status === status)
    .slice(0, limit ?? undefined);
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
 * The pipeline reports back after 30–60 seconds with a success or failure outcome.
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
      service.lastDeployedAt = new Date().toISOString();
    }
    persistFixtures();
    pubsub.publish(EVENTS.DEPLOYMENT_SETTLED, { deploymentSettled: deployment });
  };
  const delayMs = (Math.floor(Math.random() * 6) + 5) * 1000;
  setTimeout(onPipelineComplete, delayMs);
}

function triggerDeployment(_: unknown, { serviceId, version }: { serviceId: string; version: string }): Deployment {
  const service = mockServices.find((s) => s.id === serviceId);
  if (!service) {
    throw new GraphQLError(`Service '${serviceId}' not found.`, { extensions: { code: 'NOT_FOUND', serviceId } });
  }

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
