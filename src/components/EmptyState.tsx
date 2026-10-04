import React from 'react';
import { StyleSheet } from 'react-native';
import { Box, Text } from '../theme';
import { ClipboardIcon, WifiOffIcon } from './Icons';

type Props = {
  isOnline: boolean;
};

export function EmptyState({ isOnline }: Props) {
  return (
    <Box flex={1} alignItems="center" justifyContent="center" padding="xxl">
      <Box style={styles.iconRing} alignItems="center" justifyContent="center">
        <ClipboardIcon size={44} color="#53EAFD" />
      </Box>

      <Text variant="h3" color="textPrimary" marginTop="l" style={{ textAlign: 'center' }}>
        No captures yet
      </Text>
      <Text variant="body" color="textMuted" marginTop="xs" style={{ textAlign: 'center', maxWidth: 260 }}>
        Tap the{' '}
        <Text variant="bodyMedium" style={{ color: '#0D3D52' }}>
          +
        </Text>{' '}
        button to record your first field capture. Works offline too.
      </Text>

      {!isOnline ? (
        <Box style={styles.offlinePill} flexDirection="row" alignItems="center" marginTop="l">
          <WifiOffIcon size={14} color="#F59E0B" />
          <Text variant="caption" style={{ color: '#92400E', marginLeft: 6 }}>
            Offline mode active
          </Text>
        </Box>
      ) : null}
    </Box>
  );
}

const styles = StyleSheet.create({
  iconRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#F0FDFF',
    borderWidth: 1,
    borderColor: '#E0F7FA',
  },
  offlinePill: {
    backgroundColor: '#FFFBEB',
    borderRadius: 9999,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
});
