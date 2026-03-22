import { Button } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconCloudUpload } from '@tabler/icons-react';

export function TriggerDeployButton() {
  return (
    <Button
      size="sm"
      leftSection={<IconCloudUpload size={15} />}
      onClick={() =>
        notifications.show({
          title: 'Deployment triggered',
          message: 'api-gateway v2.4.1 is being rolled out',
          color: 'blue',
          icon: <IconCheck size={16} />,
        })
      }
    >
      Trigger Deploy
    </Button>
  );
}
