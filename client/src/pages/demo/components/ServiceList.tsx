import { Card, Stack, Text } from '@mantine/core';
import { ServiceRow, type DemoService } from './ServiceRow';

const services: DemoService[] = [
  { name: 'api-gateway',   status: 'HEALTHY',  uptime: 99.9,  deploys: 8  },
  { name: 'auth-service',  status: 'DEGRADED', uptime: 97.2,  deploys: 3  },
  { name: 'data-pipeline', status: 'DOWN',     uptime: 81.0,  deploys: 12 },
  { name: 'frontend-cdn',  status: 'HEALTHY',  uptime: 100.0, deploys: 5  },
];

export function ServiceList() {
  return (
    <Card withBorder radius="md" p="md">
      <Text fw={600} mb="md">Services</Text>
      <Stack gap="sm">
        {services.map((svc) => (
          <ServiceRow key={svc.name} svc={svc} />
        ))}
      </Stack>
    </Card>
  );
}
