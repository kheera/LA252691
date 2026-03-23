import { Badge } from '@mantine/core';

function deployStatusColor(status: string | null): string {
  if (status === 'SUCCESS') return 'green.7';
  if (status === 'FAILED') return 'red.8';
  if (status === 'ROLLING_BACK') return 'orange.7';
  return 'gray.6';
}

function deployStatusLabel(status: string | null): string {
  if (status === 'SUCCESS') return 'Success';
  if (status === 'FAILED') return 'Failed';
  if (status === 'ROLLING_BACK') return 'Rolling back';
  return 'Unknown';
}

interface DeployStatusBadgeProps {
  status: string | null;
  size?: 'xs' | 'sm';
}

export function DeployStatusBadge({ status, size = 'sm' }: DeployStatusBadgeProps) {
  return (
    <Badge color={deployStatusColor(status)} variant="filled" autoContrast size={size}>
      {deployStatusLabel(status)}
    </Badge>
  );
}
