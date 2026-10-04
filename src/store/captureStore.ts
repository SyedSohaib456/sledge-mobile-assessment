import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type SyncStatus = 'pending' | 'syncing' | 'synced' | 'error';

export type Capture = {
  id: string;
  title: string;
  notes: string;
  photoUri?: string;
  createdAt: number;
  syncStatus: SyncStatus;
  syncError?: string;
};

type CaptureStore = {
  captures: Capture[];
  isLoaded: boolean;
  addCapture: (title: string, notes: string, photoUri?: string) => void;
  updateSyncStatus: (id: string, status: SyncStatus, error?: string) => void;
  loadFromStorage: () => Promise<void>;
  persistToStorage: (captures: Capture[]) => Promise<void>;
};

const STORAGE_KEY = 'sledge_captures';

export const useCaptureStore = create<CaptureStore>((set, get) => ({
  captures: [],
  isLoaded: false,

  addCapture: (title, notes, photoUri) => {
    const newCapture: Capture = {
      id: `capture_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      title,
      notes,
      photoUri,
      createdAt: Date.now(),
      syncStatus: 'pending',
    };
    const updated = [newCapture, ...get().captures];
    set({ captures: updated });
    get().persistToStorage(updated);
  },

  updateSyncStatus: (id, status, error) => {
    const updated = get().captures.map(c =>
      c.id === id ? { ...c, syncStatus: status, syncError: error } : c,
    );
    set({ captures: updated });
    get().persistToStorage(updated);
  },

  loadFromStorage: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const captures: Capture[] = JSON.parse(raw);
        // Reset any 'syncing' captures back to 'pending' on load (app was killed mid-sync)
        const normalized = captures.map(c =>
          c.syncStatus === 'syncing' ? { ...c, syncStatus: 'pending' as SyncStatus } : c,
        );
        set({ captures: normalized, isLoaded: true });
      } else {
        set({ isLoaded: true });
      }
    } catch {
      set({ isLoaded: true });
    }
  },

  persistToStorage: async captures => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(captures));
    } catch {
      // silently fail — data is still in memory
    }
  },
}));
