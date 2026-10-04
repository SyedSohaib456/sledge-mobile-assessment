import { useEffect, useRef, useState, useCallback } from 'react';
import * as Network from 'expo-network';
import { useCaptureStore } from '../store/captureStore';
import { syncPendingCaptures } from '../services/syncService';

export function useNetworkSync() {
  const [isOnline, setIsOnline] = useState(true);
  const [lastSyncAt, setLastSyncAt] = useState<number | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const wasOnlineRef = useRef(true);
  const { captures, updateSyncStatus, loadFromStorage, isLoaded } = useCaptureStore();

  const checkAndSync = useCallback(async () => {
    const state = await Network.getNetworkStateAsync();
    const online = state.isConnected === true && state.isInternetReachable !== false;
    setIsOnline(online);

    const justCameOnline = !wasOnlineRef.current && online;
    wasOnlineRef.current = online;

    if (online && !isSyncing) {
      const hasPending = useCaptureStore
        .getState()
        .captures.some(c => c.syncStatus === 'pending' || c.syncStatus === 'error');

      if (hasPending || justCameOnline) {
        setIsSyncing(true);
        try {
          await syncPendingCaptures(useCaptureStore.getState().captures, updateSyncStatus);
          setLastSyncAt(Date.now());
        } finally {
          setIsSyncing(false);
        }
      }
    }
  }, [isSyncing, updateSyncStatus]);

  // Load persisted data on mount
  useEffect(() => {
    loadFromStorage();
  }, []);

  // Sync once data is loaded
  useEffect(() => {
    if (isLoaded) {
      checkAndSync();
    }
  }, [isLoaded]);

  // Poll every 30s
  useEffect(() => {
    const interval = setInterval(checkAndSync, 30_000);
    return () => clearInterval(interval);
  }, [checkAndSync]);

  const triggerSync = useCallback(async () => {
    if (isSyncing) return;
    await checkAndSync();
  }, [checkAndSync, isSyncing]);

  return { isOnline, lastSyncAt, isSyncing, triggerSync };
}
