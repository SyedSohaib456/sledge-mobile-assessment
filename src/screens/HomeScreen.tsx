import React, { useState } from "react";
import {
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  StatusBar,
  Alert,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Box, Text } from "../theme";
import { CaptureCard } from "../components/CaptureCard";
import { EmptyState } from "../components/EmptyState";
import { CaptureModal } from "./CaptureModal";
import { useCaptureStore, Capture } from "../store/captureStore";
import { useNetworkSync } from "../hooks/useNetworkSync";

function formatLastSync(ts: number | null): string {
  if (!ts) return "Never";
  const diff = Date.now() - ts;
  if (diff < 60_000) return "Just now";
  if (diff < 3600_000) return `${Math.floor(diff / 60_000)}m ago`;
  return `${Math.floor(diff / 3600_000)}h ago`;
}

export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const captures = useCaptureStore((s) => s.captures);
  const deleteCapture = useCaptureStore((s) => s.deleteCapture);
  const clearAll = useCaptureStore((s) => s.clearAll);
  const { isOnline, lastSyncAt, isSyncing, triggerSync } = useNetworkSync();

  const pendingCount = captures.filter(
    (c) => c.syncStatus === "pending" || c.syncStatus === "error",
  ).length;
  const syncedCount = captures.filter((c) => c.syncStatus === "synced").length;
  const errorCount = captures.filter((c) => c.syncStatus === "error").length;

  const onRefresh = async () => {
    setRefreshing(true);
    await triggerSync();
    setRefreshing(false);
  };

  const handleDelete = (id: string) => {
    Alert.alert("Delete Capture", "This will remove it permanently.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteCapture(id),
      },
    ]);
  };

  const handleClearAll = () => {
    if (captures.length === 0) return;
    Alert.alert(
      "Clear All",
      `Delete all ${captures.length} captures and clear storage?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Clear All", style: "destructive", onPress: () => clearAll() },
      ],
    );
  };

  const renderItem = ({ item }: { item: Capture }) => (
    <CaptureCard capture={item} onDelete={handleDelete} />
  );
  const keyExtractor = (item: Capture) => item.id;

  return (
    <Box flex={1} backgroundColor="mainBackground">
      <StatusBar barStyle="dark-content" />

      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.topRow}>
          <Text style={styles.title}>FieldCapture</Text>

          <View style={styles.topRight}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: isOnline ? "#22C55E" : "#EF4444" },
              ]}
            />
            <Text
              style={[
                styles.statusLabel,
                { color: isOnline ? "#16A34A" : "#DC2626" },
              ]}
            >
              {isOnline ? "Online" : "Offline"}
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statsLeft}>
            <View style={styles.statBlock}>
              <Text style={styles.statNumber}>{captures.length}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBlock}>
              <Text style={[styles.statNumber, { color: "#16A34A" }]}>
                {syncedCount}
              </Text>
              <Text style={styles.statLabel}>Synced</Text>
            </View>
            {pendingCount > 0 && (
              <>
                <View style={styles.statDivider} />
                <View style={styles.statBlock}>
                  <Text style={[styles.statNumber, { color: "#D97706" }]}>
                    {pendingCount}
                  </Text>
                  <Text style={styles.statLabel}>Pending</Text>
                </View>
              </>
            )}
            {errorCount > 0 && (
              <>
                <View style={styles.statDivider} />
                <View style={styles.statBlock}>
                  <Text style={[styles.statNumber, { color: "#DC2626" }]}>
                    {errorCount}
                  </Text>
                  <Text style={styles.statLabel}>Failed</Text>
                </View>
              </>
            )}
          </View>

          <View>
            <Text style={styles.syncText}>
              {isSyncing ? "Syncing..." : formatLastSync(lastSyncAt)}
            </Text>
            {captures.length > 0 && (
              <TouchableOpacity
                onPress={handleClearAll}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.clearText}>Clear all</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

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
            tintColor="#0D3D52"
            colors={["#0D3D52"]}
          />
        }
        ListEmptyComponent={<EmptyState isOnline={isOnline} />}
      />

      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 24 }]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.85}
      >
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
    backgroundColor: "#FFFFFF",
    paddingBottom: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontFamily: "Urbanist-Bold",
    fontSize: 26,
    color: "#0F1923",
  },
  topRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusLabel: {
    fontFamily: "Urbanist-Bold",
    fontSize: 13,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
  },
  statsLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  statBlock: {
    alignItems: "center",
    paddingHorizontal: 14,
  },
  statNumber: {
    fontFamily: "Urbanist-Bold",
    fontSize: 22,
    color: "#0F1923",
  },
  statLabel: {
    fontFamily: "Urbanist-Regular",
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 1,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: "#E2E8F0",
  },
  clearText: {
    fontFamily: "Urbanist-Medium",
    fontSize: 13,
    color: "#DC2626",
  },
  syncText: {
    fontFamily: "Urbanist-Regular",
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 10,
  },
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  listEmpty: {
    flexGrow: 1,
  },
  fab: {
    position: "absolute",
    right: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#0D3D52",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0D3D52",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  fabIcon: {
    fontSize: 28,
    color: "#53EAFD",
    fontWeight: "700",
    lineHeight: 32,
  },
});
