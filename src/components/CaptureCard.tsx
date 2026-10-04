import React from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Capture, MAX_RETRIES } from '../store/captureStore';
import { Box, Text } from '../theme';
import { SyncBadge } from './SyncBadge';

type Props = {
  capture: Capture;
  onDelete: (id: string) => void;
};

function formatDate(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function CaptureCard({ capture, onDelete }: Props) {
  return (
    <Box
      backgroundColor="cardBackground"
      borderRadius="l"
      padding="m"
      marginBottom="s"
      style={styles.card}>
      <Box flexDirection="row" justifyContent="space-between" alignItems="flex-start">
        <Box flex={1} marginRight="s">
          <Text variant="h4" numberOfLines={2}>
            {capture.title}
          </Text>
          {capture.notes ? (
            <Text variant="body" color="textSecondary" marginTop="xxs" numberOfLines={3}>
              {capture.notes}
            </Text>
          ) : null}
          <Text variant="caption" color="textMuted" marginTop="xs">
            {formatDate(capture.createdAt)}
          </Text>
        </Box>

        <Box flexDirection="row" alignItems="flex-start" style={{ gap: 8 }}>
          {capture.photoUri ? (
            <Image source={{ uri: capture.photoUri }} style={styles.thumbnail} />
          ) : null}
          <TouchableOpacity
            onPress={() => onDelete(capture.id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={styles.deleteBtn}>
            <Text style={styles.deleteIcon}>{'\u2715'}</Text>
          </TouchableOpacity>
        </Box>
      </Box>

      <Box marginTop="s" flexDirection="row" alignItems="center" justifyContent="space-between">
        <SyncBadge status={capture.syncStatus} />
        {capture.retryCount > 0 ? (
          <Text variant="caption" color="textMuted">
            {capture.retryCount >= MAX_RETRIES
              ? 'Max retries reached'
              : `Retry ${capture.retryCount}/${MAX_RETRIES}`}
          </Text>
        ) : null}
      </Box>

      {capture.syncStatus === 'error' && capture.syncError ? (
        <Text variant="caption" style={{ color: '#DC2626' }} marginTop="xxs">
          {capture.syncError}
        </Text>
      ) : null}
    </Box>
  );
}

const styles = StyleSheet.create({
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  thumbnail: {
    width: 56,
    height: 56,
    borderRadius: 10,
  },
  deleteBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  deleteIcon: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '700',
  },
});
