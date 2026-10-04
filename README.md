# FieldCapture

Offline-first React Native + TypeScript field capture prototype built with Expo 57, Shopify Restyle, and Zustand.

## Demo

https://github.com/SyedSohaib456/sledge-mobile-assessment/raw/main/assets/demo.MP4

## Requirement

Build an offline React Native + TypeScript field-capture prototype that can capture or record while offline, persist locally, show sync states (pending, syncing, synced, error), and retry on reconnect.

## What It Does

- Capture title, notes, and optional photo while offline or online
- Persist all records locally with AsyncStorage (survives app restarts)
- Show per-record sync status: pending, syncing, synced, error
- Auto-retry failed syncs on reconnect (5s polling + AppState listener)
- Delete individual captures or clear all
- Pull-to-refresh to manually trigger sync

## Stack

Expo 57 | React Native 0.86 | TypeScript | Shopify Restyle | Zustand | AsyncStorage | expo-network | expo-image-picker

## Run

```bash
npm install --legacy-peer-deps
npx expo start
```

Scan QR with Expo Go.
