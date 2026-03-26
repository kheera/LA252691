import { Badge } from '@mantine/core';
import type { DeploymentStatus } from '../graphql/services';

const DEPLOY_STATUS_COLOR: Record<DeploymentStatus, string> = {
  SUCCESS: 'green.7',
  FAILED: 'red.8',
  ROLLING_BACK: 'orange.7',
  PENDING: 'blue.6',
};

const DEPLOY_STATUS_LABEL: Record<DeploymentStatus, string> = {
  SUCCESS: 'Success',
  FAILED: 'Failed',
  ROLLING_BACK: 'Rolling back',
  PENDING: 'Pending…',
};

function deployStatusColor(status: DeploymentStatus | null): string {
  return status ? DEPLOY_STATUS_COLOR[status] : 'gray.6';
}

function deployStatusLabel(status: DeploymentStatus | null): string {
  return status ? DEPLOY_STATUS_LABEL[status] : 'Unknown';
}

interface DeployStatusBadgeProps {
  status: DeploymentStatus | null;
  size?: 'xs' | 'sm';
}

export function DeployStatusBadge({ status, size = 'sm' }: DeployStatusBadgeProps) {
  return (
    <Badge color={deployStatusColor(status)} variant="filled" autoContrast size={size}>
      {deployStatusLabel(status)}
    </Badge>
  );
}
