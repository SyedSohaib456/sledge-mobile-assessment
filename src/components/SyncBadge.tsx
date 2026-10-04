import React from 'react';
import { SyncStatus } from '../store/captureStore';
import { Box, Text } from '../theme';

type Props = { status: SyncStatus };

const CONFIG: Record<SyncStatus, { label: string; bg: string; color: string }> = {
  pending: { label: '● Pending', bg: '#1E293B', color: '#94A3B8' },
  syncing: { label: '↻ Syncing...', bg: '#1E3A5F', color: '#60A5FA' },
  synced: { label: '✓ Synced', bg: '#14532D', color: '#4ADE80' },
  error: { label: '✕ Failed', bg: '#7F1D1D', color: '#F87171' },
};

export function SyncBadge({ status }: Props) {
  const { label, bg, color } = CONFIG[status];
  return (
    <Box
      borderRadius="full"
      paddingHorizontal="xs"
      paddingVertical="xxs"
      style={{ backgroundColor: bg, alignSelf: 'flex-start' }}>
      <Text variant="label" style={{ color, fontSize: 11 }}>
        {label}
      </Text>
    </Box>
  );
}
