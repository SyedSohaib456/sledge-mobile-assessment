import { useEffect, useRef, useState, useCallback } from "react";
import { AppState } from "react-native";
import * as Network from "expo-network";
import { useCaptureStore } from "../store/captureStore";
import { syncPendingCaptures } from "../services/syncService";
import { useToast } from "../components/Toast";

export function useNetworkSync() {
  const [isOnline, setIsOnline] = useState(true);
  const [lastSyncAt, setLastSyncAt] = useState<number | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const wasOnlineRef = useRef(true);
  const isSyncingRef = useRef(false);
  const toast = useToast();

  const doSync = useCallback(async () => {
    if (isSyncingRef.current) return;

    const state = await Network.getNetworkStateAsync();
    const online =
      state.isConnected === true && state.isInternetReachable !== false;
    setIsOnline(online);

    if (!wasOnlineRef.current && online) {
      toast.success("Back online", {
        description: "Syncing pending captures...",
      });
    } else if (wasOnlineRef.current && !online) {
      toast.warning("You're offline", {
        description: "Captures will sync when reconnected",
      });
    }
    wasOnlineRef.current = online;

    if (!online) return;

    const hasPending = useCaptureStore
      .getState()
      .captures.some(
        (c) =>
          (c.syncStatus === "pending" || c.syncStatus === "error") &&
          c.retryCount < 3,
      );
    if (!hasPending) return;

    isSyncingRef.current = true;
    setIsSyncing(true);
    try {
      await syncPendingCaptures(toast);
      setLastSyncAt(Date.now());

      const stillPending = useCaptureStore
        .getState()
        .captures.some((c) => c.syncStatus === "error" && c.retryCount < 3);
      if (stillPending) {
        await syncPendingCaptures(toast);
        setLastSyncAt(Date.now());
      }
    } finally {
      isSyncingRef.current = false;
      setIsSyncing(false);
    }
  }, [toast]);

  useEffect(() => {
    useCaptureStore.getState().loadFromStorage();
  }, []);

  const isLoaded = useCaptureStore((s) => s.isLoaded);
  useEffect(() => {
    if (isLoaded) doSync();
  }, [isLoaded]);

  useEffect(() => {
    const interval = setInterval(doSync, 5_000);
    return () => clearInterval(interval);
  }, [doSync]);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (s) => {
      if (s === "active") doSync();
    });
    return () => sub.remove();
  }, [doSync]);

  const triggerSync = useCallback(async () => {
    await doSync();
  }, [doSync]);

  return { isOnline, lastSyncAt, isSyncing, triggerSync };
}
