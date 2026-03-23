import { Button } from '@mantine/core';
import { IconChevronLeft, IconMenu2 } from '@tabler/icons-react';

interface HeaderNavControlsProps {
  /** Opens the mobile drawer nav. Visible only below the `lg` breakpoint. */
  onMenuToggle: () => void;
  /** Navigates back to the splash/home screen. Visible only below the `sm` breakpoint. */
  onHomeClick: () => void;
}

/**
 * Mobile navigation controls rendered in the header left section.
 * Each button is automatically hidden at the breakpoint where it is no longer needed.
 */
export function HeaderNavControls({ onMenuToggle, onHomeClick }: HeaderNavControlsProps) {
  return (
    <>
      <Button variant="subtle" size="sm" onClick={onMenuToggle} px="xs">
        <IconMenu2 size={18} />
      </Button>
      <Button
        variant="subtle"
        size="sm"
        hiddenFrom="sm"
        leftSection={<IconChevronLeft size={16} />}
        onClick={onHomeClick}
      >
        Home
      </Button>
    </>
  );
}
