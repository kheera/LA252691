import { useState } from 'react';
import { Button, Checkbox, Group, Modal, SegmentedControl, Stack, Text, TextInput } from '@mantine/core';
import { IconRocket } from '@tabler/icons-react';

type BumpType = 'patch' | 'minor' | 'major';

const BUMP_DESCRIPTIONS: Record<BumpType, string> = {
  patch: 'Bug fixes — backwards compatible. e.g. v2.4.1 → v2.4.2',
  minor: 'New features — backwards compatible. e.g. v2.4.1 → v2.5.0',
  major: 'Breaking changes — not backwards compatible. e.g. v2.4.1 → v3.0.0',
};

/**
 * Bumps a version string according to semver bump type and optional beta suffix.
 *
 * From a stable base:
 *   patch: v2.4.1 → v2.4.2  (or v2.4.2-beta1)
 *   minor: v2.4.1 → v2.5.0  (or v2.5.0-beta1)
 *   major: v2.4.1 → v3.0.0  (or v3.0.0-beta1)
 *
 * From a beta base (e.g. v1.2.3-beta2):
 *   isBeta=true  → continue beta line: v1.2.3-beta3  (bumpType ignored — base already fixed)
 *   isBeta=false → graduate: v1.2.3  (bumpType ignored — base already fixed)
 */
interface BumpOptions { bumpType: BumpType; isBeta: boolean }

function bumpVersion(current: string, { bumpType, isBeta }: BumpOptions): string {
  const raw = current.startsWith('v') ? current.slice(1) : current;
  const betaMatch = raw.match(/^(.+)-beta(\d*)$/);

  if (betaMatch) {
    const base = betaMatch[1];
    const betaNum = betaMatch[2] ? parseInt(betaMatch[2], 10) : 1;
    if (isBeta) return `v${base}-beta${betaNum + 1}`;
    // Graduate: promote the existing base as-is
    return `v${base}`;
  }

  const parts = raw.split('.').map((p) => parseInt(p, 10));
  const [major = 0, minor = 0, patch = 0] = parts;

  let bumped: string;
  if (bumpType === 'major') bumped = `v${major + 1}.0.0`;
  else if (bumpType === 'minor') bumped = `v${major}.${minor + 1}.0`;
  else bumped = `v${major}.${minor}.${patch + 1}`;

  return isBeta ? `${bumped}-beta1` : bumped;
}

interface DeployModalProps {
  opened: boolean;
  onClose: () => void;
  serviceName: string;
  latestVersion: string;
}

export function DeployModal({ opened, onClose, serviceName, latestVersion }: DeployModalProps) {
  const isBetaBase = /[-.]beta\d*$/i.test(latestVersion);
  const [bumpType, setBumpType] = useState<BumpType>('patch');
  const [isBeta, setIsBeta] = useState(isBetaBase);
  const [version, setVersion] = useState(() => bumpVersion(latestVersion, { bumpType: 'patch', isBeta: isBetaBase }));

  const recompute = (nextBump: BumpType, nextBeta: boolean) => {
    setVersion(bumpVersion(latestVersion, { bumpType: nextBump, isBeta: nextBeta }));
  };

  const handleBumpTypeChange = (val: string) => {
    const next = val as BumpType;
    setBumpType(next);
    recompute(next, isBeta);
  };

  const handleBetaChange = (checked: boolean) => {
    setIsBeta(checked);
    recompute(bumpType, checked);
  };

  const handleSubmit = () => {
    console.log('Trigger deployment', { serviceName, version, bumpType, isBeta });
    onClose();
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Deploy" centered>
      <Stack gap="md">

        {isBetaBase ? (
          <Text size="sm" c="dimmed">
            Current version <strong>{latestVersion}</strong> is a beta release.
            Uncheck &ldquo;Beta release&rdquo; below to graduate it to a stable release.
          </Text>
        ) : (
          <Stack gap={4}>
            <Text size="sm" fw={500}>Bump type</Text>
            <SegmentedControl
              value={bumpType}
              onChange={handleBumpTypeChange}
              data={[
                { label: 'Patch', value: 'patch' },
                { label: 'Minor', value: 'minor' },
                { label: 'Major', value: 'major' },
              ]}
              fullWidth
            />
            <Text size="xs" c="dimmed">{BUMP_DESCRIPTIONS[bumpType]}</Text>
          </Stack>
        )}

        <Checkbox
          label="Beta release"
          checked={isBeta}
          onChange={(e) => handleBetaChange(e.currentTarget.checked)}
        />

        <TextInput
          label="Version"
          description={`Latest deployed: ${latestVersion} — auto-calculated, but editable`}
          value={version}
          onChange={(e) => setVersion(e.currentTarget.value)}
        />

        <Group justify="flex-end" mt="xs">
          <Button variant="default" onClick={onClose}>Cancel</Button>
          <Button leftSection={<IconRocket size={14} />} onClick={handleSubmit}>Deploy</Button>
        </Group>

      </Stack>
    </Modal>
  );
}
