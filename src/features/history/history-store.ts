import { create } from 'zustand';

import { STORAGE_KEYS } from '@/constants/storage';
import { readStorage, writeStorage } from '@/services/storage/async-storage';
import type { HistoryItem } from '@/types/word';

type HistoryState = {
  history: HistoryItem[];
  hydrated: boolean;
  hydrate: () => Promise<void>;
  registerWord: (word: string) => Promise<void>;
};

export const useHistoryStore = create<HistoryState>((set, get) => ({
  history: [],
  hydrated: false,
  hydrate: async () => {
    const history = await readStorage<HistoryItem[]>(STORAGE_KEYS.history, []);
    set({ history });
    set({ hydrated: true });
  },
  registerWord: async (word) => {
    const normalized = word.toLowerCase();
    const nextItem = { word: normalized, lastViewedAt: new Date().toISOString() };
    const history = [nextItem, ...get().history.filter((item) => item.word !== normalized)];
    set({ history });
    await writeStorage(STORAGE_KEYS.history, history);
  },
}));
