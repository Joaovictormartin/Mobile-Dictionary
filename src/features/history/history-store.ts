import { create } from "zustand";

import type { HistoryItem } from "@/types/word";
import { getUserStorageKey, STORAGE_KEYS } from "@/constants/storage";
import { readStorage, writeStorage } from "@/services/storage/async-storage";

type HistoryState = {
  hydrated: boolean;
  history: HistoryItem[];
  activeUserId: string | null;
  clearHistory: () => Promise<void>;
  registerWord: (word: string) => Promise<void>;
  hydrate: (userId: string | null) => Promise<void>;
};

export const useHistoryStore = create<HistoryState>((set, get) => ({
  history: [],
  activeUserId: null,
  hydrated: false,
  hydrate: async (userId) => {
    if (!userId) {
      set({ history: [], activeUserId: null, hydrated: true });
      return;
    }
    const history = await readStorage<HistoryItem[]>(
      getUserStorageKey(STORAGE_KEYS.history, userId),
      [],
    );
    set({ history, activeUserId: userId, hydrated: true });
  },
  registerWord: async (word) => {
    const userId = get().activeUserId;
    if (!userId) return;
    const normalized = word.toLowerCase();
    const nextItem = {
      word: normalized,
      lastViewedAt: new Date().toISOString(),
    };
    const history = [
      nextItem,
      ...get().history.filter((item) => item.word !== normalized),
    ];
    set({ history });
    await writeStorage(
      getUserStorageKey(STORAGE_KEYS.history, userId),
      history,
    );
  },
  clearHistory: async () => {
    const userId = get().activeUserId;
    if (!userId) return;
    set({ history: [] });
    await writeStorage(getUserStorageKey(STORAGE_KEYS.history, userId), []);
  },
}));
