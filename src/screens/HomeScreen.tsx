import React, { useState } from 'react';
import {
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  StatusBar,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Box, Text } from '../theme';
import { CaptureCard } from '../components/CaptureCard';
import { CaptureModal } from './CaptureModal';
import { useCaptureStore, Capture } from '../store/captureStore';
import { useNetworkSync } from '../hooks/useNetworkSync';

function formatLastSync(ts: number | null): string {
  if (!ts) return 'Never';
  const diff = Date.now() - ts;
  if (diff < 60_000) return 'Just now';
  if (diff < 3600_000) return `${Math.floor(diff / 60_000)}m ago`;
  return `${Math.floor(diff / 3600_000)}h ago`;
}

export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const captures = useCaptureStore(s => s.captures);
  const { isOnline, lastSyncAt, isSyncing, triggerSync } = useNetworkSync();

  const pendingCount = captures.filter(c => c.syncStatus === 'pending' || c.syncStatus === 'error').length;
  const syncedCount = captures.filter(c => c.syncStatus === 'synced').length;

  const onRefresh = async () => {
    setRefreshing(true);
    await triggerSync();
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: Capture }) => <CaptureCard capture={item} />;
  const keyExtractor = (item: Capture) => item.id;

  return (
    <Box flex={1} backgroundColor="mainBackground">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <Box
        style={[styles.header, { paddingTop: insets.top + 12 }]}
        backgroundColor="headerBackground"
        paddingHorizontal="m"
        paddingBottom="m">
        <Box flexDirection="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Text variant="h2" color="textInverse">
              FieldCapture
            </Text>
            <Box flexDirection="row" alignItems="center" marginTop="xxs">
              <Box
                style={[styles.networkDot, { backgroundColor: isOnline ? '#4ADE80' : '#F87171' }]}
              />
              <Text variant="caption" color="textAccent">
                {isOnline ? 'Online' : 'Offline'}
                {isSyncing ? ' · Syncing...' : ''}
              </Text>
            </Box>
          </Box>
          <Box alignItems="flex-end">
            <Text variant="caption" style={{ color: '#94A3B8' }}>
              Last sync
            </Text>
            <Text variant="caption" color="textAccent">
              {formatLastSync(lastSyncAt)}
            </Text>
          </Box>
        </Box>

        {/* Stats row */}
        <Box flexDirection="row" marginTop="m" gap="s">
          <Box flex={1} style={styles.statCard}>
            <Text variant="h3" style={{ color: '#53EAFD' }}>
              {captures.length}
            </Text>
            <Text variant="caption" style={{ color: '#94A3B8' }}>
              Total
            </Text>
          </Box>
          <Box flex={1} style={styles.statCard}>
            <Text variant="h3" style={{ color: '#4ADE80' }}>
              {syncedCount}
            </Text>
            <Text variant="caption" style={{ color: '#94A3B8' }}>
              Synced
            </Text>
          </Box>
          <Box flex={1} style={styles.statCard}>
            <Text variant="h3" style={{ color: pendingCount > 0 ? '#FBBF24' : '#94A3B8' }}>
              {pendingCount}
            </Text>
            <Text variant="caption" style={{ color: '#94A3B8' }}>
              Pending
            </Text>
          </Box>
        </Box>
      </Box>

      {/* List */}
      <FlatList
        data={captures}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={[
          styles.list,
          captures.length === 0 && styles.listEmpty,
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#53EAFD"
            colors={['#53EAFD']}
          />
        }
        ListEmptyComponent={
          <Box flex={1} alignItems="center" justifyContent="center" paddingTop="xxxl">
            <Text style={styles.emptyIcon}>📋</Text>
            <Text variant="h3" color="textSecondary" marginTop="m">
              No captures yet
            </Text>
            <Text variant="body" color="textMuted" marginTop="xs" style={{ textAlign: 'center' }}>
              Tap the + button to add your first field capture
            </Text>
          </Box>
        }
      />

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 24 }]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.85}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      <CaptureModal
        visible={modalVisible}
        isOnline={isOnline}
        onClose={() => setModalVisible(false)}
        onSaved={triggerSync}
      />
    </Box>
  );
}

const styles = StyleSheet.create({
  header: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  networkDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  statCard: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  listEmpty: {
    flexGrow: 1,
  },
  emptyIcon: {
    fontSize: 48,
  },
  fab: {
    position: 'absolute',
    right: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#53EAFD',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#53EAFD',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 10,
  },
  fabIcon: {
    fontSize: 28,
    color: '#0F1923',
    fontWeight: '700',
    lineHeight: 32,
  },
});
