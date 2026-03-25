import { useSubscription } from '@apollo/client/react';
import { notifications } from '@mantine/notifications';
import {
  GET_RECENT_DEPLOYMENTS,
  GET_SERVICE_DETAIL,
  SUBSCRIBE_DEPLOYMENT_SETTLED,
  type DeploymentSettledPayload,
} from '../graphql/services';

/**
 * Subscribes to deployment settlements for the lifetime of the calling component.
 * The WS subscription opens on mount and is automatically torn down on unmount,
 * demonstrating proper cleanup when navigating away from a page.
 *
 * @param serviceId - used to refetch the service detail query on settlement.
 */
export function useDeploymentSettledSubscription(serviceId: string): void {
  useSubscription<DeploymentSettledPayload>(SUBSCRIBE_DEPLOYMENT_SETTLED, {
    onData: ({ client, data: subData }) => {
      const dep = subData.data?.deploymentSettled;
      if (!dep) return;

      // Patch the normalised cache entry in-place for immediate re-render.
      client.cache.modify({
        id: client.cache.identify({ __typename: 'Deployment', id: dep.id }),
        fields: {
          status: () => dep.status,
          durationSeconds: () => dep.durationSeconds,
        },
      });

      // Refetch both the service detail (current page) and the overview
      // deployments list (so it's fresh when the user navigates back).
      client.refetchQueries({ include: [GET_RECENT_DEPLOYMENTS] });
      client.query({ query: GET_SERVICE_DETAIL, variables: { id: serviceId }, fetchPolicy: 'network-only' });

      const succeeded = dep.status === 'SUCCESS';
      notifications.show({
        title: `Deploy ${succeeded ? 'succeeded' : 'failed'}`,
        message: `${dep.version}`,
        color: succeeded ? 'green' : 'red',
        autoClose: 6000,
      });
    },
    onError: () => { /* subscription error — WS indicator handled by metric subscription */ },
  });
}
