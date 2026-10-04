import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { Capture } from '../store/captureStore';
import { Box, Text } from '../theme';
import { SyncBadge } from './SyncBadge';

type Props = { capture: Capture };

function formatDate(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function CaptureCard({ capture }: Props) {
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

        {capture.photoUri ? (
          <Image source={{ uri: capture.photoUri }} style={styles.thumbnail} />
        ) : null}
      </Box>

      <Box marginTop="s" flexDirection="row" alignItems="center">
        <SyncBadge status={capture.syncStatus} />
      </Box>

      {capture.syncStatus === 'error' && capture.syncError ? (
        <Text variant="caption" style={{ color: '#F87171' }} marginTop="xxs">
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
    width: 72,
    height: 72,
    borderRadius: 10,
  },
});
