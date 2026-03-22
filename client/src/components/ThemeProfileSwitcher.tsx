import { Group, Tooltip, UnstyledButton, Box } from '@mantine/core';
import { COLOR_PROFILES, type ColorProfileKey } from '../theme';
import { useThemeProfile } from './ThemeProfileContext';

const PROFILE_KEYS = Object.keys(COLOR_PROFILES) as ColorProfileKey[];

export function ThemeProfileSwitcher() {
  const { profileKey, setProfileKey } = useThemeProfile();

  return (
    <Group gap={6} wrap="nowrap">
      {PROFILE_KEYS.map((key) => {
        const profile = COLOR_PROFILES[key];
        const isActive = key === profileKey;
        return (
          <Tooltip key={key} label={profile.label} withArrow>
            <UnstyledButton
              onClick={() => setProfileKey(key)}
              aria-label={`Switch to ${profile.label} theme`}
              aria-pressed={isActive}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Box
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  backgroundColor: profile.swatch,
                  outline: isActive ? `2px solid ${profile.swatch}` : '2px solid transparent',
                  outlineOffset: 2,
                  opacity: isActive ? 1 : 0.55,
                  transition: 'opacity 120ms ease, outline-color 120ms ease',
                }}
              />
            </UnstyledButton>
          </Tooltip>
        );
      })}
    </Group>
  );
}
