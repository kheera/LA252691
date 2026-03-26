import { type ReactNode } from 'react';
import { Card, Text } from '@mantine/core';

interface ContentCardProps {
  title: string;
  children: ReactNode;
}

export function ContentCard({ title, children }: ContentCardProps) {
  return (
    <Card withBorder radius="md" p="md">
      <Text size="md" fw={600} mb="md">{title}</Text>
      {children}
    </Card>
  );
}
