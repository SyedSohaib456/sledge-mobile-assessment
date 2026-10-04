import React from 'react';
import { ActivityIndicator } from 'react-native';
import { SyncStatus } from '../store/captureStore';
import { Box, Text } from '../theme';
import { CheckCircleIcon, XCircleIcon, RefreshIcon } from './Icons';

type Props = { status: SyncStatus };

const CONFIG: Record<SyncStatus, { label: string; bg: string; color: string; borderColor: string }> = {
  pending:  { label: 'Pending',    bg: '#F8FAFC', color: '#64748B', borderColor: '#E2E8F0' },
  syncing:  { label: 'Syncing...', bg: '#EFF6FF', color: '#3B82F6', borderColor: '#BFDBFE' },
  synced:   { label: 'Synced',     bg: '#F0FDF4', color: '#16A34A', borderColor: '#BBF7D0' },
  error:    { label: 'Failed',     bg: '#FEF2F2', color: '#DC2626', borderColor: '#FECACA' },
};

function StatusIcon({ status, color }: { status: SyncStatus; color: string }) {
  switch (status) {
    case 'synced':  return <CheckCircleIcon size={12} color={color} />;
    case 'error':   return <XCircleIcon size={12} color={color} />;
    case 'syncing': return <ActivityIndicator size={10} color={color} />;
    default:        return <RefreshIcon size={12} color={color} />;
  }
}

export function SyncBadge({ status }: Props) {
  const { label, bg, color, borderColor } = CONFIG[status];
  return (
    <Box
      borderRadius="full"
      paddingHorizontal="xs"
      paddingVertical="xxs"
      flexDirection="row"
      alignItems="center"
      style={{ backgroundColor: bg, alignSelf: 'flex-start', borderWidth: 1, borderColor, gap: 4 }}>
      <StatusIcon status={status} color={color} />
      <Text variant="label" style={{ color, fontSize: 11 }}>
        {label}
      </Text>
    </Box>
  );
}
