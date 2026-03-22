import { useMutation } from '@apollo/client/react';
import { Button, Group, Modal, Stack, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconAlertTriangle } from '@tabler/icons-react';
import {
  ACKNOWLEDGE_OUTAGE,
  GET_SERVICE_DETAIL,
  GET_SERVICES,
  type AcknowledgeOutageResult,
} from '../../../graphql/services';

interface AcknowledgeOutageModalProps {
  opened: boolean;
  onClose: () => void;
  serviceId: string;
  serviceName: string;
}

export function AcknowledgeOutageModal({ opened, onClose, serviceId, serviceName }: AcknowledgeOutageModalProps) {
  const [acknowledgeOutage, { loading }] = useMutation<AcknowledgeOutageResult>(ACKNOWLEDGE_OUTAGE, {
    refetchQueries: [
      { query: GET_SERVICE_DETAIL, variables: { id: serviceId } },
      { query: GET_SERVICES },
    ],
    onCompleted: () => {
      notifications.show({
        title: 'Outage acknowledged',
        message: `${serviceName} status updated to Degraded`,
        color: 'orange',
      });
      onClose();
    },
    onError: (err) => {
      notifications.show({
        title: 'Failed to acknowledge outage',
        message: err.message,
        color: 'red',
      });
    },
  });

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Acknowledge Outage"
      centered
      closeOnClickOutside={!loading}
      closeOnEscape={!loading}
    >
      <Stack gap="md">
        <Text size="sm">
          This will update the status of <strong>{serviceName}</strong> from{' '}
          <Text span c="red.7" fw={600}>Down</Text> to{' '}
          <Text span c="orange.7" fw={600}>Degraded</Text>,
          indicating the service is recovering but not yet fully operational.
        </Text>
        <Group justify="flex-end" mt="xs">
          <Button variant="default" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button
            color="orange"
            leftSection={<IconAlertTriangle size={14} />}
            loading={loading}
            onClick={() => acknowledgeOutage({ variables: { serviceId } })}
          >
            Continue
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
