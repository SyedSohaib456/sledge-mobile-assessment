# FieldCapture — Offline Field Capture Prototype

A React Native + TypeScript prototype built with Expo 57 demonstrating offline-first data capture, local persistence, sync state management, and automatic retry on reconnect.

## Tech Stack

| Layer | Library |
|---|---|
| Framework | Expo 57 (Expo Go compatible) |
| UI / Theme | Shopify Restyle + Urbanist font |
| State | Zustand |
| Persistence | AsyncStorage |
| Network | expo-network |
| Toasts | sonner-native |
| Photo picker | expo-image-picker |
| Type safety | TypeScript (strict) |

## Features

- **Offline capture** — add title, notes, and an optional photo with no network required
- **Local persistence** — all records stored via AsyncStorage, survive app restarts
- **Sync states** — each card shows `pending`, `syncing`, `synced`, or `error`
- **Retry tracking** — failed syncs show `Retry N/3`; stops after 3 attempts
- **Auto retry on reconnect** — `useNetworkSync` detects network changes and triggers sync
- **Pull-to-refresh** — manually trigger a sync cycle
- **30s polling** — background network check every 30 seconds
- **Sonner toasts** — feedback on save, sync results, online/offline transitions

## Getting Started

```bash
npm install --legacy-peer-deps
npx expo start
```

Scan the QR code with Expo Go (iOS or Android).

## Project Structure

```
src/
  components/
    CaptureCard.tsx     # Card with sync badge + retry counter
    EmptyState.tsx      # Illustrated empty screen
    StatsRow.tsx        # Header stats grid
    SyncBadge.tsx       # Sync status pill
  hooks/
    useNetworkSync.ts   # Network detection + sync orchestration
  screens/
    CaptureModal.tsx    # New capture form with offline banner
    HomeScreen.tsx      # Main list + FAB + header
  services/
    syncService.ts      # Simulated API sync (25% failure rate)
  store/
    captureStore.ts     # Zustand store + AsyncStorage persistence
  theme/
    theme.ts            # Shopify Restyle theme (cyan/navy palette)
    index.ts            # Box + Text exports
```

## Sync Simulation

`syncService.ts` simulates real-world conditions:
- **1.2–2s latency** per record
- **25% random failure rate** to demo error + retry states
- **MAX_RETRIES = 3** — exhausted captures stop retrying

## Commit History

| Commit | Description |
|---|---|
| `feat:` initial | Full offline prototype — store, sync, theme, screens |
| `chore:` gitignore | Comprehensive Expo project ignore rules |
| `chore:` expo 57 | Upgrade from expo 53 → 57, RN 0.76 → 0.79 |
| `feat:` retry tracking | MAX_RETRIES cap, incrementRetry, lastAttemptAt |
| `feat:` components | StatsRow + EmptyState extracted |
| `feat:` readme | This file |
